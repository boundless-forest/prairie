import { PrismaClient } from '@/generated/prisma';

// Initialize Prisma client
const prisma = new PrismaClient();

export type TokenData = {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
  logoUrl?: string;
};

export async function saveToken(tokenData: TokenData) {
  try {
    return await prisma.token.upsert({
      where: { address: tokenData.address },
      update: {
        name: tokenData.name,
        symbol: tokenData.symbol,
        decimals: tokenData.decimals,
        totalSupply: tokenData.totalSupply,
        logoUrl: tokenData.logoUrl,
      },
      create: {
        address: tokenData.address,
        name: tokenData.name,
        symbol: tokenData.symbol,
        decimals: tokenData.decimals,
        totalSupply: tokenData.totalSupply,
        logoUrl: tokenData.logoUrl,
      },
    });
  } catch (error) {
    console.error('Error saving token data:', error);
    let message = 'Unknown error';
    if (error instanceof Error) message = error.message;
    throw new Error(`Failed to save token data: ${message}`);
  }
}

export async function getAllTokens() {
  try {
    return await prisma.token.findMany({
      orderBy: { symbol: 'asc' },
    });
  } catch (error) {
    console.error('Error fetching all tokens:', error);
    let message = 'Unknown error';
    if (error instanceof Error) message = error.message;
    throw new Error(`Failed to fetch tokens: ${message}`);
  }
}

export async function getTokenByAddress(address: string) {
  try {
    return await prisma.token.findUnique({
      where: { address },
    });
  } catch (error) {
    console.error(`Error fetching token with address ${address}:`, error);
    let message = 'Unknown error';
    if (error instanceof Error) message = error.message;
    throw new Error(`Failed to fetch token: ${message}`);
  }
}

export default prisma;