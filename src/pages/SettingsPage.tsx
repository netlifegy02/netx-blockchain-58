
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import WalletImportInstructions from '@/components/wallet/WalletImportInstructions';
import {
  User,
  Wallet,
  Smartphone,
  Server,
  Lock,
  Key,
  Copy,
  Download,
  RefreshCw,
  QrCode,
  ArrowRight,
  Plus,
  Trash2,
  Bell,
  BellOff
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getUserInfo, markAccountAsSetup, updateUserInfo } from '@/utils/authUtils';

interface WalletData {
  address: string;
  privateKey: string;
  mnemonic: string;
}

interface NodeData {
  id: string;
  status: 'online' | 'offline' | 'syncing';
  type: 'full' | 'light';
  version: string;
  syncedBlocks: number;
  totalBlocks: number;
  peers: number;
  lastSeen: string;
  cpu: number;
  memory: number;
  disk: number;
}

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

const SettingsPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [showRecoveryPhrase, setShowRecoveryPhrase] = useState(false);
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [verificationCode, setVerificationCode] = useState('');
  const [userProfile, setUserProfile] = useState<any>(null);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([
    { id: 'mining', title: 'Mining Updates', description: 'Get notified about your mining rewards and status', enabled: true },
    { id: 'security', title: 'Security Alerts', description: 'Important security notifications about your account', enabled: true },
    { id: 'price', title: 'Price Alerts', description: 'Be notified when tokens reach your target price', enabled: false },
    { id: 'news', title: 'Platform News', description: 'Updates about new features and platform changes', enabled: true },
    { id: 'nodes', title: 'Node Status', description: 'Notifications about your node status changes', enabled: true },
  ]);
  
  // For wallet import instructions
  const [currentWalletDialog, setCurrentWalletDialog] = useState<string | null>(null);
  
  useEffect(() => {
    // Load user profile information
    const userInfo = getUserInfo();
    
    if (userInfo) {
      // Check for existing profile
      const storedProfile = localStorage.getItem('userProfile');
      
      if (storedProfile) {
        setUserProfile(JSON.parse(storedProfile));
      } else if (userInfo.isAdmin || userInfo.role === 'admin') {
        // Create default profile for admin
        const adminProfile = {
          fullName: userInfo.username || 'Admin User',
          phoneNumber: '+1 (555) 123-4567',
          birthDate: '1990-01-01',
          location: 'New York, USA',
          registeredAt: new Date().toISOString(),
          isVerified: true,
          role: 'admin'
        };
        
        localStorage.setItem('userProfile', JSON.stringify(adminProfile));
        setUserProfile(adminProfile);
        
        // Mark admin as fully set up
        markAccountAsSetup();
        
        toast.success('Admin profile automatically configured');
      }
    }
    
    // Simulate loading wallet data
    const storedWallet = localStorage.getItem('userWallet');
    const storedPhrase = localStorage.getItem('walletRecoveryPhrase');
    
    if (storedWallet) {
      const parsedWallet = JSON.parse(storedWallet);
      // If we have a stored recovery phrase, use it
      if (storedPhrase) {
        parsedWallet.mnemonic = storedPhrase;
      }
      setWallet(parsedWallet);
    } else {
      // Create a mock wallet if none exists
      const mockWallet = {
        address: '0x' + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
        privateKey: Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
        mnemonic: storedPhrase || 'abandon ability able about above absent absorb abstract absurd abuse access accident'
      };
      setWallet(mockWallet);
      localStorage.setItem('userWallet', JSON.stringify(mockWallet));
    }
    
    // Generate mock nodes
    const mockNodes: NodeData[] = Array.from({ length: 3 }, (_, i) => ({
      id: `node-${i + 1}-${Math.random().toString(36).substring(2, 8)}`,
      status: ['online', 'online', 'syncing', 'offline'][Math.floor(Math.random() * 4)] as 'online' | 'offline' | 'syncing',
      type: i === 0 ? 'full' : 'light',
      version: `v1.2.${Math.floor(Math.random() * 9)}`,
      syncedBlocks: Math.floor(Math.random() * 1000000) + 9000000,
      totalBlocks: 10000000,
      peers: Math.floor(Math.random() * 30) + 5,
      lastSeen: new Date().toISOString(),
      cpu: Math.floor(Math.random() * 80) + 10,
      memory: Math.floor(Math.random() * 70) + 20,
      disk: Math.floor(Math.random() * 60) + 30
    }));
    setNodes(mockNodes);
  }, []);
  
  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    
    toast.success('Password changed successfully');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };
  
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };
  
  const downloadWalletInfo = () => {
    if (!wallet) return;
    
    const walletData = JSON.stringify({
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: wallet.mnemonic,
      createdAt: new Date().toISOString()
    }, null, 2);
    
    const blob = new Blob([walletData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wallet-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Wallet information downloaded successfully');
  };

  const handleChangeWallet = () => {
    setCurrentWalletDialog('Change Wallet');
  };
  
  const verifyPhoneNumber = () => {
    if (verificationCode.length !== 6) {
      toast.error('Please enter a 6-digit verification code');
      return;
    }
    
    toast.success('Phone number verified successfully');
    setVerificationCode('');
    
    // Update user profile with verified status
    if (userProfile) {
      const updatedProfile = { ...userProfile, isPhoneVerified: true };
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      setUserProfile(updatedProfile);
    }
  };
  
  const handleNodeAction = (nodeId: string, action: 'restart' | 'stop' | 'sync') => {
    toast.info(`${action.charAt(0).toUpperCase() + action.slice(1)}ing node ${nodeId}...`);
    
    // Simulate node action
    setTimeout(() => {
      if (action === 'restart') {
        setNodes(nodes.map(node => 
          node.id === nodeId ? { ...node, status: 'online' } : node
        ));
        toast.success(`Node ${nodeId} restarted successfully`);
      } else if (action === 'stop') {
        setNodes(nodes.map(node => 
          node.id === nodeId ? { ...node, status: 'offline' } : node
        ));
        toast.success(`Node ${nodeId} stopped successfully`);
      } else if (action === 'sync') {
        setNodes(nodes.map(node => 
          node.id === nodeId ? { ...node, status: 'syncing' } : node
        ));
        toast.success(`Node ${nodeId} is now syncing`);
      }
    }, 1500);
  };
  
  const startNewNode = () => {
    const newNodeId = `node-${nodes.length + 1}-${Math.random().toString(36).substring(2, 8)}`;
    
    const newNode: NodeData = {
      id: newNodeId,
      status: 'syncing',
      type: 'light',
      version: 'v1.2.0',
      syncedBlocks: 0,
      totalBlocks: 10000000,
      peers: 0,
      lastSeen: new Date().toISOString(),
      cpu: 0,
      memory: 0,
      disk: 0
    };
    
    setNodes([...nodes, newNode]);
    toast.success(`New node ${newNodeId} created and syncing`);
  };

  const openWalletInstructions = (walletName: string) => {
    setCurrentWalletDialog(walletName);
  };
  
  const handleImportWallet = (phrase: string) => {
    // This would normally connect to a blockchain API to import the wallet
    const newWallet = {
      address: `0x${Math.random().toString(16).substring(2, 42)}`,
      privateKey: Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
      mnemonic: phrase,
    };
    
    setWallet(newWallet);
    localStorage.setItem('userWallet', JSON.stringify(newWallet));
    localStorage.setItem('walletRecoveryPhrase', phrase);
    toast.success('Wallet successfully updated');
  };

  const handleToggleNotification = (id: string) => {
    setNotificationSettings(
      notificationSettings.map((setting) => 
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
    
    toast.success('Notification settings updated');
  };
  
  return (
    <Layout>
      <div className="container py-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold mb-1">Settings</h2>
            <p className="text-muted-foreground">
              Manage your account, wallet, and node configuration
            </p>
          </div>
          
          {!userProfile && (
            <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-400">Complete your profile</h3>
                    <p className="text-sm text-yellow-700 dark:text-yellow-500 mt-1">
                      Your account is not fully set up. Please register to access all features.
                    </p>
                  </div>
                  <Button asChild>
                    <Link to="/register">
                      Register now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          <Tabs defaultValue="account" className="space-y-6">
            <TabsList>
              <TabsTrigger value="account" className="flex items-center gap-1">
                <User className="h-4 w-4" />
                Account
              </TabsTrigger>
              <TabsTrigger value="wallet" className="flex items-center gap-1">
                <Wallet className="h-4 w-4" />
                Wallet
              </TabsTrigger>
              <TabsTrigger value="nodes" className="flex items-center gap-1">
                <Server className="h-4 w-4" />
                Nodes
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-1">
                <Bell className="h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="mobile" className="flex items-center gap-1">
                <Smartphone className="h-4 w-4" />
                Mobile Apps
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="account">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>
                      Update your account settings and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {userProfile ? (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Full Name</Label>
                          <div className="font-medium mt-1">{userProfile.fullName}</div>
                        </div>
                        
                        <div>
                          <Label>Phone Number</Label>
                          <div className="font-medium mt-1">{userProfile.phoneNumber}</div>
                        </div>
                        
                        <div>
                          <Label>Date of Birth</Label>
                          <div className="font-medium mt-1">
                            {new Date(userProfile.birthDate).toLocaleDateString()}
                          </div>
                        </div>
                        
                        <div>
                          <Label>Location</Label>
                          <div className="font-medium mt-1">{userProfile.location}</div>
                        </div>
                        
                        <div className="col-span-2">
                          <Label>Registration Date</Label>
                          <div className="font-medium mt-1">
                            {new Date(userProfile.registeredAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-muted/50 p-6 rounded-lg text-center">
                        <p className="text-muted-foreground">
                          Complete your profile by registering your account
                        </p>
                        <Button asChild className="mt-4">
                          <Link to="/register">Register Now</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Phone Verification</CardTitle>
                    <CardDescription>
                      Verify your phone number for additional security
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <div className="flex gap-2">
                        <Input 
                          id="phoneNumber" 
                          value={userProfile?.phoneNumber || '+1 ('}
                          readOnly={!!userProfile}
                          placeholder="+1 (555) 000-0000"
                        />
                        <Button 
                          variant="outline"
                          disabled={!userProfile}
                          onClick={() => toast.success('Verification code sent')}
                        >
                          Send Code
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="verificationCode">Verification Code</Label>
                      <div className="flex justify-center my-4">
                        <InputOTP 
                          maxLength={6}
                          value={verificationCode}
                          onChange={setVerificationCode}
                          disabled={!userProfile}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>

                      <Button 
                        onClick={verifyPhoneNumber} 
                        className="w-full"
                        disabled={!verificationCode || verificationCode.length !== 6 || !userProfile}
                      >
                        <Smartphone className="mr-2 h-4 w-4" />
                        Verify Phone Number
                      </Button>
                      
                      <p className="text-sm text-muted-foreground text-center mt-2">
                        We'll send a code via WhatsApp to verify your phone number
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>
                      Update your password to keep your account secure
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input 
                        id="current-password" 
                        type="password" 
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input 
                        id="new-password" 
                        type="password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input 
                        id="confirm-password" 
                        type="password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handlePasswordChange}>
                      <Lock className="mr-2 h-4 w-4" />
                      Update Password
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="wallet">
              <div className="grid gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Your Wallet</CardTitle>
                      <CardDescription>
                        View and manage your blockchain wallet
                      </CardDescription>
                    </div>
                    <Button variant="outline" onClick={handleChangeWallet}>
                      <Plus className="h-4 w-4 mr-2" />
                      Change Wallet
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>Wallet Address</Label>
                      <div className="flex">
                        <Input 
                          value={wallet?.address || ''} 
                          readOnly 
                          className="font-mono text-sm"
                        />
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="ml-2"
                          onClick={() => wallet && copyToClipboard(wallet.address, 'Wallet address')}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Your public wallet address for receiving tokens and coins
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Private Key</Label>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                        >
                          {isPasswordVisible ? 'Hide' : 'Show'}
                        </Button>
                      </div>
                      <div className="flex">
                        <Input 
                          value={isPasswordVisible ? wallet?.privateKey || '' : '•'.repeat(64)} 
                          readOnly 
                          type={isPasswordVisible ? 'text' : 'password'}
                          className="font-mono text-sm"
                        />
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="ml-2"
                          onClick={() => wallet && copyToClipboard(wallet.privateKey, 'Private key')}
                          disabled={!isPasswordVisible}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Keep this private! Anyone with this key can access your funds
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Recovery Phrase</Label>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setShowRecoveryPhrase(!showRecoveryPhrase)}
                        >
                          {showRecoveryPhrase ? 'Hide' : 'Show'}
                        </Button>
                      </div>
                      
                      {showRecoveryPhrase ? (
                        <div className="bg-muted p-4 rounded-md">
                          <div className="font-mono text-sm break-words">
                            {wallet?.mnemonic}
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="mt-2"
                            onClick={() => wallet && copyToClipboard(wallet.mnemonic, 'Recovery phrase')}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy Recovery Phrase
                          </Button>
                        </div>
                      ) : (
                        <div className="bg-muted p-4 rounded-md text-center">
                          <p className="text-sm text-muted-foreground">
                            Your recovery phrase is hidden for security. Click "Show" to reveal.
                          </p>
                        </div>
                      )}
                      
                      <p className="text-sm text-muted-foreground">
                        Write down these words in order and keep them safe. They can be used to recover your wallet.
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between">
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Backup Your Wallet</div>
                      <p className="text-xs text-muted-foreground">
                        Download and safely store your wallet information
                      </p>
                    </div>
                    <Button onClick={downloadWalletInfo}>
                      <Download className="mr-2 h-4 w-4" />
                      Download Wallet Backup
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Import to External Wallets</CardTitle>
                    <CardDescription>
                      Use your recovery phrase to import your wallet to external applications
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="border rounded-lg p-4 text-center">
                        <img 
                          src="/placeholder.svg" 
                          alt="Phantom Wallet" 
                          className="w-16 h-16 mx-auto mb-2"
                        />
                        <div className="font-medium">Phantom Wallet</div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Solana & Ethereum
                        </p>
                        <Button 
                          variant="outline" 
                          className="mt-4 w-full"
                          onClick={() => openWalletInstructions('Phantom Wallet')}
                        >
                          Import Instructions
                        </Button>
                      </div>
                      
                      <div className="border rounded-lg p-4 text-center">
                        <img 
                          src="/placeholder.svg" 
                          alt="Trust Wallet" 
                          className="w-16 h-16 mx-auto mb-2"
                        />
                        <div className="font-medium">Trust Wallet</div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Multi-chain
                        </p>
                        <Button 
                          variant="outline" 
                          className="mt-4 w-full"
                          onClick={() => openWalletInstructions('Trust Wallet')}
                        >
                          Import Instructions
                        </Button>
                      </div>
                      
                      <div className="border rounded-lg p-4 text-center">
                        <img 
                          src="/placeholder.svg" 
                          alt="MetaMask" 
                          className="w-16 h-16 mx-auto mb-2"
                        />
                        <div className="font-medium">MetaMask</div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Ethereum & EVM
                        </p>
                        <Button 
                          variant="outline" 
                          className="mt-4 w-full"
                          onClick={() => openWalletInstructions('MetaMask')}
                        >
                          Import Instructions
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Wallet Import Instructions Dialog */}
              {currentWalletDialog && (
                <WalletImportInstructions
                  walletName={currentWalletDialog}
                  open={!!currentWalletDialog}
                  onOpenChange={() => setCurrentWalletDialog(null)}
                  recoveryPhrase={currentWalletDialog === 'Change Wallet' ? '' : wallet?.mnemonic}
                  onImport={handleImportWallet}
                />
              )}
            </TabsContent>
            
            <TabsContent value="nodes">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Node Management</CardTitle>
                    <CardDescription>
                      Configure and manage your blockchain nodes
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {nodes.map((node) => (
                        <Card key={node.id} className="border">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-lg">
                                  {node.type === 'full' ? 'Full Node' : 'Light Node'}
                                </CardTitle>
                                <CardDescription>ID: {node.id}</CardDescription>
                              </div>
                              <Badge 
                                variant="outline"
                                className={
                                  node.status === 'online' 
                                    ? 'bg-green-500/20 text-green-700' 
                                    : node.status === 'offline' 
                                    ? 'bg-red-500/20 text-red-700' 
                                    : 'bg-yellow-500/20 text-yellow-700'
                                }
                              >
                                {node.status.charAt(0).toUpperCase() + node.status.slice(1)}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="pb-2">
                            <div className="space-y-2">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="text-sm">
                                  <span className="text-muted-foreground">Version:</span>{' '}
                                  {node.version}
                                </div>
                                <div className="text-sm">
                                  <span className="text-muted-foreground">Peers:</span>{' '}
                                  {node.peers}
                                </div>
                              </div>
                              
                              <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Sync Status:</span>
                                  <span>
                                    {Math.round((node.syncedBlocks / node.totalBlocks) * 100)}%
                                  </span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div 
                                    className="bg-primary rounded-full h-2" 
                                    style={{ width: `${(node.syncedBlocks / node.totalBlocks) * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                              
                              <div className="pt-2">
                                <div className="text-sm text-muted-foreground mb-1">System Usage:</div>
                                <div className="grid grid-cols-3 gap-2">
                                  <div className="text-center p-1 bg-muted/50 rounded">
                                    <div className="text-xs text-muted-foreground">CPU</div>
                                    <div className="text-sm font-medium">{node.cpu}%</div>
                                  </div>
                                  <div className="text-center p-1 bg-muted/50 rounded">
                                    <div className="text-xs text-muted-foreground">Memory</div>
                                    <div className="text-sm font-medium">{node.memory}%</div>
                                  </div>
                                  <div className="text-center p-1 bg-muted/50 rounded">
                                    <div className="text-xs text-muted-foreground">Disk</div>
                                    <div className="text-sm font-medium">{node.disk}%</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="flex justify-between">
                            {node.status === 'online' ? (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleNodeAction(node.id, 'stop')}
                              >
                                Stop Node
                              </Button>
                            ) : node.status === 'offline' ? (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleNodeAction(node.id, 'restart')}
                              >
                                Start Node
                              </Button>
                            ) : (
                              <Button 
                                variant="outline" 
                                size="sm"
                                disabled
                              >
                                Syncing...
                              </Button>
                            )}
                            
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleNodeAction(node.id, 'restart')}
                            >
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                      
                      <Card className="border border-dashed flex flex-col items-center justify-center p-6 h-full">
                        <Server className="h-10 w-10 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium">Add New Node</h3>
                        <p className="text-sm text-muted-foreground text-center mt-1 mb-4">
                          Deploy additional nodes to strengthen the network
                        </p>
                        <Button onClick={startNewNode}>
                          Deploy New Node
                        </Button>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Main Node Configuration</CardTitle>
                    <CardDescription>
                      Configure your primary network node
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="node-type">Node Type</Label>
                        <select id="node-type" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                          <option value="full">Full Node (Complete Blockchain)</option>
                          <option value="light">Light Node (Headers Only)</option>
                          <option value="archive">Archive Node (Historical Data)</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="max-peers">Maximum Peers</Label>
                        <Input id="max-peers" type="number" defaultValue="50" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="rpc-port">RPC Port</Label>
                        <Input id="rpc-port" type="number" defaultValue="8545" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="p2p-port">P2P Port</Label>
                        <Input id="p2p-port" type="number" defaultValue="30303" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="data-dir">Data Directory</Label>
                        <Input id="data-dir" defaultValue="/var/lib/blockchain/data" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="log-level">Log Level</Label>
                        <select id="log-level" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                          <option value="info">Info</option>
                          <option value="debug">Debug</option>
                          <option value="warn">Warning</option>
                          <option value="error">Error</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="mining" defaultChecked />
                        <Label htmlFor="mining">Enable Mining</Label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Allow this node to participate in mining new blocks
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="auto-update" defaultChecked />
                        <Label htmlFor="auto-update">Automatic Updates</Label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Automatically update to new node software versions
                      </p>
                    </div>
                    
                    <Button onClick={() => toast.success('Node configuration saved')}>
                      Save Configuration
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>
                    Configure which notifications you want to receive
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    {notificationSettings.map((setting) => (
                      <div key={setting.id} className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="font-medium">{setting.title}</div>
                          <div className="text-sm text-muted-foreground">{setting.description}</div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className={setting.enabled ? "text-green-600" : "text-muted-foreground"}
                          onClick={() => handleToggleNotification(setting.id)}
                        >
                          {setting.enabled ? (
                            <><Bell className="h-4 w-4 mr-2" />Enabled</>
                          ) : (
                            <><BellOff className="h-4 w-4 mr-2" />Disabled</>
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Notification Channels</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="email-notifications" defaultChecked />
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                      </div>
                      <p className="text-sm text-muted-foreground pl-9">
                        Receive notifications via email
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="push-notifications" defaultChecked />
                        <Label htmlFor="push-notifications">Push Notifications</Label>
                      </div>
                      <p className="text-sm text-muted-foreground pl-9">
                        Receive notifications on your devices
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="sms-notifications" />
                        <Label htmlFor="sms-notifications">SMS Notifications</Label>
                      </div>
                      <p className="text-sm text-muted-foreground pl-9">
                        Receive important alerts via SMS
                      </p>
                    </div>

                    <Button onClick={() => toast.success('Notification preferences saved')}>
                      Save Preferences
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="mobile">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Mobile Applications</CardTitle>
                    <CardDescription>
                      Download mobile apps for iOS and Android
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="border rounded-lg p-6">
                        <div className="flex items-center gap-4">
                          <div className="bg-primary/10 rounded-full p-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary"><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"></path><path d="M10 2c1 .5 2 2 2 5"></path></svg>
                          </div>
                          <div>
                            <h3 className="text-lg font-medium">iOS App</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              Available on the App Store
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-6 space-y-4">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">Version 1.2.0</Badge>
                            <Badge variant="outline" className="bg-green-500/20 text-green-700">Latest</Badge>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="text-sm font-medium">Features:</div>
                            <ul className="text-sm space-y-1">
                              <li className="flex items-start gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-green-500 mt-0.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                <span>Wallet Management</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-green-500 mt-0.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                <span>Mining Dashboard</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-green-500 mt-0.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                <span>Real-time Notifications</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-green-500 mt-0.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                <span>Node Management</span>
                              </li>
                            </ul>
                          </div>
                          
                          <Button className="w-full">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                            Download for iOS
                          </Button>
                          
                          <div className="flex justify-center">
                            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded">
                              <QrCode className="h-20 w-20" />
                            </div>
                          </div>
                          <p className="text-xs text-center text-muted-foreground">
                            Scan QR code with your iOS device to download
                          </p>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-6">
                        <div className="flex items-center gap-4">
                          <div className="bg-primary/10 rounded-full p-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary"><path d="M7.5 4.27c.48-.15 1-.15 1.5-.08a4.5 4.5 0 0 1 6 4.33 32.27 32.27 0 0 1 0 4.94 4.5 4.5 0 0 1-6 4.33c-.5.07-1.01.07-1.5-.08a4.5 4.5 0 0 1-3-4.24 32.27 32.27 0 0 1 0-4.94 4.5 4.5 0 0 1 3-4.26Z"></path><path d="M11.11 15 14 9"></path><path d="M5 4.5v15"></path><path d="M19 4.5h-4.5C13.12 4.5 12 5.62 12 7v0c0 1.38 1.12 2.5 2.5 2.5H19v4"></path><path d="M12 14.5h1.5c1.38 0 2.5-1.12 2.5-2.5v0c0-1.38-1.12-2.5-2.5-2.5H12v5Z"></path></svg>
                          </div>
                          <div>
                            <h3 className="text-lg font-medium">Android App</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              Available on Google Play
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-6 space-y-4">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">Version 1.2.1</Badge>
                            <Badge variant="outline" className="bg-green-500/20 text-green-700">Latest</Badge>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="text-sm font-medium">Features:</div>
                            <ul className="text-sm space-y-1">
                              <li className="flex items-start gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-green-500 mt-0.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                <span>Wallet Management</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-green-500 mt-0.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                <span>Mining Dashboard</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-green-500 mt-0.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                <span>Real-time Notifications</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-green-500 mt-0.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                <span>Background Mining</span>
                              </li>
                            </ul>
                          </div>
                          
                          <Button className="w-full">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                            Download for Android
                          </Button>
                          
                          <div className="flex justify-center">
                            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded">
                              <QrCode className="h-20 w-20" />
                            </div>
                          </div>
                          <p className="text-xs text-center text-muted-foreground">
                            Scan QR code with your Android device to download
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Direct APK Download</CardTitle>
                    <CardDescription>
                      For Android devices without Google Play Services
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-muted rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">MintopiaWallet-v1.2.1.apk</h3>
                          <p className="text-sm text-muted-foreground">35.2 MB • Latest Version</p>
                        </div>
                        <Button>Download APK</Button>
                      </div>
                      
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md border border-yellow-200 dark:border-yellow-900/50">
                        <div className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mr-2 mt-0.5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                          <div>
                            <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-400">Important Security Notice</h4>
                            <p className="text-sm text-yellow-700 dark:text-yellow-500 mt-1">
                              You may need to enable "Install from Unknown Sources" in your Android settings to install this APK directly.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;
