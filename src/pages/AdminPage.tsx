
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Token } from '@/lib/blockchain-types';
import { 
  generateMockTokens, 
  ADMIN_SETTINGS
} from '@/lib/blockchain-data';
import AdminPanel from '@/components/blockchain/AdminPanel';
import { toast } from 'sonner';

const AdminPage = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [settings, setSettings] = useState(ADMIN_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockTokens = generateMockTokens();
        setTokens(mockTokens);
      } catch (error) {
        console.error('Error loading admin data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  const handleApproveToken = (tokenId: string) => {
    setTokens(tokens.map(token => 
      token.id === tokenId ? { ...token, approved: true } : token
    ));
    
    toast.success('Token approved successfully');
  };
  
  const handleRejectToken = (tokenId: string) => {
    // Just remove the token from the list for this demo
    setTokens(tokens.filter(token => token.id !== tokenId));
    
    toast.success('Token rejected');
  };
  
  const handleUpdateSettings = (newSettings: typeof ADMIN_SETTINGS) => {
    setSettings(newSettings);
  };
  
  const handleToggleMining = (tokenId: string) => {
    setTokens(tokens.map(token => 
      token.id === tokenId ? { ...token, miningEnabled: !token.miningEnabled } : token
    ));
    
    const token = tokens.find(t => t.id === tokenId);
    if (token) {
      toast.success(`Mining ${token.miningEnabled ? 'disabled' : 'enabled'} for ${token.symbol}`);
    }
  };
  
  return (
    <Layout>
      <div className="container py-6">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-pulse space-y-4 w-full max-w-3xl">
              <div className="h-12 bg-muted rounded-md w-1/3"></div>
              <div className="h-6 bg-muted rounded-md w-1/2"></div>
              <div className="grid grid-cols-3 gap-4">
                <div className="h-32 bg-muted rounded-md"></div>
                <div className="h-32 bg-muted rounded-md"></div>
                <div className="h-32 bg-muted rounded-md"></div>
              </div>
              <div className="h-64 bg-muted rounded-md"></div>
            </div>
          </div>
        ) : (
          <AdminPanel
            tokens={tokens}
            settings={settings}
            onApproveToken={handleApproveToken}
            onRejectToken={handleRejectToken}
            onUpdateSettings={handleUpdateSettings}
            onToggleMining={handleToggleMining}
          />
        )}
      </div>
    </Layout>
  );
};

export default AdminPage;
