
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Token, MiningStats } from '@/lib/blockchain-types';
import { 
  generateMockTokens, 
  generateMockMiningStats
} from '@/lib/blockchain-data';
import MiningDashboard from '@/components/blockchain/MiningDashboard';
import { toast } from 'sonner';

const MiningPage = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [miningStats, setMiningStats] = useState<MiningStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockTokens = generateMockTokens();
        const mockMiningStats = generateMockMiningStats(mockTokens);
        
        setTokens(mockTokens);
        setMiningStats(mockMiningStats);
      } catch (error) {
        console.error('Error loading mining data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  const handleStartMining = (tokenId: string) => {
    // Update mining stats to show mining as active
    setMiningStats(miningStats.map(stats => 
      stats.tokenId === tokenId
        ? { ...stats, isActive: true, startTime: new Date().toISOString() }
        : stats
    ));
  };
  
  const handleStopMining = (tokenId: string) => {
    // Update mining stats to show mining as inactive
    setMiningStats(miningStats.map(stats => 
      stats.tokenId === tokenId
        ? { ...stats, isActive: false }
        : stats
    ));
  };
  
  return (
    <Layout>
      <div className="container py-6">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin-slow w-16 h-16 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <MiningDashboard
            tokens={tokens}
            miningStats={miningStats}
            onStartMining={handleStartMining}
            onStopMining={handleStopMining}
          />
        )}
      </div>
    </Layout>
  );
};

export default MiningPage;
