
import { Token, Network } from './blockchain-types';

// Calculate market cap
export const calculateMarketCap = (supply: number, price: number): number => {
  return supply * price;
};

// Get network class for styling
export const getNetworkClass = (network: Network): string => {
  switch (network) {
    case 'ethereum':
      return 'network-eth';
    case 'binance':
      return 'network-bnb';
    case 'polygon':
      return 'bg-crypto-purple text-white';
    case 'solana':
      return 'bg-crypto-blue text-white';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

// Check if token is eligible for trading
export const isEligibleForTrading = (token: Token, minMarketCap: number, minHolders: number): boolean => {
  return token.marketCap >= minMarketCap && token.holders >= minHolders;
};

// Check if token is eligible for mining
export const isEligibleForMining = (token: Token, minHolders: number): boolean => {
  return token.holders >= minHolders;
};

// Format large numbers
export const formatNumber = (num: number): string => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(2) + 'B';
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(2) + 'K';
  } else {
    return num.toString();
  }
};

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// Generate a mock transaction hash
export const generateTransactionHash = (): string => {
  return '0x' + Array.from({ length: 64 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
};

// Simple blockchain cookie implementation
export const setBlockchainCookie = (name: string, value: string, days: number = 30): void => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
};

export const getBlockchainCookie = (name: string): string | null => {
  const cookies = document.cookie.split(';').map(cookie => cookie.trim());
  for (const cookie of cookies) {
    if (cookie.startsWith(`${name}=`)) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
};
