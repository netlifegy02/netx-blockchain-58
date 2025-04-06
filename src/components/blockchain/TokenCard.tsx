
import React from 'react';
import { Token } from '@/lib/blockchain-types';
import { 
  formatNumber, 
  formatCurrency, 
  getNetworkClass,
  isEligibleForTrading,
  isEligibleForMining
} from '@/lib/blockchain-utils';
import { ADMIN_SETTINGS } from '@/lib/blockchain-data';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Lock, Unlock, Settings, Zap } from 'lucide-react';

interface TokenCardProps {
  token: Token;
  onClick?: () => void;
}

const TokenCard: React.FC<TokenCardProps> = ({ token, onClick }) => {
  const canTrade = isEligibleForTrading(
    token, 
    ADMIN_SETTINGS.minMarketCapForTrading, 
    ADMIN_SETTINGS.minHoldersRequired
  );
  
  const canMine = isEligibleForMining(token, ADMIN_SETTINGS.minHoldersForMining);
  
  return (
    <Card 
      className="token-card cursor-pointer hover:border-primary/50 transition-all" 
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <Badge className={`${getNetworkClass(token.network)} mb-2`}>
              {token.network.toUpperCase()}
            </Badge>
            <CardTitle className="text-xl flex items-center gap-2">
              {token.symbol}
              {token.miningEnabled && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Zap className="h-4 w-4 text-crypto-yellow" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Mining Enabled</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{token.name}</p>
          </div>
          
          <div className="flex gap-1">
            {token.ownershipRenounced ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Unlock className="h-4 w-4 text-crypto-green" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Ownership Renounced</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Lock className="h-4 w-4 text-crypto-red" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Centralized Ownership</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            
            {token.updateAuthority && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Settings className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Mutable Contract</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Price</span>
            <span className="font-medium">{formatCurrency(token.price)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Market Cap</span>
            <span className="font-medium">{formatCurrency(token.marketCap)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Supply</span>
            <span className="font-medium">{formatNumber(token.circulatingSupply)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Holders</span>
            <span className="font-medium">{formatNumber(token.holders)}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <div className="flex w-full justify-between">
          <Badge variant={token.approved ? "default" : "outline"} className="text-xs">
            {token.approved ? "Approved" : "Pending"}
          </Badge>
          
          <div className="flex gap-2">
            <Badge 
              variant={canTrade ? "default" : "secondary"} 
              className={`text-xs ${canTrade ? "bg-crypto-green" : "opacity-60"}`}
            >
              {canTrade ? "Trading" : "Locked"}
            </Badge>
            
            <Badge 
              variant={canMine ? "default" : "secondary"}
              className={`text-xs ${canMine ? "bg-crypto-yellow text-black" : "opacity-60"}`}
            >
              {canMine ? "Mineable" : "Not Mineable"}
            </Badge>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TokenCard;
