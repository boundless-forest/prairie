'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

// Type definition for token price
type TokenPrice = {
  id: string;
  symbol: string;
  name: string;
  price: string;
};

export default function PricesPage() {
  const [prices, setPrices] = useState<TokenPrice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch prices from the mock API
  const fetchPrices = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/prices');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch prices');
      }

      setPrices(data.prices);
      setError(null);
    } catch (error) {
      console.error('Error fetching prices:', error);
      setError('Failed to load token prices. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch prices on component mount
  useEffect(() => {
    fetchPrices();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center p-10">
      <h1 className="text-3xl font-bold mb-6">Mock Token Prices</h1>

      <div className="mb-6">
        <Link href="/" className="text-blue-500 hover:underline">
          &larr; Back to Assets
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
      ) : prices.length === 0 ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          <p>No price data available.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow w-full max-w-2xl">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Symbol</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price (USD)</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {prices.map((token) => (
                <tr key={token.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {token.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {token.symbol}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white text-right">
                    ${parseFloat(token.price).toFixed(2)}
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
