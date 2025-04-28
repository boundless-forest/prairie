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