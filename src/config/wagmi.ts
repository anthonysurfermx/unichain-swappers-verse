import { http, createConfig } from 'wagmi'
import { mainnet, polygon, arbitrum } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

export const config = createConfig({
  chains: [mainnet, polygon, arbitrum],
  connectors: [
    injected(),
    walletConnect({ 
      projectId: 'YOUR_PROJECT_ID', // Users should add their own WalletConnect project ID
      showQrModal: true 
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
  },
})
