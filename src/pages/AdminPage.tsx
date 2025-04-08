
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Token } from '@/lib/blockchain-types';
import { 
  generateMockTokens, 
  ADMIN_SETTINGS
} from '@/lib/blockchain-data';
import AdminPanel from '@/components/blockchain/AdminPanel';
import AdminBackup from '@/components/blockchain/AdminBackup';
import AdminSecurity from '@/components/blockchain/AdminSecurity';
import AdminUsers from '@/components/blockchain/AdminUsers';
import AdminMobileApp from '@/components/blockchain/AdminMobileApp';
import Trading from '@/components/blockchain/Trading';
import Cashout from '@/components/blockchain/Cashout';
import GoogleDriveBackup from '@/components/blockchain/GoogleDriveBackup';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShieldAlert, Database, Users, Lock, ArrowLeftRight, DollarSign, Smartphone, Cloud } from 'lucide-react';
import { isAccountFullySetup, markAccountAsSetup } from '@/utils/authUtils';
import VirtualPhoneTester from '@/components/mobile/VirtualPhoneTester';

const AdminPage = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [settings, setSettings] = useState(ADMIN_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [showVirtualTester, setShowVirtualTester] = useState(false);
  const [currentAppTesting, setCurrentAppTesting] = useState<{
    appType: 'iOS' | 'Android' | 'APK';
    appVersion: string;
    appName: string;
  } | null>(null);
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Check if admin account is fully set up, if not, mark it as set up
        if (!isAccountFullySetup()) {
          markAccountAsSetup();
        }
        
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

  const handleTestApp = (appType: 'iOS' | 'Android' | 'APK', appVersion: string, appName: string) => {
    setCurrentAppTesting({
      appType,
      appVersion,
      appName
    });
    setShowVirtualTester(true);
  };

  const handleAppApproved = () => {
    if (currentAppTesting) {
      toast.success(`${currentAppTesting.appName} v${currentAppTesting.appVersion} approved for ${currentAppTesting.appType} distribution`);
      // In a real application, you would update the app status in the database
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
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold mb-1">Admin Control Panel</h2>
              <p className="text-muted-foreground">
                Manage tokens, blockchain settings, system backups and user accounts
              </p>
            </div>
            
            <Tabs defaultValue="tokens" className="space-y-6">
              <TabsList className="flex flex-wrap">
                <TabsTrigger value="tokens" className="flex items-center gap-1">
                  <ShieldAlert className="h-4 w-4" />
                  Token Management
                </TabsTrigger>
                <TabsTrigger value="trading" className="flex items-center gap-1">
                  <ArrowLeftRight className="h-4 w-4" />
                  Trading
                </TabsTrigger>
                <TabsTrigger value="cashout" className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  Cashout
                </TabsTrigger>
                <TabsTrigger value="backups" className="flex items-center gap-1">
                  <Database className="h-4 w-4" />
                  System Backups
                </TabsTrigger>
                <TabsTrigger value="gdrive" className="flex items-center gap-1">
                  <Cloud className="h-4 w-4" />
                  Google Drive
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center gap-1">
                  <Lock className="h-4 w-4" />
                  Security Config
                </TabsTrigger>
                <TabsTrigger value="users" className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  User Accounts
                </TabsTrigger>
                <TabsTrigger value="mobileapp" className="flex items-center gap-1">
                  <Smartphone className="h-4 w-4" />
                  Mobile App
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="tokens">
                <AdminPanel
                  tokens={tokens}
                  settings={settings}
                  onApproveToken={handleApproveToken}
                  onRejectToken={handleRejectToken}
                  onUpdateSettings={handleUpdateSettings}
                  onToggleMining={handleToggleMining}
                />
              </TabsContent>

              <TabsContent value="trading">
                <Trading />
              </TabsContent>

              <TabsContent value="cashout">
                <Cashout />
              </TabsContent>
              
              <TabsContent value="backups">
                <AdminBackup />
              </TabsContent>

              <TabsContent value="gdrive">
                <GoogleDriveBackup />
              </TabsContent>

              <TabsContent value="security">
                <AdminSecurity />
              </TabsContent>

              <TabsContent value="users">
                <AdminUsers />
              </TabsContent>

              <TabsContent value="mobileapp">
                <AdminMobileApp onTestApp={handleTestApp} />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>

      {showVirtualTester && currentAppTesting && (
        <VirtualPhoneTester 
          appType={currentAppTesting.appType}
          appVersion={currentAppTesting.appVersion}
          appName={currentAppTesting.appName}
          open={showVirtualTester}
          onOpenChange={setShowVirtualTester}
          onApprove={handleAppApproved}
        />
      )}
    </Layout>
  );
};

export default AdminPage;
