
import { Token, TokenHolder, MiningStats, AdminSettings, Network } from './blockchain-types';
import { calculateMarketCap, generateTransactionHash } from './blockchain-utils';

// Mock admin settings
export const ADMIN_SETTINGS: AdminSettings = {
  minMarketCapForTrading: 100000, // $100,000
  minHoldersRequired: 10,
  minTokensPerHolder: 10000,
  minHoldersForMining: 10000,
  featureEnablementFees: {
    minting: 50, // $50
    mutable: 100, // $100
    freeze: 75, // $75
    unfreeze: 75 // $75
  }
};

// Mock token data
export const generateMockTokens = (): Token[] => {
  const networks: Network[] = ['ethereum', 'binance', 'polygon', 'solana'];
  
  return Array.from({ length: 8 }, (_, i) => {
    const supply = Math.floor(Math.random() * 1000000000) + 100000;
    const price = Math.random() * 10;
    const holders = Math.floor(Math.random() * 50000) + 5;
    const network = networks[Math.floor(Math.random() * networks.length)];
    
    return {
      id: generateTransactionHash().substring(0, 16),
      symbol: ['MINT', 'BLOK', 'NETX', 'DEFI', 'META', 'GAME', 'SWAP', 'ZERO'][i],
      name: [
        'Mintopia Token', 
        'Blockchain Express', 
        'NetX Protocol', 
        'DefiChain', 
        'MetaverseX', 
        'GameFi Token', 
        'SwapDEX',
        'ZeroGravity'
      ][i],
      network,
      mintable: Math.random() > 0.5,
      mutable: Math.random() > 0.7,
      ownershipRenounced: Math.random() > 0.8,
      freezeAuthority: Math.random() > 0.6,
      updateAuthority: Math.random() > 0.6,
      circulatingSupply: supply,
      holders,
      price,
      marketCap: calculateMarketCap(supply, price),
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString(),
      approved: Math.random() > 0.3,
      miningEnabled: holders > ADMIN_SETTINGS.minHoldersForMining || Math.random() > 0.7
    };
  });
};

// Generate mock holders for a token
export const generateMockHolders = (tokenId: string): TokenHolder[] => {
  return Array.from({ length: 20 }, (_, i) => {
    const balance = Math.floor(Math.random() * 1000000) + 10000;
    return {
      address: `0x${Array.from({ length: 40 }, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('')}`,
      balance,
      percentage: Math.random() * 5 + (i === 0 ? 15 : 0) // Make the first holder have a larger share
    };
  }).sort((a, b) => b.balance - a.balance);
};

// Generate mock mining stats
export const generateMockMiningStats = (tokens: Token[]): MiningStats[] => {
  return tokens
    .filter(token => token.miningEnabled)
    .map(token => {
      const isActive = Math.random() > 0.3;
      return {
        tokenId: token.id,
        hashRate: Math.floor(Math.random() * 1000) + 50,
        miners: Math.floor(Math.random() * 5000) + 100,
        poolSize: Math.floor(Math.random() * 10) + 1,
        isActive,
        startTime: isActive 
          ? new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString()
          : undefined,
        lastMined: isActive 
          ? new Date(Date.now() - Math.floor(Math.random() * 60) * 60 * 1000).toISOString()
          : undefined
      };
    });
};

// Simulate a blockchain transaction
export const simulateTransaction = async (
  type: 'mint' | 'freeze' | 'unfreeze' | 'renounce' | 'update',
  tokenId: string
): Promise<{ success: boolean; hash: string; message?: string }> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const success = Math.random() > 0.1; // 90% success rate
  
  return {
    success,
    hash: generateTransactionHash(),
    message: success 
      ? `Successfully performed ${type} operation on token ${tokenId}`
      : `Transaction failed: network congestion`
  };
};

// Mock function to create a new token
export const createToken = async (
  symbol: string,
  name: string,
  network: Network,
  initialSupply: number
): Promise<{ success: boolean; token?: Token; hash?: string; message?: string }> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const success = Math.random() > 0.1; // 90% success rate
  
  if (!success) {
    return {
      success: false,
      message: 'Failed to create token: contract deployment error'
    };
  }
  
  const id = generateTransactionHash().substring(0, 16);
  const hash = generateTransactionHash();
  
  const token: Token = {
    id,
    symbol,
    name,
    network,
    mintable: true,
    mutable: true,
    ownershipRenounced: false,
    freezeAuthority: true,
    updateAuthority: true,
    circulatingSupply: initialSupply,
    holders: 1, // Just the creator initially
    price: 0.001, // Initial price
    marketCap: calculateMarketCap(initialSupply, 0.001),
    createdAt: new Date().toISOString(),
    approved: false, // Needs admin approval
    miningEnabled: false
  };
  
  return {
    success: true,
    token,
    hash,
    message: `Token ${symbol} created successfully and pending admin approval`
  };
};
