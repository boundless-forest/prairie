'use client';

import { useAccount, useDisconnect } from 'wagmi';

export default function Home() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">WalletConnect Dapp</h1>

      <div className="mb-4">
        <w3m-button />
      </div>

      {isConnected && (
        <div className="text-center">
          <p className="mb-2">Connected Address: {address}</p>
          <button
            onClick={() => disconnect()}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Disconnect
          </button>
        </div>
      )}
    </main>
  );
}
