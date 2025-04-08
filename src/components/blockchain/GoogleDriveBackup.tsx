
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  CloudOff,
  Database,
  Lock,
  RefreshCw,
  DownloadCloud,
  Upload,
  Calendar,
  FileText,
  Check,
  ChevronDown,
  ChevronUp,
  Trash2,
  CloudCog,
  HardDrive,
  AlertCircle,
  Cloud
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { markAccountAsSetup } from '@/utils/authUtils';

interface GoogleDriveBackupProps {
  isConnected?: boolean;
  email?: string;
  remotePath?: string;
}

const GoogleDriveBackup: React.FC<GoogleDriveBackupProps> = ({ 
  isConnected = false, 
  email = '', 
  remotePath = 'mintopia-backups' 
}) => {
  const [connected, setConnected] = useState(isConnected);
  const [userEmail, setUserEmail] = useState(email);
  const [folderPath, setFolderPath] = useState(remotePath);
  const [autoBackup, setAutoBackup] = useState(true);
  const [backupIntervals, setBackupIntervals] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [encryptBackups, setEncryptBackups] = useState(true);
  const [backupPassword, setBackupPassword] = useState('');
  const [advanced, setAdvanced] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [lastBackupDate, setLastBackupDate] = useState<string | null>(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [googleAuthEmail, setGoogleAuthEmail] = useState('');
  const [googleAuthPassword, setGoogleAuthPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  
  // Load existing configuration on component mount
  useEffect(() => {
    const loadConfig = () => {
      try {
        const savedConfig = localStorage.getItem('googleDriveConfig');
        if (savedConfig) {
          const config = JSON.parse(savedConfig);
          setConnected(config.isConnected || false);
          setUserEmail(config.email || '');
          setFolderPath(config.folderPath || 'mintopia-backups');
          setAutoBackup(config.autoBackup !== undefined ? config.autoBackup : true);
          setBackupIntervals(config.backupIntervals || 'daily');
          setEncryptBackups(config.encryptBackups !== undefined ? config.encryptBackups : true);
          setLastBackupDate(config.lastBackupDate || null);
          setSetupComplete(config.setupComplete || false);
        }
      } catch (error) {
        console.error('Error loading Google Drive configuration:', error);
      }
    };
    
    loadConfig();
  }, []);
  
  const handleConnectGoogleDrive = () => {
    setShowAuthDialog(true);
  };
  
  const handleGoogleAuth = () => {
    if (!googleAuthEmail || !googleAuthPassword) {
      toast.error('Please enter both email and password');
      return;
    }
    
    setIsAuthenticating(true);
    toast.info('Connecting to Google Drive...');
    
    // Simulate authentication process
    setTimeout(() => {
      setIsAuthenticating(false);
      setConnected(true);
      setUserEmail(googleAuthEmail);
      setShowAuthDialog(false);
      toast.success('Connected to Google Drive successfully');
      
      // Save the connection state
      saveConfiguration({
        isConnected: true,
        email: googleAuthEmail
      });
      
      // Mark setup as complete
      completeSetup();
    }, 2000);
  };
  
  const completeSetup = () => {
    markAccountAsSetup();
    setSetupComplete(true);
    
    // Update local storage with setup completion
    saveConfiguration({
      setupComplete: true
    });
    
    toast.success('Google Drive backup configuration completed');
  };
  
  const handleDisconnectGoogleDrive = () => {
    toast.info('Disconnecting from Google Drive...');
    
    setTimeout(() => {
      setConnected(false);
      setUserEmail('');
      toast.success('Disconnected from Google Drive');
      
      // Save the disconnected state
      saveConfiguration({
        isConnected: false,
        email: ''
      });
    }, 1000);
  };
  
  const handleManualBackup = () => {
    setIsBackingUp(true);
    toast.info('Backing up to Google Drive...');
    
    setTimeout(() => {
      setIsBackingUp(false);
      const now = new Date().toISOString();
      setLastBackupDate(now);
      
      // Save the backup date
      saveConfiguration({
        lastBackupDate: now
      });
      
      toast.success('Backup completed successfully');
    }, 3000);
  };
  
  const saveConfiguration = (updates = {}) => {
    try {
      // Get current config or create a new one
      const existingConfig = localStorage.getItem('googleDriveConfig');
      let config = existingConfig ? JSON.parse(existingConfig) : {};
      
      // Create the updated configuration
      const updatedConfig = {
        ...config,
        isConnected: connected,
        email: userEmail,
        folderPath: folderPath,
        autoBackup: autoBackup,
        backupIntervals: backupIntervals,
        encryptBackups: encryptBackups,
        ...updates
      };
      
      // Save to localStorage
      localStorage.setItem('googleDriveConfig', JSON.stringify(updatedConfig));
      
      return true;
    } catch (error) {
      console.error('Error saving Google Drive configuration:', error);
      return false;
    }
  };
  
  const handleSaveSettings = () => {
    if (saveConfiguration()) {
      toast.success('Google Drive backup settings saved');
      
      // Mark setup as complete if not already
      if (!setupComplete) {
        completeSetup();
      }
    } else {
      toast.error('Failed to save settings');
    }
  };
  
  const updateFolderPath = () => {
    if (saveConfiguration({ folderPath })) {
      toast.success('Folder path updated');
    } else {
      toast.error('Failed to update folder path');
    }
  };
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5 text-primary" />
            Google Drive Backup Configuration
          </CardTitle>
          <CardDescription>
            Configure automatic backups to Google Drive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!setupComplete && (
            <div className="bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 p-4 rounded-md mb-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-800 dark:text-amber-500">Setup Required</h4>
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    Complete your admin setup by connecting to Google Drive and configuring backup settings.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-md bg-secondary/30">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CloudCog className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-medium">Google Drive Integration</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {connected 
                  ? `Connected as ${userEmail}`
                  : 'Connect your Google Drive account to enable automatic backups'}
              </p>
            </div>
            
            {connected ? (
              <Button 
                variant="outline" 
                onClick={handleDisconnectGoogleDrive}
                className="shrink-0"
              >
                <CloudOff className="h-4 w-4 mr-2" />
                Disconnect
              </Button>
            ) : (
              <Button 
                onClick={handleConnectGoogleDrive}
                className="bg-blue-600 hover:bg-blue-700 shrink-0"
              >
                <Cloud className="h-4 w-4 mr-2" />
                Connect Google Drive
              </Button>
            )}
          </div>
          
          <div className={connected ? "" : "opacity-50 pointer-events-none"}>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="folder-path">Backup Folder Path</Label>
                <div className="flex gap-2">
                  <Input 
                    id="folder-path" 
                    value={folderPath}
                    onChange={(e) => setFolderPath(e.target.value)}
                    placeholder="mintopia-backups"
                  />
                  <Button variant="outline" onClick={updateFolderPath}>
                    Update
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Path where backups will be stored in your Google Drive
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Automatic Backups</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically back up your system at scheduled intervals
                    </p>
                  </div>
                  <Switch 
                    checked={autoBackup} 
                    onCheckedChange={(checked) => {
                      setAutoBackup(checked);
                      saveConfiguration({ autoBackup: checked });
                    }}
                  />
                </div>
                
                {autoBackup && (
                  <div className="ml-6 border-l pl-4 space-y-4">
                    <div className="space-y-2">
                      <Label>Backup Frequency</Label>
                      <div className="flex flex-wrap gap-2">
                        <Button 
                          variant={backupIntervals === 'daily' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => {
                            setBackupIntervals('daily');
                            saveConfiguration({ backupIntervals: 'daily' });
                          }}
                        >
                          Daily
                        </Button>
                        <Button
                          variant={backupIntervals === 'weekly' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => {
                            setBackupIntervals('weekly');
                            saveConfiguration({ backupIntervals: 'weekly' });
                          }}
                        >
                          Weekly
                        </Button>
                        <Button
                          variant={backupIntervals === 'monthly' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => {
                            setBackupIntervals('monthly');
                            saveConfiguration({ backupIntervals: 'monthly' });
                          }}
                        >
                          Monthly
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>What to Back Up</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="backup-database" defaultChecked />
                          <label htmlFor="backup-database" className="text-sm">Database</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="backup-blockchain" defaultChecked />
                          <label htmlFor="backup-blockchain" className="text-sm">Blockchain Data</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="backup-wallet" defaultChecked />
                          <label htmlFor="backup-wallet" className="text-sm">Wallet Information</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="backup-config" defaultChecked />
                          <label htmlFor="backup-config" className="text-sm">Configuration Files</label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Encryption</Label>
                    <p className="text-sm text-muted-foreground">
                      Secure your backups with encryption
                    </p>
                  </div>
                  <Switch 
                    checked={encryptBackups} 
                    onCheckedChange={(checked) => {
                      setEncryptBackups(checked);
                      saveConfiguration({ encryptBackups: checked });
                    }}
                  />
                </div>
                
                {encryptBackups && (
                  <div className="ml-6 border-l pl-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="backup-password">Encryption Password</Label>
                      <Input 
                        id="backup-password" 
                        type="password"
                        value={backupPassword}
                        onChange={(e) => setBackupPassword(e.target.value)} 
                        placeholder="Enter a strong password"
                      />
                      <p className="text-xs text-muted-foreground">
                        You'll need this password to restore your backup. Keep it safe!
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAdvanced(!advanced)}
                  className="flex items-center justify-between w-full"
                >
                  <span>Advanced Options</span>
                  {advanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
                
                {advanced && (
                  <div className="pt-4 space-y-4">
                    <div className="space-y-2">
                      <Label>Version Control</Label>
                      <select 
                        className="w-full p-2 border rounded"
                        onChange={(e) => saveConfiguration({ versionControl: e.target.value })}
                      >
                        <option value="5">Keep last 5 backups</option>
                        <option value="10">Keep last 10 backups</option>
                        <option value="all">Keep all backups</option>
                      </select>
                      <p className="text-xs text-muted-foreground">
                        Control how many backup versions to retain
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Compression Level</Label>
                      <select 
                        className="w-full p-2 border rounded"
                        onChange={(e) => saveConfiguration({ compressionLevel: e.target.value })}
                      >
                        <option value="low">Low (Faster)</option>
                        <option value="medium">Medium</option>
                        <option value="high">High (Smaller Size)</option>
                      </select>
                      <p className="text-xs text-muted-foreground">
                        Higher compression saves space but takes longer
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="backup-notification" 
                        defaultChecked 
                        onChange={(e) => saveConfiguration({ sendNotifications: e.target.checked })}
                      />
                      <Label htmlFor="backup-notification" className="text-sm">
                        Send email notification after backup
                      </Label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant="outline" className={connected ? "bg-green-500/20 text-green-700" : "bg-red-500/20 text-red-700"}>
                  {connected ? "Connected" : "Disconnected"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Last Backup</span>
                <span className="text-sm font-medium">
                  {lastBackupDate ? new Date(lastBackupDate).toLocaleString() : "Never"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Next Backup</span>
                <span className="text-sm font-medium">
                  {autoBackup && connected 
                    ? `${new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString()} (${backupIntervals})`
                    : "Not Scheduled"}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <Button 
                onClick={handleManualBackup}
                disabled={!connected || isBackingUp}
              >
                {isBackingUp ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Backing Up...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Backup Now
                  </>
                )}
              </Button>
              <Button variant="outline" disabled={!connected} onClick={() => toast.success('Restore operation started. Please wait...')}>
                <DownloadCloud className="h-4 w-4 mr-2" />
                Restore from Drive
              </Button>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => {
                // Reset form fields but don't disconnect
                setFolderPath('mintopia-backups');
                setAutoBackup(true);
                setBackupIntervals('daily');
                setEncryptBackups(true);
                setBackupPassword('');
                setAdvanced(false);
                toast.info('Settings reset');
              }}
            >
              Reset Settings
            </Button>
            <Button onClick={handleSaveSettings}>
              <Check className="h-4 w-4 mr-2" />
              Save Configuration
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connect Google Drive Account</DialogTitle>
            <DialogDescription>
              Enter your Google account credentials to authorize access to Google Drive for backup services
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="google-email">Google Email</Label>
              <Input
                id="google-email"
                placeholder="your.email@gmail.com"
                type="email"
                value={googleAuthEmail}
                onChange={(e) => setGoogleAuthEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="google-password">Password</Label>
              <Input
                id="google-password"
                type="password"
                placeholder="Enter your password"
                value={googleAuthPassword}
                onChange={(e) => setGoogleAuthPassword(e.target.value)}
              />
            </div>
            
            <div className="flex justify-between mt-2">
              <Button variant="outline" onClick={() => setShowAuthDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleGoogleAuth} disabled={isAuthenticating}>
                {isAuthenticating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  'Connect'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GoogleDriveBackup;
