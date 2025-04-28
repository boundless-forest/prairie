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
  const [refreshing, setRefreshing] = useState<boolean>(false);
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
      setRefreshing(true);
      const response = await fetch('/api/tokens/refresh', {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to refresh tokens');
      }
      
      // Fetch updated token data
      await fetchTokens();
    } catch (error) {
      console.error('Error refreshing tokens:', error);
      setError('Failed to refresh token data. Please try again later.');
    } finally {
      setRefreshing(false);
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
      <div className="mb-6">
        <Link href="/prices" className="text-blue-500 hover:underline">
          View Mock Token Prices
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : tokens.length === 0 ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          <p>No token data available. Click "Refresh Token Data" to fetch information from the blockchain.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
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
                          />
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
                    {formatNumber(token.totalSupply, token.decimals)} {token.symbol}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {token.decimals}
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
