import { NextResponse } from 'next/server';
import { getTokenInfo } from '@/utils/erc20';
import { saveToken } from '@/utils/db';
import type { Token } from '@/generated/prisma';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

interface TokenConfig {
  address: string;
  logoUrl: string;
}

// Function to load tokens from YAML config
const loadTokensFromConfig = (): TokenConfig[] => {
  const configPath = path.resolve(process.cwd(), 'config/tokens.yaml');
  try {
    const fileContents = fs.readFileSync(configPath, 'utf8');
    const data = yaml.load(fileContents);
    // Basic validation
    if (!Array.isArray(data) || !data.every(item => item && typeof item.address === 'string' && typeof item.logoUrl === 'string')) {
      console.error('Invalid token configuration format in tokens.yaml');
      return [];
    }
    return data as TokenConfig[];
  } catch (error) {
    console.error('Error loading token configuration:', error);
    return [];
  }
};

// POST /api/tokens/refresh - Refresh all token data from the blockchain
export async function POST() {
  const WELL_KNOWN_TOKENS = loadTokensFromConfig();
  if (WELL_KNOWN_TOKENS.length === 0) {
    return NextResponse.json(
      { error: 'Failed to load token configuration or configuration is empty' },
      { status: 500 }
    );
  }

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