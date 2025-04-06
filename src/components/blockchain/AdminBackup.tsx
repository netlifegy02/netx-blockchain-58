
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
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  Download,
  Upload,
  RefreshCw,
  HardDrive,
  Calendar,
  Server,
  Share2
} from 'lucide-react';

interface BackupData {
  id: string;
  date: string;
  size: string;
  status: 'completed' | 'pending' | 'failed';
  type: 'full' | 'incremental';
}

const AdminBackup: React.FC = () => {
  const [localBackupPath, setLocalBackupPath] = useState('/var/backups/mintopia');
  const [backups, setBackups] = useState<BackupData[]>([
    {
      id: 'backup-001',
      date: '2025-04-06 14:30:00',
      size: '256 MB',
      status: 'completed',
      type: 'full'
    },
    {
      id: 'backup-002',
      date: '2025-04-05 14:30:00',
      size: '128 MB',
      status: 'completed',
      type: 'incremental'
    },
    {
      id: 'backup-003',
      date: '2025-04-04 14:30:00',
      size: '245 MB',
      status: 'completed',
      type: 'full'
    },
    {
      id: 'backup-004',
      date: '2025-04-03 14:30:00',
      size: '120 MB',
      status: 'failed',
      type: 'incremental'
    }
  ]);
  
  const [isBackupInProgress, setIsBackupInProgress] = useState(false);
  
  const handleCreateBackup = () => {
    setIsBackupInProgress(true);
    toast.info('Creating system backup...');
    
    // Simulate backup process
    setTimeout(() => {
      const newBackup = {
        id: 'backup-' + Math.random().toString(36).substring(2, 5),
        date: new Date().toISOString().replace('T', ' ').substring(0, 19),
        size: Math.floor(Math.random() * 200 + 100) + ' MB',
        status: 'completed' as const,
        type: 'full' as const
      };
      
      setBackups([newBackup, ...backups]);
      setIsBackupInProgress(false);
      toast.success('System backup created successfully');
    }, 3000);
  };
  
  const handleRestoreBackup = (backupId: string) => {
    toast.info(`Restoring backup ${backupId}...`);
    
    // Simulate restore process
    setTimeout(() => {
      toast.success(`Backup ${backupId} restored successfully`);
    }, 2000);
  };
  
  const handleDownloadBackup = (backupId: string) => {
    toast.info(`Downloading backup ${backupId}...`);
    
    // Simulate download process
    setTimeout(() => {
      toast.success(`Backup ${backupId} downloaded successfully`);
    }, 1500);
  };
  
  const handleDeleteBackup = (backupId: string) => {
    toast.info(`Deleting backup ${backupId}...`);
    
    // Remove the backup from the list
    setBackups(backups.filter(backup => backup.id !== backupId));
    toast.success(`Backup ${backupId} deleted successfully`);
  };
  
  const handleUpdateLocalPath = () => {
    toast.success(`Local backup path updated to ${localBackupPath}`);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5 text-primary" />
            System Backup
          </CardTitle>
          <CardDescription>
            Create and manage system backups for the blockchain network
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Create New Backup</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary/50 p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground">Database Size</div>
                  <div className="text-xl font-semibold">1.2 GB</div>
                </div>
                
                <div className="bg-secondary/50 p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground">Blockchain Size</div>
                  <div className="text-xl font-semibold">4.8 GB</div>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label>Backup Type</Label>
                  <Badge variant="outline">Full Backup</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Includes all blockchain data, user accounts, and system configurations
                </p>
              </div>
              
              <Button 
                onClick={handleCreateBackup} 
                disabled={isBackupInProgress}
                className="w-full"
              >
                {isBackupInProgress ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Creating Backup...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Create System Backup
                  </>
                )}
              </Button>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Local Backup Configuration</h3>
              
              <div className="space-y-2">
                <Label htmlFor="localPath">Local Backup Path</Label>
                <div className="flex gap-2">
                  <Input 
                    id="localPath" 
                    value={localBackupPath}
                    onChange={(e) => setLocalBackupPath(e.target.value)}
                  />
                  <Button variant="outline" onClick={handleUpdateLocalPath}>
                    Update
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Path where backups will be stored on the local server
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Auto Backup Schedule</Label>
                  <Badge variant="outline" className="bg-blue-500/20 text-blue-700">Daily at 2 AM</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  System automatically creates daily backups
                </p>
              </div>
              
              <Button variant="outline" className="w-full">
                <Share2 className="h-4 w-4 mr-2" />
                Configure Remote Backup
              </Button>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <h3 className="text-lg font-medium mb-4">Backup History</h3>
          
          <div className="border rounded-md">
            <div className="grid grid-cols-6 gap-2 p-4 border-b font-medium">
              <div>Backup ID</div>
              <div>Date</div>
              <div>Size</div>
              <div>Type</div>
              <div>Status</div>
              <div className="text-right">Actions</div>
            </div>
            
            {backups.map(backup => (
              <div key={backup.id} className="grid grid-cols-6 gap-2 p-4 border-b last:border-0">
                <div className="font-mono text-sm">{backup.id}</div>
                <div>{backup.date}</div>
                <div>{backup.size}</div>
                <div>
                  <Badge variant="outline">
                    {backup.type === 'full' ? 'Full' : 'Incremental'}
                  </Badge>
                </div>
                <div>
                  <Badge
                    variant="outline"
                    className={
                      backup.status === 'completed'
                        ? 'bg-green-500/20 text-green-700'
                        : backup.status === 'pending'
                        ? 'bg-yellow-500/20 text-yellow-700'
                        : 'bg-red-500/20 text-red-700'
                    }
                  >
                    {backup.status}
                  </Badge>
                </div>
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRestoreBackup(backup.id)}
                    title="Restore"
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDownloadBackup(backup.id)}
                    title="Download"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteBackup(backup.id)}
                    title="Delete"
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                      <path d="M3 6h18"></path>
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    </svg>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBackup;
