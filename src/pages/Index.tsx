
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Token, MiningStats, TokenHolder } from '@/lib/blockchain-types';
import { 
  generateMockTokens, 
  generateMockHolders, 
  generateMockMiningStats,
  ADMIN_SETTINGS
} from '@/lib/blockchain-data';
import { formatCurrency, formatNumber, getBlockchainCookie, setBlockchainCookie } from '@/lib/blockchain-utils';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import TokenCard from '@/components/blockchain/TokenCard';
import { 
  ChevronRight,
  Zap,
  DollarSign,
  PieChart,
  Users,
  Shield
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [miningStats, setMiningStats] = useState<MiningStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load data when component mounts
    const loadData = async () => {
      setIsLoading(true);
      
      // Set blockchain cookie to demonstrate custom cookie implementation
      setBlockchainCookie('blockchain_session', 'active', 1);
      const sessionCookie = getBlockchainCookie('blockchain_session');
      console.log('Blockchain session cookie:', sessionCookie);
      
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockTokens = generateMockTokens();
        const mockMiningStats = generateMockMiningStats(mockTokens);
        
        setTokens(mockTokens);
        setMiningStats(mockMiningStats);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Calculate total market cap
  const totalMarketCap = tokens.reduce((total, token) => total + token.marketCap, 0);
  
  // Get total tokens, holders, mining tokens
  const totalApprovedTokens = tokens.filter(token => token.approved).length;
  const totalHolders = tokens.reduce((total, token) => total + token.holders, 0);
  const totalMiningTokens = tokens.filter(token => token.miningEnabled).length;
  
  return (
    <Layout>
      <div className="container py-6 space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Blockchain Dashboard</h1>
          <p className="text-xl text-muted-foreground">
            Manage your custom private blockchain
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="h-5 w-5 text-primary" />
                Tokens
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalApprovedTokens}</div>
              <p className="text-sm text-muted-foreground">Approved tokens</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <DollarSign className="h-5 w-5 text-crypto-green" />
                Market Cap
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatCurrency(totalMarketCap)}</div>
              <p className="text-sm text-muted-foreground">Total value locked</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-crypto-blue" />
                Holders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatNumber(totalHolders)}</div>
              <p className="text-sm text-muted-foreground">Across all tokens</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Zap className="h-5 w-5 text-crypto-yellow" />
                Mining
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalMiningTokens}</div>
              <p className="text-sm text-muted-foreground">Active mining tokens</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Your Tokens</h2>
          <Button 
            variant="outline" 
            className="gap-1"
            onClick={() => navigate('/tokens')}
          >
            View All
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tokens.slice(0, 4).map(token => (
            <TokenCard 
              key={token.id} 
              token={token}
              onClick={() => navigate(`/tokens/${token.id}`)}
            />
          ))}
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Blockchain Requirements</CardTitle>
            <CardDescription>
              Key thresholds for token trading and mining
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-secondary/50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Minimum Market Cap for Trading</h3>
                <div className="text-2xl font-bold mb-1">
                  {formatCurrency(ADMIN_SETTINGS.minMarketCapForTrading)}
                </div>
                <p className="text-sm text-muted-foreground">
                  Tokens need this market cap to be tradable
                </p>
              </div>
              
              <div className="bg-secondary/50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Minimum Holders Requirement</h3>
                <div className="text-2xl font-bold mb-1">
                  {ADMIN_SETTINGS.minHoldersRequired} holders
                </div>
                <p className="text-sm text-muted-foreground">
                  With at least {formatNumber(ADMIN_SETTINGS.minTokensPerHolder)} tokens each
                </p>
              </div>
              
              <div className="bg-secondary/50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Mining Eligibility</h3>
                <div className="text-2xl font-bold mb-1">
                  {formatNumber(ADMIN_SETTINGS.minHoldersForMining)} holders
                </div>
                <p className="text-sm text-muted-foreground">
                  Tokens need this many holders to enable mining
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/30 text-sm text-muted-foreground">
            <div>
              These requirements ensure the stability and security of the blockchain ecosystem.
              Admin can adjust these thresholds through the admin panel.
            </div>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
