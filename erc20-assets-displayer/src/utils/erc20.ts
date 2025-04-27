import { ethers } from 'ethers';

// ERC20 ABI - minimum needed for basic token information
const ERC20_ABI = [
  // Read-only functions
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address owner) view returns (uint256)'
];

// RPC Provider URL - Replace with your own if needed
const ETHEREUM_RPC_URL = process.env.ETHEREUM_RPC_URL || 'https://eth.llamarpc.com';

// Connect to Ethereum network
const getProvider = () => {
  return new ethers.JsonRpcProvider(ETHEREUM_RPC_URL);
};

// Get ERC20 Token contract instance
const getTokenContract = (tokenAddress: string) => {
  const provider = getProvider();
  return new ethers.Contract(tokenAddress, ERC20_ABI, provider);
};

// Fetch token information
export const getTokenInfo = async (tokenAddress: string) => {
  try {
    const tokenContract = getTokenContract(tokenAddress);
    
    // Fetch token data in parallel
    const [name, symbol, decimals, totalSupply] = await Promise.all([
      tokenContract.name(),
      tokenContract.symbol(),
      tokenContract.decimals(),
      tokenContract.totalSupply()
    ]);

    return {
      address: tokenAddress,
      name,
      symbol,
      decimals,
      totalSupply: totalSupply.toString(),
    };
  } catch (error) {
    console.error(`Error fetching token info for ${tokenAddress}:`, error);
    let message = 'Unknown error';
    if (error instanceof Error) message = error.message;
    throw new Error(`Failed to fetch token info: ${message}`);
  }
};

// List of well-known ERC20 tokens to track
export const WELL_KNOWN_TOKENS = [
  {
    address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
    logoUrl: 'https://assets.coingecko.com/coins/images/2518/thumb/weth.png'
  },
  {
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', // DAI
    logoUrl: 'https://assets.coingecko.com/coins/images/9956/thumb/dai-logo.png'
  },
  {
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
    logoUrl: 'https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png'
  },
  {
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT
    logoUrl: 'https://assets.coingecko.com/coins/images/325/thumb/Tether.png'
  },
  {
    address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', // WBTC
    logoUrl: 'https://assets.coingecko.com/coins/images/7598/thumb/wrapped_bitcoin_wbtc.png'
  }
];