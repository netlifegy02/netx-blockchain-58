
import React from 'react';
import { Token, MiningStats } from '@/lib/blockchain-types';
import { formatNumber, formatCurrency, getNetworkClass } from '@/lib/blockchain-utils';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Zap, Users, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

interface MiningDashboardProps {
  tokens: Token[];
  miningStats: MiningStats[];
  onStartMining: (tokenId: string) => void;
  onStopMining: (tokenId: string) => void;
}

const MiningDashboard: React.FC<MiningDashboardProps> = ({ 
  tokens, 
  miningStats,
  onStartMining,
  onStopMining
}) => {
  const miningTokens = tokens.filter(token => token.miningEnabled);
  
  const getTokenById = (id: string) => tokens.find(token => token.id === id);
  
  const getStatsByTokenId = (id: string) => miningStats.find(stats => stats.tokenId === id);
  
  const handleStartMining = (tokenId: string) => {
    onStartMining(tokenId);
    toast.success('Mining started');
  };
  
  const handleStopMining = (tokenId: string) => {
    onStopMining(tokenId);
    toast.success('Mining stopped');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold mb-1">Mining Dashboard</h2>
          <p className="text-muted-foreground">
            Mine eligible tokens directly from your browser
          </p>
        </div>
        
        <Card className="w-full sm:w-auto">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Zap className="h-6 w-6 text-crypto-yellow" />
                <div>
                  <div className="text-sm text-muted-foreground">Active Mining</div>
                  <div className="text-xl font-bold">
                    {miningStats.filter(stats => stats.isActive).length} / {miningTokens.length}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Users className="h-6 w-6 text-crypto-blue" />
                <div>
                  <div className="text-sm text-muted-foreground">Total Miners</div>
                  <div className="text-xl font-bold">
                    {formatNumber(miningStats.reduce((acc, stats) => acc + stats.miners, 0))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {miningTokens.length === 0 ? (
        <Card className="w-full text-center py-12">
          <CardContent>
            <h3 className="text-xl font-medium mb-2">No Mineable Tokens</h3>
            <p className="text-muted-foreground mb-4">
              There are no tokens currently eligible for mining.
            </p>
            <p className="text-sm text-muted-foreground">
              Tokens need at least 10,000 holders to be eligible for mining.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {miningTokens.map(token => {
            const stats = getStatsByTokenId(token.id);
            
            return (
              <Card key={token.id} className={`token-card ${stats?.isActive ? 'border-crypto-yellow' : ''}`}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge className={`${getNetworkClass(token.network)} mb-2`}>
                        {token.network.toUpperCase()}
                      </Badge>
                      <CardTitle className="text-xl flex items-center gap-2">
                        {token.symbol}
                        {stats?.isActive && (
                          <Zap className="h-4 w-4 text-crypto-yellow mining-icon" />
                        )}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">{token.name}</p>
                    </div>
                    
                    <Badge 
                      variant={stats?.isActive ? "default" : "outline"}
                      className={stats?.isActive ? "bg-crypto-yellow text-black" : ""}
                    >
                      {stats?.isActive ? "Mining Active" : "Mining Idle"}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Hash Rate</div>
                        <div className="font-medium">{formatNumber(stats?.hashRate || 0)} H/s</div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-muted-foreground">Active Miners</div>
                        <div className="font-medium">{formatNumber(stats?.miners || 0)}</div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-muted-foreground">Token Price</div>
                        <div className="font-medium">{formatCurrency(token.price)}</div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-muted-foreground">Pools</div>
                        <div className="font-medium">{stats?.poolSize || 0}</div>
                      </div>
                    </div>
                    
                    {stats?.isActive && (
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-muted-foreground">Mining Progress</span>
                          <span className="text-sm">64%</span>
                        </div>
                        <Progress value={64} max={100} className="h-2" />
                      </div>
                    )}
                    
                    <div className="pt-2">
                      {stats?.isActive ? (
                        <Button 
                          variant="outline" 
                          className="w-full border-crypto-yellow text-crypto-yellow hover:bg-crypto-yellow/10"
                          onClick={() => handleStopMining(token.id)}
                        >
                          Stop Mining
                        </Button>
                      ) : (
                        <Button 
                          className="w-full"
                          onClick={() => handleStartMining(token.id)}
                        >
                          Start Mining
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Mining Requirements</CardTitle>
          <CardDescription>
            Learn about token mining eligibility and rewards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-secondary/50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-crypto-blue" />
                  <h3 className="font-medium">Holder Requirement</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  A token needs at least 10,000 unique holders before it's eligible for mining.
                </p>
              </div>
              
              <div className="bg-secondary/50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-crypto-green" />
                  <h3 className="font-medium">Mining Rewards</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Mining rewards are distributed proportionally to your mining power contribution.
                </p>
              </div>
              
              <div className="bg-secondary/50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-5 w-5 text-crypto-yellow" />
                  <h3 className="font-medium">Browser Mining</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Mining happens in your browser, so you can earn tokens while browsing.
                </p>
              </div>
            </div>
            
            <div className="bg-muted/30 p-4 rounded-lg text-sm text-muted-foreground">
              <p>
                <strong>Note:</strong> Mining utilizes your computer's resources and may affect performance.
                You can adjust mining intensity in the settings or join a mining pool for more efficient mining.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MiningDashboard;
