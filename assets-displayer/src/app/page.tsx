'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Token type definition
type Token = {
  id: string;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
  logoUrl?: string;
  createdAt: string;
  updatedAt: string;
};

// Format large numbers with commas
const formatNumber = (value: string, decimals: number): string => {
  // Convert from wei to token units
  const divisor = BigInt(10) ** BigInt(decimals);
  const valueInTokenUnits = BigInt(value) / divisor;
  
  // Format with commas
  return valueInTokenUnits.toLocaleString();
};

// Function to shorten Ethereum addresses
const shortenAddress = (address: string): string => {
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

export default function Home() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false); // Keep track of refresh state
  const [error, setError] = useState<string | null>(null);

  // Fetch tokens from the API
  const fetchTokens = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tokens');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch tokens');
      }
      
      setTokens(data.tokens);
      setError(null);
    } catch (error) {
      console.error('Error fetching tokens:', error);
      setError('Failed to load token data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Refresh token data from the blockchain
  const refreshTokenData = async () => {
    try {
      setRefreshing(true); // Set refreshing state to true
      setError(null); // Clear previous errors
      const response = await fetch('/api/tokens/refresh', {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to refresh tokens');
      }
      
      // Fetch updated token data after successful refresh
      await fetchTokens();
    } catch (error) {
      console.error('Error refreshing tokens:', error);
      // Display specific error from API if available, otherwise generic message
      setError(error instanceof Error ? error.message : 'Failed to refresh token data. Please try again later.');
    } finally {
      setRefreshing(false); // Set refreshing state back to false
    }
  };

  // Fetch tokens on component mount
  useEffect(() => {
    fetchTokens();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center p-10">
      <h1 className="text-3xl font-bold mb-6">Token Assets</h1>

      {/* Add link to Prices Page */}
      <div className="mb-6 flex space-x-4">
        <Link href="/prices" className="text-blue-500 hover:underline">
          View Mock Token Prices
        </Link>
        {/* Add Refresh Button */}
        <button
          onClick={refreshTokenData}
          disabled={refreshing} // Disable button while refreshing
          className={`px-4 py-2 rounded ${
            refreshing 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-700 text-white'
          }`}
        >
          {refreshing ? 'Refreshing...' : 'Refresh Token Data'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 w-full max-w-4xl">
          {error}
        </div>
      )}

      {/* Keep loading indicator */}
      {loading && !refreshing && ( // Only show initial loading spinner if not refreshing
         <div className="flex items-center justify-center h-64">
           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
         </div>
       )}

      {/* Adjust message when no tokens and not loading */}
      {!loading && tokens.length === 0 && !error && ( // Show only if not loading, no tokens, and no error
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4 w-full max-w-4xl">
          <p>No token data available. Click "Refresh Token Data" above to fetch information from the blockchain.</p>
        </div>
      )}

      {/* Display table only if not initial loading and tokens exist */}
      {!loading && tokens.length > 0 && (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow w-full max-w-4xl">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Token</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Symbol</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total Supply</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Decimals</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {tokens.map((token) => (
                <tr key={token.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {token.logoUrl ? (
                        <div className="flex-shrink-0 h-10 w-10 mr-4">
                          <Image
                            className="h-10 w-10 rounded-full"
                            src={token.logoUrl}
                            alt={`${token.name} logo`}
                            width={40}
                            height={40}
                            onError={(e) => { // Add basic error handling for images
                              e.currentTarget.style.display = 'none'; // Hide broken image icon
                              // Optionally show a placeholder div
                              const placeholder = e.currentTarget.parentElement?.querySelector('.placeholder-icon');
                              // Cast placeholder to HTMLElement to access style property
                              if (placeholder && placeholder instanceof HTMLElement) {
                                placeholder.style.display = 'block';
                              }
                            }}
                          />
                           {/* Placeholder for when image fails */}
                           <div className="placeholder-icon flex-shrink-0 h-10 w-10 bg-gray-200 dark:bg-gray-600 rounded-full mr-4" style={{ display: 'none' }}></div>
                        </div>
                      ) : (
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 dark:bg-gray-600 rounded-full mr-4"></div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {token.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {token.symbol}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    <a 
                      href={`https://etherscan.io/token/${token.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-500"
                    >
                      {shortenAddress(token.address)}
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {/* Ensure decimals is treated as a number */}
                    {formatNumber(token.totalSupply, Number(token.decimals))} {token.symbol} 
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {/* Ensure decimals is treated as a number */}
                    {Number(token.decimals)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
