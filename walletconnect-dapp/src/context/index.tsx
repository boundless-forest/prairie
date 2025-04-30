'use client';

import React, { type ReactNode } from 'react';
import { wagmiConfig, projectId } from '@/config';
// Corrected import for Reown AppKit
import { createAppKit } from '@reown/appkit/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type State, WagmiProvider } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains'; // Import chains used in config

// Setup queryClient
const queryClient = new QueryClient();

if (!projectId) throw new Error('Project ID is not defined');

// Create Reown AppKit modal
createAppKit({
  wagmiConfig: wagmiConfig, // Pass the wagmi config
  projectId,
  chains: [mainnet, sepolia], // Pass the chains
  // Add other config from the guide if needed, e.g., metadata, defaultNetwork
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  // enableOnramp: true // Optional - false as default - might need specific config
});

export default function Web3ModalProvider({ children, initialState }: { children: ReactNode; initialState?: State }) {
  return (
    <WagmiProvider config={wagmiConfig} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
