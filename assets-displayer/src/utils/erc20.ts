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

// RPC Provider URL - Use environment variable or default
const ETHEREUM_RPC_URL = process.env.ETHEREUM_RPC_URL || 'https://eth.llamarpc.com';

// Create a single provider instance for reuse
const provider = new ethers.JsonRpcProvider(ETHEREUM_RPC_URL);

// Get ERC20 Token contract instance using the shared provider
const getTokenContract = (tokenAddress: string) => {
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
      // Convert decimals to BigInt for safety, although uint8 fits in number
      decimals: BigInt(decimals),
      // Convert totalSupply (uint256) to string to avoid potential precision issues
      totalSupply: totalSupply.toString(),
    };
  } catch (error) {
    console.error(`Error fetching token info for ${tokenAddress}:`, error);
    // Re-throw the original error or a more specific one if needed
    // This preserves the stack trace and original error type
    throw new Error(`Failed to fetch token info for ${tokenAddress}`, { cause: error });
  }
};