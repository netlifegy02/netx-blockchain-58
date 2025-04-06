
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Download, 
  Wallet, 
  Server, 
  Shield, 
  User, 
  Globe, 
  Smartphone, 
  Network, 
  Lock,
  Key
} from 'lucide-react';
import { toast } from 'sonner';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const SettingsPage = () => {
  const navigate = useNavigate();
  const [nodeId, setNodeId] = useState('node-' + Math.random().toString(36).substring(2, 10));
  const [walletAddress, setWalletAddress] = useState('0x' + Math.random().toString(36).substring(2, 12));
  const [masterNode, setMasterNode] = useState(false);
  const [seedNodes, setSeedNodes] = useState([
    { id: 'seed-01', address: '192.168.1.101', status: 'online', type: 'master' },
    { id: 'seed-02', address: '192.168.1.102', status: 'online', type: 'validator' },
    { id: 'seed-03', address: '192.168.1.103', status: 'offline', type: 'validator' },
  ]);
  
  const handleGenerateWallet = () => {
    setWalletAddress('0x' + Math.random().toString(36).substring(2, 12));
    toast.success('New wallet generated successfully');
  };
  
  const handleRegenerateNodeId = () => {
    setNodeId('node-' + Math.random().toString(36).substring(2, 10));
    toast.success('Node ID regenerated successfully');
  };
  
  const handleToggleMasterNode = () => {
    setMasterNode(!masterNode);
    toast.success(`Master node ${!masterNode ? 'enabled' : 'disabled'}`);
  };
  
  const handleSaveNodeSettings = () => {
    toast.success('Node settings saved successfully');
  };
  
  const handleDownloadApp = (platform: 'android' | 'ios') => {
    toast.success(`Downloading ${platform === 'android' ? 'Android' : 'iOS'} app`);
    // In a real app, this would redirect to the app store or provide a download link
  };
  
  return (
    <Layout>
      <div className="container py-6">
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-1">User Settings</h2>
          <p className="text-muted-foreground">
            Manage your account, wallet, and blockchain nodes
          </p>
        </div>
        
        <Tabs defaultValue="account" className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full max-w-4xl">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
            <TabsTrigger value="nodes">Nodes</TabsTrigger>
            <TabsTrigger value="apps">Mobile Apps</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="account" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Account Information
                </CardTitle>
                <CardDescription>
                  Manage your personal information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" placeholder="Your full name" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="your@email.com" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" placeholder="your-username" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Input id="timezone" placeholder="UTC+0" />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="marketing" className="flex items-center gap-2">
                      Receive Marketing Emails
                    </Label>
                    <Switch id="marketing" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notifications" className="flex items-center gap-2">
                      Enable Notifications
                    </Label>
                    <Switch id="notifications" defaultChecked />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="wallet" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-primary" />
                  Wallet Management
                </CardTitle>
                <CardDescription>
                  Manage your blockchain wallet and addresses
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Wallet Address</Label>
                  <div className="flex items-center gap-2">
                    <Input value={walletAddress} readOnly className="font-mono text-sm" />
                    <Button variant="outline" onClick={handleGenerateWallet}>
                      Generate New
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    This is your unique wallet address for transactions
                  </p>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label>Wallet Balance</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-secondary/50 p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground">Available Balance</div>
                      <div className="text-2xl font-bold">2,345.67 MINTX</div>
                    </div>
                    
                    <div className="bg-secondary/50 p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground">Staked Balance</div>
                      <div className="text-2xl font-bold">500.00 MINTX</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button>Send</Button>
                  <Button variant="outline">Receive</Button>
                  <Button variant="outline">Transaction History</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="nodes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-primary" />
                  Node Configuration
                </CardTitle>
                <CardDescription>
                  Configure your blockchain node settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Your Node ID</Label>
                  <div className="flex items-center gap-2">
                    <Input value={nodeId} readOnly className="font-mono text-sm" />
                    <Button variant="outline" onClick={handleRegenerateNodeId}>
                      Regenerate
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="master-node"
                    checked={masterNode}
                    onCheckedChange={handleToggleMasterNode}
                  />
                  <Label htmlFor="master-node">Run as Master Node</Label>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label>Node Configuration</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="port">Port</Label>
                      <Input id="port" placeholder="8080" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="maxConnections">Max Connections</Label>
                      <Input id="maxConnections" placeholder="50" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="dataDir">Data Directory</Label>
                      <Input id="dataDir" placeholder="/data/blockchain" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="logLevel">Log Level</Label>
                      <Input id="logLevel" placeholder="info" />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>Connected Seed Nodes</Label>
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="outline" size="sm">Add Node</Button>
                      </SheetTrigger>
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle>Add New Seed Node</SheetTitle>
                        </SheetHeader>
                        <div className="space-y-4 mt-4">
                          <div className="space-y-2">
                            <Label htmlFor="nodeAddress">Node Address</Label>
                            <Input id="nodeAddress" placeholder="192.168.1.100" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="nodeType">Node Type</Label>
                            <Input id="nodeType" placeholder="validator" />
                          </div>
                          <Button className="w-full mt-4">Add Node</Button>
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>
                  
                  <div className="border rounded-md">
                    <div className="grid grid-cols-4 gap-2 p-4 border-b font-medium">
                      <div>Node ID</div>
                      <div>Address</div>
                      <div>Type</div>
                      <div>Status</div>
                    </div>
                    {seedNodes.map(node => (
                      <div key={node.id} className="grid grid-cols-4 gap-2 p-4 border-b last:border-0">
                        <div className="font-mono text-sm">{node.id}</div>
                        <div>{node.address}</div>
                        <div>{node.type}</div>
                        <div>
                          <Badge
                            variant="outline"
                            className={
                              node.status === 'online' 
                                ? 'bg-green-500/20 text-green-600 hover:bg-green-500/20 hover:text-green-600'
                                : 'bg-red-500/20 text-red-600 hover:bg-red-500/20 hover:text-red-600'
                            }
                          >
                            {node.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button onClick={handleSaveNodeSettings}>Save Node Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="apps" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-primary" />
                  Mobile Applications
                </CardTitle>
                <CardDescription>
                  Download our mobile applications for Android and iOS
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border rounded-xl p-6 flex flex-col items-center text-center space-y-4">
                    <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="h-10 w-10 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path fill="currentColor" d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.6 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold">Android App</h3>
                    <p className="text-muted-foreground">
                      Download our Android application to manage your blockchain assets on the go.
                    </p>
                    <Button 
                      className="w-full" 
                      onClick={() => handleDownloadApp('android')}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download for Android
                    </Button>
                  </div>
                  
                  <div className="border rounded-xl p-6 flex flex-col items-center text-center space-y-4">
                    <div className="h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                        <path fill="currentColor" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold">iOS App</h3>
                    <p className="text-muted-foreground">
                      Download our iOS application to manage your blockchain assets on the go.
                    </p>
                    <Button 
                      className="w-full" 
                      onClick={() => handleDownloadApp('ios')}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download for iOS
                    </Button>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
                  <h4 className="font-semibold mb-2">App Features:</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Manage your wallet and transactions on the go</li>
                    <li>Monitor your node status and performance</li>
                    <li>Receive real-time notifications for important events</li>
                    <li>Track market prices and token performance</li>
                    <li>Secure authentication with biometrics</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Manage your account security and permissions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                  </div>
                  
                  <Button>Update Password</Button>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Enable 2FA</Label>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Switch id="2fa" />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">API Keys</h3>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="border rounded-md p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">Main API Key</h4>
                          <p className="text-sm text-muted-foreground">Created on April 1, 2025</p>
                        </div>
                        <Badge variant="outline">Active</Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Input value="sk_live_••••••••••••••••••••••••••" readOnly className="font-mono text-sm" />
                        <Button variant="outline" size="icon">
                          <Key className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="outline">Generate New API Key</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default SettingsPage;
