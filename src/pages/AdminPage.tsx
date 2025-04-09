
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
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  Database, 
  Users, 
  Lock, 
  ArrowLeftRight, 
  DollarSign, 
  Smartphone, 
  Cloud, 
  CheckCircle2, 
  AlertCircle,
  InfoIcon
} from 'lucide-react';
import { 
  isAccountFullySetup, 
  markAccountAsSetup, 
  getSetupCompletionStatus, 
  isAuthenticated,
  getUserInfo,
  updateUserInfo
} from '@/utils/authUtils';
import VirtualPhoneTester from '@/components/mobile/VirtualPhoneTester';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
  const [setupStatus, setSetupStatus] = useState<any>(null);
  const [setupProgress, setSetupProgress] = useState(0);
  const [needsRegistration, setNeedsRegistration] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Check if admin is authenticated
        if (!isAuthenticated()) {
          setNeedsRegistration(true);
          setIsLoading(false);
          return;
        }
        
        // Get current user info
        const currentUser = getUserInfo();
        if (currentUser) {
          // If the user has no isAdmin flag, add it
          if (!currentUser.isAdmin && !currentUser.role) {
            updateUserInfo({
              isAdmin: true,
              role: 'admin'
            });
            // Auto-complete admin setup to 75%
            const status = {
              accountInfo: true,
              security: true,
              users: false,
              googleDrive: true
            };
            localStorage.setItem('setupCompletionStatus', JSON.stringify(status));
          }
        }
        
        // Get setup completion status
        const status = getSetupCompletionStatus();
        setSetupStatus(status);
        
        if (status) {
          // Calculate setup progress percentage
          const tasks = Object.values(status);
          const completedTasks = tasks.filter(task => task === true).length;
          const progress = Math.round((completedTasks / tasks.length) * 100);
          setSetupProgress(progress);
          
          // If all setup tasks are complete, mark the account as fully set up
          if (progress === 100 && !isAccountFullySetup()) {
            markAccountAsSetup();
            toast.success('Admin setup completed successfully!');
          }
        }
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
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
  
  // Check setup status periodically
  useEffect(() => {
    const checkSetupStatus = () => {
      if (!isAuthenticated()) {
        setNeedsRegistration(true);
        return;
      } else {
        setNeedsRegistration(false);
      }
      
      const status = getSetupCompletionStatus();
      setSetupStatus(status);
      
      if (status) {
        // Calculate setup progress percentage
        const tasks = Object.values(status);
        const completedTasks = tasks.filter(task => task === true).length;
        const progress = Math.round((completedTasks / tasks.length) * 100);
        setSetupProgress(progress);
        
        // If all setup tasks are complete, mark the account as fully set up
        if (progress === 100 && !isAccountFullySetup()) {
          markAccountAsSetup();
          toast.success('Admin setup completed successfully!');
        }
      }
    };
    
    // Check every minute
    const interval = setInterval(checkSetupStatus, 30000);
    checkSetupStatus(); // Also check immediately
    
    return () => clearInterval(interval);
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
      // Update device app information in localStorage
      const deviceApps = JSON.parse(localStorage.getItem('deviceApps') || '[]');
      deviceApps.push({
        ...currentAppTesting,
        id: `app-${Date.now()}`,
        installed: true,
        installDate: new Date().toISOString()
      });
      localStorage.setItem('deviceApps', JSON.stringify(deviceApps));
    }
  };

  const handleCompleteProfile = () => {
    navigate('/register');
  };
  
  if (needsRegistration) {
    return (
      <Layout>
        <div className="container py-6">
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-2" />
              <CardTitle>Complete Your Profile</CardTitle>
              <CardDescription>
                You need to register or log in to access the admin dashboard features.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                The admin account requires full registration to manage blockchain operations, 
                users, and security settings.
              </p>
              <Button 
                onClick={handleCompleteProfile}
                className="w-full bg-primary hover:bg-primary/90"
              >
                Register Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }
  
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
            
            {setupStatus && setupProgress < 100 && (
              <Alert variant="default" className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <AlertTitle className="flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Admin Setup Progress: {setupProgress}% Complete
                </AlertTitle>
                <AlertDescription className="mt-2">
                  <Progress value={setupProgress} className="h-2 mb-4" />
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="flex items-center gap-1.5 text-sm">
                      {setupStatus.accountInfo ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                      )}
                      <span className={setupStatus.accountInfo ? "text-green-700 dark:text-green-500" : "text-amber-700 dark:text-amber-500"}>
                        Account Setup
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm">
                      {setupStatus.googleDrive ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                      )}
                      <span className={setupStatus.googleDrive ? "text-green-700 dark:text-green-500" : "text-amber-700 dark:text-amber-500"}>
                        Google Drive
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm">
                      {setupStatus.security ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                      )}
                      <span className={setupStatus.security ? "text-green-700 dark:text-green-500" : "text-amber-700 dark:text-amber-500"}>
                        Security
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm">
                      {setupStatus.users ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                      )}
                      <span className={setupStatus.users ? "text-green-700 dark:text-green-500" : "text-amber-700 dark:text-amber-500"}>
                        User Management
                      </span>
                    </div>
                  </div>
                  
                  <Card className="mt-4 bg-white dark:bg-gray-900">
                    <CardHeader>
                      <CardTitle className="text-base">Complete Your Admin Setup</CardTitle>
                      <CardDescription>Next steps to finish configuration</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {!setupStatus.users && (
                        <div className="flex items-start gap-2">
                          <div className="bg-amber-100 text-amber-700 rounded-full p-1 mt-0.5">
                            <AlertCircle className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Configure User Management</p>
                            <p className="text-xs text-muted-foreground">Set up user roles and permissions in the User Accounts tab</p>
                          </div>
                        </div>
                      )}
                      {!setupStatus.googleDrive && (
                        <div className="flex items-start gap-2">
                          <div className="bg-amber-100 text-amber-700 rounded-full p-1 mt-0.5">
                            <AlertCircle className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Connect Google Drive</p>
                            <p className="text-xs text-muted-foreground">Set up automated backups in the Google Drive tab</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </AlertDescription>
              </Alert>
            )}
            
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
