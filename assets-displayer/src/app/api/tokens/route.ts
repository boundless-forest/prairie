import { NextResponse } from 'next/server';
import { getAllTokens } from '@/utils/db';

// GET /api/tokens - Get all tokens
export async function GET() {
  try {
    const tokens = await getAllTokens();
    // Convert BigInt decimals to string for JSON serialization
    const serializableTokens = tokens.map(token => ({
      ...token,
      decimals: token.decimals.toString(),
    }));
    return NextResponse.json({ tokens: serializableTokens });
  } catch (error) {
    console.error('Error fetching tokens:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tokens' },
      { status: 500 }
    );
  }
}