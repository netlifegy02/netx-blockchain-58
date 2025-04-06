
export type Network = 'ethereum' | 'binance' | 'polygon' | 'solana';

export interface Token {
  id: string;
  symbol: string;
  name: string;
  network: Network;
  mintable: boolean;
  mutable: boolean;
  ownershipRenounced: boolean;
  freezeAuthority: boolean;
  updateAuthority: boolean;
  circulatingSupply: number;
  holders: number;
  price: number;
  marketCap: number;
  createdAt: string;
  approved: boolean;
  miningEnabled: boolean;
}

export interface TokenHolder {
  address: string;
  balance: number;
  percentage: number;
}

export interface MiningStats {
  tokenId: string;
  hashRate: number;
  miners: number;
  poolSize: number;
  isActive: boolean;
  startTime?: string;
  lastMined?: string;
}

export interface AdminSettings {
  minMarketCapForTrading: number;
  minHoldersRequired: number;
  minTokensPerHolder: number;
  minHoldersForMining: number;
  featureEnablementFees: {
    minting: number;
    mutable: number;
    freeze: number;
    unfreeze: number;
  }
}
