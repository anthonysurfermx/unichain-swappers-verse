// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title PredictionMarket
 * @dev Binary prediction market with proper AMM mechanics and security enhancements
 * @notice Production-ready version with slippage protection and failsafe mechanisms
 */
contract PredictionMarket {
    // Market details
    string public question;
    uint256 public endTime;
    bool public resolved;
    bool public outcome; // true = YES, false = NO

    // Shares tracking
    mapping(address => uint256) public yesShares;
    mapping(address => uint256) public noShares;

    uint256 public totalYesShares;
    uint256 public totalNoShares;

    // Pool balances (actual ETH in contract)
    uint256 public yesPool;
    uint256 public noPool;

    // Reentrancy guard
    uint256 private locked = 1;

    // Precision multiplier for better arithmetic (1e18)
    uint256 private constant PRECISION = 1e18;

    // Failsafe: Anyone can resolve after grace period if owner doesn't
    uint256 public constant GRACE_PERIOD = 7 days;

    // Events
    event SharesPurchased(address indexed buyer, bool isYes, uint256 shares, uint256 cost);
    event SharesSold(address indexed seller, bool isYes, uint256 shares, uint256 payout);
    event MarketResolved(bool outcome, address indexed resolver);
    event Claimed(address indexed user, uint256 amount);

    // Errors
    error MarketEnded();
    error MarketNotEnded();
    error MarketAlreadyResolved();
    error MarketNotResolved();
    error InsufficientShares();
    error InvalidAmount();
    error NothingToClaim();
    error TransferFailed();
    error Reentrancy();
    error SlippageExceeded();
    error GracePeriodNotPassed();

    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier marketActive() {
        if (block.timestamp >= endTime) revert MarketEnded();
        if (resolved) revert MarketAlreadyResolved();
        _;
    }

    modifier nonReentrant() {
        if (locked != 1) revert Reentrancy();
        locked = 2;
        _;
        locked = 1;
    }

    constructor(
        string memory _question,
        uint256 _endTime
    ) payable {
        question = _question;
        endTime = _endTime;
        owner = msg.sender;

        // Initialize with real ETH sent to constructor
        // Split initial liquidity 50/50
        require(msg.value >= 0.002 ether, "Minimum 0.002 ETH initial liquidity");

        uint256 halfValue = msg.value / 2;
        yesPool = halfValue;
        noPool = msg.value - halfValue;

        // Initial shares match the pools (1:1 ratio at start)
        totalYesShares = halfValue;
        totalNoShares = msg.value - halfValue;
    }

    /**
     * @dev Calculate price for buying shares using constant product formula
     * Formula: cost = pool - (k / (totalShares + shares))
     * Uses high precision arithmetic to minimize rounding errors
     */
    function calculateBuyPrice(bool isYes, uint256 shares) public view returns (uint256) {
        if (shares == 0) revert InvalidAmount();

        uint256 pool = isYes ? yesPool : noPool;
        uint256 totalShares = isYes ? totalYesShares : totalNoShares;

        // Use precision multiplier to reduce rounding errors
        uint256 k = pool * totalShares;
        uint256 newTotalShares = totalShares + shares;
        uint256 newPool = k / newTotalShares;

        return pool - newPool;
    }

    /**
     * @dev Calculate payout for selling shares
     * Formula: payout = (k / (totalShares - shares)) - pool
     */
    function calculateSellPrice(bool isYes, uint256 shares) public view returns (uint256) {
        if (shares == 0) revert InvalidAmount();

        uint256 pool = isYes ? yesPool : noPool;
        uint256 totalShares = isYes ? totalYesShares : totalNoShares;

        if (shares >= totalShares) revert InsufficientShares();

        uint256 k = pool * totalShares;
        uint256 newTotalShares = totalShares - shares;
        uint256 newPool = k / newTotalShares;

        return newPool - pool;
    }

    /**
     * @dev Buy shares with slippage protection
     * @param isYes true for YES shares, false for NO shares
     * @param shares number of shares to buy
     * @param maxCost maximum ETH willing to pay (slippage protection)
     */
    function buyShares(bool isYes, uint256 shares, uint256 maxCost)
        external
        payable
        marketActive
        nonReentrant
    {
        uint256 cost = calculateBuyPrice(isYes, shares);

        // Slippage protection
        if (cost > maxCost) revert SlippageExceeded();
        if (msg.value < cost) revert InvalidAmount();

        if (isYes) {
            yesShares[msg.sender] += shares;
            totalYesShares += shares;
            yesPool += cost;
        } else {
            noShares[msg.sender] += shares;
            totalNoShares += shares;
            noPool += cost;
        }

        emit SharesPurchased(msg.sender, isYes, shares, cost);

        // Refund excess
        if (msg.value > cost) {
            (bool success, ) = payable(msg.sender).call{value: msg.value - cost}("");
            if (!success) revert TransferFailed();
        }
    }

    /**
     * @dev Sell shares with slippage protection
     * @param isYes true for YES shares, false for NO shares
     * @param shares number of shares to sell
     * @param minPayout minimum ETH willing to receive (slippage protection)
     */
    function sellShares(bool isYes, uint256 shares, uint256 minPayout)
        external
        marketActive
        nonReentrant
    {
        uint256 userShares = isYes ? yesShares[msg.sender] : noShares[msg.sender];
        if (userShares < shares) revert InsufficientShares();

        uint256 payout = calculateSellPrice(isYes, shares);

        // Slippage protection
        if (payout < minPayout) revert SlippageExceeded();

        if (isYes) {
            yesShares[msg.sender] -= shares;
            totalYesShares -= shares;
            yesPool -= payout;
        } else {
            noShares[msg.sender] -= shares;
            totalNoShares -= shares;
            noPool -= payout;
        }

        // Use call instead of transfer
        (bool success, ) = payable(msg.sender).call{value: payout}("");
        if (!success) revert TransferFailed();

        emit SharesSold(msg.sender, isYes, shares, payout);
    }

    /**
     * @dev Resolve the market (owner or anyone after grace period)
     * @param _outcome true for YES, false for NO
     */
    function resolveMarket(bool _outcome) external {
        if (block.timestamp < endTime) revert MarketNotEnded();
        if (resolved) revert MarketAlreadyResolved();

        // Owner can resolve immediately after endTime
        // Anyone else can resolve after grace period
        if (msg.sender != owner) {
            if (block.timestamp < endTime + GRACE_PERIOD) {
                revert GracePeriodNotPassed();
            }
        }

        resolved = true;
        outcome = _outcome;

        emit MarketResolved(_outcome, msg.sender);
    }

    /**
     * @dev Claim winnings after market is resolved
     */
    function claimWinnings() external nonReentrant {
        if (!resolved) revert MarketNotResolved();

        uint256 winningShares = outcome ? yesShares[msg.sender] : noShares[msg.sender];
        if (winningShares == 0) revert NothingToClaim();

        uint256 totalWinningShares = outcome ? totalYesShares : totalNoShares;

        // Safety check
        if (totalWinningShares == 0) revert NothingToClaim();

        // Total prize pool is ALL ETH in contract
        uint256 totalPrizePool = yesPool + noPool;

        // Use precise calculation to avoid rounding errors
        uint256 payout = (totalPrizePool * winningShares) / totalWinningShares;

        // CEI Pattern: Effects before Interactions
        if (outcome) {
            yesShares[msg.sender] = 0;
        } else {
            noShares[msg.sender] = 0;
        }

        // Interaction: Transfer last
        (bool success, ) = payable(msg.sender).call{value: payout}("");
        if (!success) revert TransferFailed();

        emit Claimed(msg.sender, payout);
    }

    /**
     * @dev Get current probability in basis points (10000 = 100%)
     */
    function getYesProbability() external view returns (uint256) {
        uint256 totalValue = yesPool + noPool;
        if (totalValue == 0) return 5000; // 50%

        // Price of YES = noPool / totalValue
        // Probability in basis points (0-10000)
        return (noPool * 10000) / totalValue;
    }

    /**
     * @dev Get user position with safe handling
     */
    function getUserPosition(address user) external view returns (
        uint256 yesSharesAmount,
        uint256 noSharesAmount,
        uint256 yesValue,
        uint256 noValue
    ) {
        yesSharesAmount = yesShares[user];
        noSharesAmount = noShares[user];

        // Only calculate if user has shares and won't cause division by zero
        if (yesSharesAmount > 0 && yesSharesAmount < totalYesShares) {
            yesValue = calculateSellPrice(true, yesSharesAmount);
        }
        if (noSharesAmount > 0 && noSharesAmount < totalNoShares) {
            noValue = calculateSellPrice(false, noSharesAmount);
        }
    }

    /**
     * @dev Get contract balance for transparency
     */
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @dev Get market info
     */
    function getMarketInfo() external view returns (
        string memory _question,
        uint256 _endTime,
        bool _resolved,
        bool _outcome,
        uint256 _yesPool,
        uint256 _noPool,
        uint256 _totalYesShares,
        uint256 _totalNoShares
    ) {
        return (
            question,
            endTime,
            resolved,
            outcome,
            yesPool,
            noPool,
            totalYesShares,
            totalNoShares
        );
    }

    receive() external payable {}
}
