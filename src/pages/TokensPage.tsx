
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Token, TokenHolder } from '@/lib/blockchain-types';
import { 
  generateMockTokens, 
  generateMockHolders,
  createToken
} from '@/lib/blockchain-data';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import TokenCard from '@/components/blockchain/TokenCard';
import TokenDetail from '@/components/blockchain/TokenDetail';
import TokenForm from '@/components/blockchain/TokenForm';
import { toast } from 'sonner';
import { Plus, Search } from 'lucide-react';

const TokensPage = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [selectedTokenHolders, setSelectedTokenHolders] = useState<TokenHolder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockTokens = generateMockTokens();
        setTokens(mockTokens);
      } catch (error) {
        console.error('Error loading tokens:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  const filteredTokens = tokens.filter(token => 
    token.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    token.network.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleTokenSelect = async (token: Token) => {
    try {
      // Generate mock holders for selected token
      const holders = generateMockHolders(token.id);
      setSelectedToken(token);
      setSelectedTokenHolders(holders);
      setShowDetailDialog(true);
    } catch (error) {
      console.error('Error fetching token details:', error);
      toast.error('Failed to load token details');
    }
  };
  
  const handleEnableMining = (tokenId: string) => {
    setTokens(tokens.map(token => 
      token.id === tokenId ? { ...token, miningEnabled: true } : token
    ));
    
    toast.success('Mining enabled successfully');
  };
  
  const handleMint = (tokenId: string, amount: number) => {
    setTokens(tokens.map(token => 
      token.id === tokenId 
        ? { 
            ...token, 
            circulatingSupply: token.circulatingSupply + amount,
            marketCap: token.marketCap + (amount * token.price)
          } 
        : token
    ));
    
    if (selectedToken && selectedToken.id === tokenId) {
      setSelectedToken({
        ...selectedToken,
        circulatingSupply: selectedToken.circulatingSupply + amount,
        marketCap: selectedToken.marketCap + (amount * selectedToken.price)
      });
    }
  };
  
  const handleCreateToken = () => {
    setShowCreateForm(false);
    // In a real app, you'd make an API call to create the token
    // For now, just reload tokens
    
    // Mock adding a new token
    const mockToken = {
      ...tokens[0], // Clone an existing token
      id: `new-${Date.now()}`,
      symbol: 'NEW',
      name: 'New Token',
      approved: false,
      createdAt: new Date().toISOString()
    };
    
    setTokens([mockToken, ...tokens]);
    toast.success('Token created successfully! Waiting for admin approval.');
  };
  
  return (
    <Layout>
      <div className="container py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Token Management</h1>
            <p className="text-muted-foreground">
              Create and manage your blockchain tokens
            </p>
          </div>
          
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Token
          </Button>
        </div>
        
        {/* Search bar */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search tokens by name, symbol or network..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {isLoading ? (
            // Skeleton loader
            Array.from({ length: 8 }).map((_, index) => (
              <Card key={index} className="token-card animate-pulse">
                <CardHeader>
                  <div className="w-20 h-6 bg-muted rounded"></div>
                  <div className="w-32 h-8 bg-muted rounded"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="flex justify-between">
                        <div className="w-24 h-5 bg-muted rounded"></div>
                        <div className="w-16 h-5 bg-muted rounded"></div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : filteredTokens.length > 0 ? (
            filteredTokens.map(token => (
              <TokenCard 
                key={token.id} 
                token={token}
                onClick={() => handleTokenSelect(token)}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <h3 className="text-xl font-medium mb-2">No tokens found</h3>
              <p className="text-muted-foreground mb-4">
                No tokens match your search criteria
              </p>
              <Button onClick={() => setSearchTerm('')}>
                Clear Search
              </Button>
            </div>
          )}
        </div>
        
        {/* Token creation form dialog */}
        <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Create New Token</DialogTitle>
              <DialogDescription>
                Fill in the details to create your custom token
              </DialogDescription>
            </DialogHeader>
            <TokenForm 
              onTokenCreated={handleCreateToken}
              onCancel={() => setShowCreateForm(false)}
            />
          </DialogContent>
        </Dialog>
        
        {/* Token detail dialog */}
        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            {selectedToken && (
              <TokenDetail 
                token={selectedToken}
                holders={selectedTokenHolders}
                onEnableMining={handleEnableMining}
                onMint={handleMint}
                onClose={() => setShowDetailDialog(false)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default TokensPage;
