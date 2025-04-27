import { NextResponse } from 'next/server';
import { getTokenInfo, WELL_KNOWN_TOKENS } from '@/utils/erc20';
import { saveToken } from '@/utils/db';
import type { Token } from '@/generated/prisma'; // Changed import path

// POST /api/tokens/refresh - Refresh all token data from the blockchain
export async function POST() {
  try {
    const results: Token[] = [];

    // Fetch and update data for each token in parallel
    await Promise.all(
      WELL_KNOWN_TOKENS.map(async (tokenConfig) => {
        try {
          // Get token info from the blockchain
          const tokenInfo = await getTokenInfo(tokenConfig.address);
          
          // Add logo URL to the token info
          const tokenData = {
            ...tokenInfo,
            logoUrl: tokenConfig.logoUrl,
          };
          
          // Save token to the database
          const savedToken = await saveToken(tokenData);
          results.push(savedToken);
        } catch (error) {
          console.error(`Error refreshing token ${tokenConfig.address}:`, error);
          // Continue with other tokens even if one fails
        }
      })
    );

    return NextResponse.json({ 
      message: 'Token data refreshed',
      // Convert BigInt decimals to string for JSON serialization
      tokens: results.map(token => ({
        ...token,
        decimals: token.decimals.toString(),
      })) 
    });
  } catch (error) {
    console.error('Error refreshing token data:', error);
    return NextResponse.json(
      { error: 'Failed to refresh token data' },
      { status: 500 }
    );
  }
}