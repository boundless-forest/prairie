import { NextResponse } from 'next/server';

// Mock token price data
const mockPrices = [
  { id: '1', symbol: 'ETH', name: 'Ethereum', price: '3500.50' },
  { id: '2', symbol: 'BTC', name: 'Bitcoin', price: '65000.75' },
  { id: '3', symbol: 'USDC', name: 'USD Coin', price: '1.00' },
  { id: '4', symbol: 'LINK', name: 'Chainlink', price: '18.25' },
  { id: '5', symbol: 'UNI', name: 'Uniswap', price: '10.50' },
  // Add more mock tokens if needed
];

export async function GET() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500)); 

  return NextResponse.json({ prices: mockPrices });
}