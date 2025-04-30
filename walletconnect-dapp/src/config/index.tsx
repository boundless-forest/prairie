import { defaultWagmiConfig } from '@reown/appkit';
import { mainnet, sepolia } from 'wagmi/chains';

// Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) throw new Error('Project ID is not defined');

const metadata = {
  name: 'WalletConnect Dapp',
  description: 'A simple dapp to connect with WalletConnect',
  url: 'http://localhost:3000', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/179229932'],
};

// Create wagmiConfig
const chains = [mainnet, sepolia] as const;
export const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true, // Enable SSR
});
