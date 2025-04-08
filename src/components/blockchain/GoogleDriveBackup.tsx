
import React, { useState } from 'react';
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
  Cloud,
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
  HardDrive
} from 'lucide-react';

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
  
  const handleConnectGoogleDrive = () => {
    toast.info('Connecting to Google Drive...');
    
    setTimeout(() => {
      setConnected(true);
      setUserEmail('admin@mintopia.com');
      toast.success('Connected to Google Drive successfully');
    }, 1500);
  };
  
  const handleDisconnectGoogleDrive = () => {
    toast.info('Disconnecting from Google Drive...');
    
    setTimeout(() => {
      setConnected(false);
      setUserEmail('');
      toast.success('Disconnected from Google Drive');
    }, 1000);
  };
  
  const handleManualBackup = () => {
    setIsBackingUp(true);
    toast.info('Backing up to Google Drive...');
    
    setTimeout(() => {
      setIsBackingUp(false);
      const now = new Date().toISOString();
      setLastBackupDate(now);
      toast.success('Backup completed successfully');
    }, 3000);
  };
  
  const handleSaveSettings = () => {
    toast.success('Google Drive backup settings saved');
  };
  
  return (
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
                <Button variant="outline" onClick={() => toast.success('Folder path updated')}>
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
                  onCheckedChange={setAutoBackup} 
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
                        onClick={() => setBackupIntervals('daily')}
                      >
                        Daily
                      </Button>
                      <Button
                        variant={backupIntervals === 'weekly' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setBackupIntervals('weekly')}
                      >
                        Weekly
                      </Button>
                      <Button
                        variant={backupIntervals === 'monthly' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setBackupIntervals('monthly')}
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
                  onCheckedChange={setEncryptBackups} 
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
                    <select className="w-full p-2 border rounded">
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
                    <select className="w-full p-2 border rounded">
                      <option value="low">Low (Faster)</option>
                      <option value="medium">Medium</option>
                      <option value="high">High (Smaller Size)</option>
                    </select>
                    <p className="text-xs text-muted-foreground">
                      Higher compression saves space but takes longer
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="backup-notification" defaultChecked />
                    <Label htmlFor="backup-notification" className="text-sm">
                      Send email notification after backup
                    </Label>
                  </div>
                </div>
              )}
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
              <Button variant="outline" disabled={!connected}>
                <DownloadCloud className="h-4 w-4 mr-2" />
                Restore from Drive
              </Button>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => toast.info('Settings reset')}>
              Reset Settings
            </Button>
            <Button onClick={handleSaveSettings}>
              <Check className="h-4 w-4 mr-2" />
              Save Configuration
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoogleDriveBackup;
