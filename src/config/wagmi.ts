import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { defineChain } from 'viem';

// Unichain Sepolia Testnet
export const unichainSepolia = defineChain({
  id: 1301,
  name: 'Unichain Sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://sepolia.unichain.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Uniscan',
      url: 'https://sepolia.uniscan.xyz',
    },
  },
  testnet: true,
});

// Unichain Mainnet (for future use)
export const unichain = defineChain({
  id: 130,
  name: 'Unichain',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://mainnet.unichain.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Uniscan',
      url: 'https://uniscan.xyz',
    },
  },
  testnet: false,
});

export const config = getDefaultConfig({
  appName: 'Unichain Prediction Market',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '0000000000000000000000000000000', // Get this from https://cloud.walletconnect.com
  chains: [unichain], // MAINNET - Chain ID 130
  ssr: false,
});
