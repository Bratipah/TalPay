import type React from "react"
import { createAppKit } from "@reown/appkit/react"
import { WagmiProvider } from "wagmi"
import { arbitrum, mainnet } from "@reown/appkit/networks"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi"

// 1. Get projectId from https://cloud.reown.com
const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || "your-project-id"

// 2. Create a metadata object - optional
const metadata = {
  name: "ICP Payroll System",
  description: "Decentralized payroll management on Internet Computer",
  url: "https://icp-payroll.vercel.app", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
}

// 3. Set the networks
const networks = [mainnet, arbitrum]

// 4. Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
})

// 5. Create modal
export const modal = createAppKit({
  adapters: [wagmiAdapter],
  networks: [mainnet, arbitrum],
  projectId,
  metadata,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
    email: true, // default to true
    socials: ["google", "github", "apple", "facebook", "x"], // Enable social logins
    emailShowWallets: true, // default to true
  },
})

export function AppKitProvider({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient()

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}

// Utility functions for wallet integration
export const connectWallet = async () => {
  try {
    await modal.open()
    return true
  } catch (error) {
    console.error("Failed to connect wallet:", error)
    return false
  }
}

export const disconnectWallet = async () => {
  try {
    await modal.close()
    return true
  } catch (error) {
    console.error("Failed to disconnect wallet:", error)
    return false
  }
}

// Hook for wallet connection status
export const useWalletConnection = () => {
  // This would integrate with Reown's hooks in a real implementation
  return {
    isConnected: false,
    address: null,
    chainId: null,
    connect: connectWallet,
    disconnect: disconnectWallet,
  }
}
