# 🚀 Deployment Guide - Unichain Prediction Market

## 📋 Prerequisites

1. MetaMask wallet installed
2. **REAL ETH on Unichain Mainnet** for gas fees (bridge from Ethereum mainnet)
3. Access to [Remix IDE](https://remix.ethereum.org)

## ⚠️ IMPORTANTE: Estamos usando MAINNET

Este proyecto se desplegará en **Unichain Mainnet (Chain ID 130)**, no en testnet. Necesitarás ETH real.

## 🔧 Step 1: Configure MetaMask for Unichain Mainnet

Add Unichain Mainnet network to MetaMask:

- **Network Name**: Unichain
- **RPC URL**: `https://mainnet.unichain.org`
- **Chain ID**: `130`
- **Currency Symbol**: `ETH`
- **Block Explorer**: `https://uniscan.xyz`

## 📝 Step 2: Deploy Contract Using Remix

1. Go to [Remix IDE](https://remix.ethereum.org)

2. Create a new file: `PredictionMarket.sol`

3. Copy the contract code from `contracts/PredictionMarket.sol`

4. Compile:
   - Select Solidity Compiler (left sidebar)
   - Choose compiler version: `0.8.20` or higher
   - Click "Compile PredictionMarket.sol"

5. Deploy:
   - Select "Deploy & Run Transactions" (left sidebar)
   - Environment: "Injected Provider - MetaMask"
   - **Make sure MetaMask is on Unichain Mainnet (Chain ID 130)**
   - **VALUE**: Enter initial liquidity (mínimo 0.002 ETH, recomendado 0.01 ETH o más)
     - Esto será la liquidez inicial del market (50% YES, 50% NO)
   - Constructor parameters:
     - `_question`: "El grupo de Telegram de Uniswap llegará a 1,000 miembros antes del 31 de Octubre 2025?"
     - `_endTime`: `1730419199` (Unix timestamp for Oct 31, 2025 23:59:59 UTC)
   - Click "Deploy"
   - **Confirm transaction in MetaMask (ESTO COSTARÁ ETH REAL + la liquidez inicial)**

6. **Copy the deployed contract address!** You'll need it for the next step.

## ⚙️ Step 3: Update Frontend Configuration

1. Open `src/config/contract.ts`

2. Replace the contract address:
   ```typescript
   export const PREDICTION_MARKET_ADDRESS = '0xYOUR_DEPLOYED_ADDRESS_HERE' as `0x${string}`;
   ```

3. Save the file

## 🎯 Step 4: Test the Market

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Connect your wallet using the "Connect" button

3. Try buying some YES or NO shares

4. Check your position in real-time

## 🌐 Step 5: Deploy to Production (Optional)

Use Lovable or Vercel:

```bash
npm run build
# Then deploy the `dist` folder to your hosting provider
```

## 📊 Contract Functions

### For Users:
- `buyShares(isYes, shares)` - Buy YES or NO shares (envía ETH)
- `sellShares(isYes, shares)` - Sell your shares back
- `claimWinnings()` - Claim after market resolves (if you won)
- `getYesProbability()` - Get current YES probability
- `getUserPosition(address)` - Check your positions

### For Owner (Market Creator):
- `resolveMarket(outcome)` - Resolve the market when the event concludes

## ⚠️ ADVERTENCIAS IMPORTANTES

1. **MAINNET DEPLOYMENT** - Esto usa ETH REAL en Unichain Mainnet
2. **Auditoría NO realizada** - Este es un contrato para hobby, NO auditado
3. **Usa cantidades pequeñas** - Solo invierte lo que puedas perder
4. **El creador resuelve el market** - Solo el deployer puede resolver el outcome
5. **Sin upgrades** - El contrato es inmutable una vez desplegado

## 🔗 Useful Links

- [Unichain Docs](https://docs.unichain.org)
- [Unichain Bridge](https://bridge.unichain.org) - Para mover ETH de Ethereum a Unichain
- [Unichain Explorer](https://uniscan.xyz)
- [Remix IDE](https://remix.ethereum.org)

## 🎮 How the AMM Works

The contract uses a simple constant product AMM (Automated Market Maker):

- **k = pool × totalShares** (constant product formula)
- As more people buy YES, the YES price increases
- As more people buy NO, the NO price increases
- Probability is calculated based on pool sizes
- Winners get proportional share of the total prize pool

Happy predicting! 🎰
