import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { headers } from 'next/headers';
import { cookieToInitialState } from 'wagmi';

import Web3ModalProvider from '@/context';
import { wagmiConfig } from '@/config';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WalletConnect Dapp",
  description: "Simple WalletConnect Dapp with Reown AppKit",
};

// Make the component async
export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // Await headers()
  const initialState = cookieToInitialState(wagmiConfig, (await headers()).get('cookie'));
  return (
    <html lang="en">
      <body className={inter.className}>
        <Web3ModalProvider initialState={initialState}>{children}</Web3ModalProvider>
      </body>
    </html>
  );
}
