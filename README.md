# 🎯 Unichain Prediction Market - Swappers MX

A decentralized prediction market built on **Unichain Sepolia** for predicting whether the Uniswap Telegram group will reach 1,000 members before October 31, 2025.

![Unichain](https://img.shields.io/badge/Unichain-Sepolia-blue)
![Solidity](https://img.shields.io/badge/Solidity-^0.8.20-green)
![React](https://img.shields.io/badge/React-18.3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)

## 🚀 Features

- ✅ **On-chain trading** - All trades are executed on Unichain Sepolia
- ✅ **AMM-based pricing** - Constant product formula for fair pricing
- ✅ **Real-time updates** - Live probability and price updates
- ✅ **Wallet integration** - Connect with MetaMask, Rainbow, etc.
- ✅ **Simple UI** - Clean, Polymarket-inspired interface

## 🛠️ Tech Stack

### Frontend
- **React** + **TypeScript** + **Vite**
- **wagmi** + **viem** - Ethereum interactions
- **RainbowKit** - Wallet connection
- **shadcn/ui** + **Tailwind CSS** - UI components
- **Supabase** - Backend (optional for tracking)

### Smart Contracts
- **Solidity ^0.8.20**
- **Unichain Sepolia** testnet

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/unichain-swappers-verse
cd unichain-swappers-verse

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your WalletConnect Project ID
```

### Environment Variables

Edit `.env`:

```env
VITE_WALLETCONNECT_PROJECT_ID=your_project_id_here
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
```

Get your WalletConnect Project ID from: https://cloud.walletconnect.com

## 🔧 Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📝 Smart Contract Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions on deploying the smart contract to Unichain Sepolia.

Quick steps:
1. Configure MetaMask for Unichain Sepolia
2. Get test ETH from [Unichain Faucet](https://faucet.unichain.org)
3. Deploy using [Remix IDE](https://remix.ethereum.org)
4. Update contract address in `src/config/contract.ts`

## 🎮 How to Use

1. **Connect Wallet** - Click "Connect" and choose your wallet
2. **Switch to Unichain Sepolia** - Make sure you're on the right network
3. **Buy Shares** - Choose YES or NO and enter number of shares
4. **Monitor Market** - Watch real-time probability updates
5. **Claim Winnings** - After resolution, claim if you predicted correctly

## 📊 Contract Details

- **Network**: Unichain Sepolia (Chain ID: 1301)
- **RPC URL**: `https://sepolia.unichain.org`
- **Explorer**: https://sepolia.uniscan.xyz
- **Contract**: See `contracts/PredictionMarket.sol`

### Key Functions

```solidity
buyShares(bool isYes, uint256 shares) - Buy YES or NO shares
sellShares(bool isYes, uint256 shares) - Sell your shares
claimWinnings() - Claim after market resolves
getYesProbability() - Get current YES probability
getUserPosition(address) - Check user positions
```

## 🌐 Deployment

This project can be deployed to:
- Vercel
- Netlify
- Lovable (https://lovable.dev)

```bash
npm run build
# Deploy the `dist` folder
```

## 🔗 Useful Links

- [Unichain Docs](https://docs.unichain.org)
- [Unichain Sepolia Faucet](https://faucet.unichain.org)
- [Unichain Explorer](https://sepolia.uniscan.xyz)
- [WalletConnect Cloud](https://cloud.walletconnect.com)

## ⚠️ Disclaimer

This is a **hobby project** for educational purposes. Use at your own risk. Only use testnet ETH.

## 📄 License

MIT

## 🤝 Contributing

This is a personal hobby project, but feel free to fork and experiment!

---

## 📚 Original Lovable Project

**URL**: https://lovable.dev/projects/ca5eda7e-7a52-4b91-bd40-28516f89e413

This project was initially created with Lovable and enhanced with on-chain functionality.

---

Built with ❤️ on Unichain
