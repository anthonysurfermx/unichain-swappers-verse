import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { PREDICTION_MARKET_ABI, PREDICTION_MARKET_ADDRESS } from '@/config/contract';
import { parseEther } from 'viem';
import { toast } from 'sonner';

export function useTradingActions() {
  const { writeContract, data: hash, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Buy shares
  const buyShares = async (isYes: boolean, shares: number) => {
    try {
      const sharesBigInt = BigInt(shares);

      // Estimate cost and add 10% slippage tolerance
      const estimatedCost = parseEther((shares * 0.01).toString());
      const maxCost = (estimatedCost * 110n) / 100n; // 10% slippage

      await writeContract({
        address: PREDICTION_MARKET_ADDRESS,
        abi: PREDICTION_MARKET_ABI,
        functionName: 'buyShares',
        args: [isYes, sharesBigInt, maxCost],
        value: estimatedCost,
      });

      toast.success('Transaction submitted! Waiting for confirmation...');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to buy shares');
      console.error('Buy shares error:', error);
    }
  };

  // Sell shares
  const sellShares = async (isYes: boolean, shares: number) => {
    try {
      const sharesBigInt = BigInt(shares);

      // Set minimum payout to 0 for now (accept any slippage)
      // In production, calculate expected payout and apply slippage tolerance
      const minPayout = 0n;

      await writeContract({
        address: PREDICTION_MARKET_ADDRESS,
        abi: PREDICTION_MARKET_ABI,
        functionName: 'sellShares',
        args: [isYes, sharesBigInt, minPayout],
      });

      toast.success('Transaction submitted! Waiting for confirmation...');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to sell shares');
      console.error('Sell shares error:', error);
    }
  };

  // Claim winnings
  const claimWinnings = async () => {
    try {
      await writeContract({
        address: PREDICTION_MARKET_ADDRESS,
        abi: PREDICTION_MARKET_ABI,
        functionName: 'claimWinnings',
      });

      toast.success('Claiming winnings...');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to claim winnings');
      console.error('Claim error:', error);
    }
  };

  return {
    buyShares,
    sellShares,
    claimWinnings,
    isPending: isPending || isConfirming,
    isSuccess,
    hash,
  };
}
