
import React, { useState } from 'react';
import { Token, TokenHolder } from '@/lib/blockchain-types';
import { 
  formatNumber, 
  formatCurrency, 
  getNetworkClass, 
  isEligibleForTrading,
  isEligibleForMining
} from '@/lib/blockchain-utils';
import { ADMIN_SETTINGS, simulateTransaction } from '@/lib/blockchain-data';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { 
  Lock, 
  Unlock, 
  Settings, 
  Zap, 
  DollarSign, 
  Users, 
  Shield, 
  TrendingUp
} from 'lucide-react';

interface TokenDetailProps {
  token: Token;
  holders: TokenHolder[];
  onEnableMining: (tokenId: string) => void;
  onMint: (tokenId: string, amount: number) => void;
  onClose: () => void;
}

const TokenDetail: React.FC<TokenDetailProps> = ({ 
  token, 
  holders, 
  onEnableMining, 
  onMint,
  onClose 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const canTrade = isEligibleForTrading(
    token, 
    ADMIN_SETTINGS.minMarketCapForTrading, 
    ADMIN_SETTINGS.minHoldersRequired
  );
  
  const canMine = isEligibleForMining(token, ADMIN_SETTINGS.minHoldersForMining);
  
  const handleRenounceOwnership = async () => {
    setIsLoading(true);
    try {
      const result = await simulateTransaction('renounce', token.id);
      if (result.success) {
        toast.success('Ownership renounced successfully');
      } else {
        toast.error(result.message || 'Failed to renounce ownership');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFreeze = async () => {
    setIsLoading(true);
    try {
      const result = await simulateTransaction('freeze', token.id);
      if (result.success) {
        toast.success('Token frozen successfully');
      } else {
        toast.error(result.message || 'Failed to freeze token');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleMint = async () => {
    setIsLoading(true);
    try {
      const result = await simulateTransaction('mint', token.id);
      if (result.success) {
        toast.success('Minting transaction submitted');
        onMint(token.id, 10000); // Mock minting 10,000 tokens
      } else {
        toast.error(result.message || 'Failed to mint tokens');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Badge className={`${getNetworkClass(token.network)}`}>
            {token.network.toUpperCase()}
          </Badge>
          <h2 className="text-2xl font-bold">{token.name} ({token.symbol})</h2>
        </div>
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-crypto-green" />
              Market Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Current Price</div>
                <div className="text-2xl font-bold">{formatCurrency(token.price)}</div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground">Market Cap</div>
                <div className="text-xl font-semibold">{formatCurrency(token.marketCap)}</div>
                <div className="mt-1">
                  <span className="text-xs">Minimum for trading: </span>
                  <span className="text-xs font-medium">{formatCurrency(ADMIN_SETTINGS.minMarketCapForTrading)}</span>
                </div>
                <Progress 
                  value={(token.marketCap / ADMIN_SETTINGS.minMarketCapForTrading) * 100}
                  max={100}
                  className="h-2 mt-1"
                />
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground">Circulating Supply</div>
                <div className="text-xl font-semibold">{formatNumber(token.circulatingSupply)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-crypto-blue" />
              Holders Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Total Holders</div>
                <div className="text-2xl font-bold">{formatNumber(token.holders)}</div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground">Minimum Holders for Trading</div>
                <div className="flex justify-between">
                  <span className="text-base font-medium">{token.holders} / {ADMIN_SETTINGS.minHoldersRequired}</span>
                  <span className={`text-sm ${token.holders >= ADMIN_SETTINGS.minHoldersRequired ? "text-crypto-green" : "text-crypto-red"}`}>
                    {token.holders >= ADMIN_SETTINGS.minHoldersRequired ? "Met" : "Not Met"}
                  </span>
                </div>
                <Progress 
                  value={(token.holders / ADMIN_SETTINGS.minHoldersRequired) * 100}
                  max={100}
                  className="h-2 mt-1"
                />
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground">Minimum Holders for Mining</div>
                <div className="flex justify-between">
                  <span className="text-base font-medium">{token.holders} / {ADMIN_SETTINGS.minHoldersForMining}</span>
                  <span className={`text-sm ${token.holders >= ADMIN_SETTINGS.minHoldersForMining ? "text-crypto-green" : "text-crypto-red"}`}>
                    {token.holders >= ADMIN_SETTINGS.minHoldersForMining ? "Met" : "Not Met"}
                  </span>
                </div>
                <Progress 
                  value={(token.holders / ADMIN_SETTINGS.minHoldersForMining) * 100}
                  max={100}
                  className="h-2 mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-crypto-purple" />
              Permissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Ownership</span>
                <Badge variant={token.ownershipRenounced ? "outline" : "default"}>
                  {token.ownershipRenounced ? "Renounced" : "Centralized"}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Mintable</span>
                <Badge variant={token.mintable ? "default" : "outline"}>
                  {token.mintable ? "Yes" : "No"}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Mutable</span>
                <Badge variant={token.mutable ? "default" : "outline"}>
                  {token.mutable ? "Yes" : "No"}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Freeze Authority</span>
                <Badge variant={token.freezeAuthority ? "default" : "outline"}>
                  {token.freezeAuthority ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Mining Status</span>
                <Badge 
                  variant={token.miningEnabled ? "default" : "outline"}
                  className={token.miningEnabled ? "bg-crypto-yellow text-black" : ""}
                >
                  {token.miningEnabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="holders">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="holders">Top Holders</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
          <TabsTrigger value="mining">Mining</TabsTrigger>
        </TabsList>
        
        <TabsContent value="holders" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Token Holders</CardTitle>
              <CardDescription>
                The top {holders.length} addresses holding {token.symbol} tokens
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {holders.map((holder, index) => (
                  <div key={holder.address} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground w-6">{index + 1}.</span>
                      <span className="text-sm font-mono">{holder.address.substring(0, 6)}...{holder.address.substring(38)}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm">{formatNumber(holder.balance)} {token.symbol}</span>
                      <span className="text-sm text-muted-foreground w-12 text-right">{holder.percentage.toFixed(2)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="actions" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Token Actions</CardTitle>
              <CardDescription>
                Perform operations on your token
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {token.mintable && (
                  <Button 
                    onClick={handleMint} 
                    disabled={isLoading}
                    className="w-full"
                  >
                    Mint New Tokens
                  </Button>
                )}
                
                {token.freezeAuthority && (
                  <Button 
                    onClick={handleFreeze} 
                    disabled={isLoading}
                    variant="secondary" 
                    className="w-full"
                  >
                    {token.freezeAuthority ? "Freeze Token" : "Unfreeze Token"}
                  </Button>
                )}
                
                {!token.ownershipRenounced && (
                  <Button 
                    onClick={handleRenounceOwnership} 
                    disabled={isLoading}
                    variant="destructive" 
                    className="w-full"
                  >
                    Renounce Ownership
                  </Button>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start">
              <div className="text-sm text-muted-foreground mb-2">
                <strong>Note:</strong> Some actions require payment to enable. Contact admin for pricing.
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Enable Minting:</span>
                  <span>{formatCurrency(ADMIN_SETTINGS.featureEnablementFees.minting)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Enable Mutability:</span>
                  <span>{formatCurrency(ADMIN_SETTINGS.featureEnablementFees.mutable)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Freeze Token:</span>
                  <span>{formatCurrency(ADMIN_SETTINGS.featureEnablementFees.freeze)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Unfreeze Token:</span>
                  <span>{formatCurrency(ADMIN_SETTINGS.featureEnablementFees.unfreeze)}</span>
                </div>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="mining" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Mining Configuration</CardTitle>
              <CardDescription>
                Configure mining settings for your token
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Mining Eligibility</h3>
                  <div className="bg-secondary/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span>Status:</span>
                      <Badge 
                        className={canMine ? "bg-crypto-green" : "bg-crypto-red"}
                      >
                        {canMine ? "Eligible" : "Not Eligible"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Tokens require at least {formatNumber(ADMIN_SETTINGS.minHoldersForMining)} holders before mining can be enabled.
                    </p>
                    <Progress 
                      value={(token.holders / ADMIN_SETTINGS.minHoldersForMining) * 100}
                      max={100}
                      className="h-2"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Current holders: {formatNumber(token.holders)} / {formatNumber(ADMIN_SETTINGS.minHoldersForMining)}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Mining Status</h3>
                  <div className="bg-secondary/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <span>Current Status:</span>
                      <Badge 
                        className={token.miningEnabled ? "bg-crypto-yellow text-black" : "bg-muted"}
                      >
                        {token.miningEnabled ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    
                    <Button 
                      className="w-full"
                      disabled={!canMine || token.miningEnabled || isLoading}
                      onClick={() => onEnableMining(token.id)}
                    >
                      {token.miningEnabled ? "Mining Enabled" : "Enable Mining"}
                    </Button>
                    
                    {token.miningEnabled && (
                      <div className="mt-4 flex items-center justify-center">
                        <Badge variant="outline" className="bg-crypto-yellow/10 flex gap-2 py-2">
                          <Zap className="h-4 w-4 text-crypto-yellow mining-icon" />
                          <span>Mining in Progress</span>
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TokenDetail;
