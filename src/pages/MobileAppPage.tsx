
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Download, 
  Smartphone, 
  Tablet, 
  Github, 
  CheckCircle,
  Lock,
  Shield,
  Settings,
  Upload,
  ArrowUpDown,
  Clock,
  Fingerprint,
  AlertTriangle
} from 'lucide-react';
import Layout from '@/components/Layout';
import AppLockScreen from '@/components/mobile/AppLockScreen';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { getUserInfo } from '@/utils/authUtils';

interface AppRelease {
  version: string;
  date: string;
  size: string;
  isLatest: boolean;
  sizeInMB: number;
  miningEnabled?: boolean;
  miningRate?: number;
}

interface AppConfig {
  lockType: 'pin' | 'pattern' | 'none';
  autoLock: boolean;
  autoLockTimeout: number;
  miningEnabled: boolean;
  miningRate: number;
}

const MobileAppPage: React.FC = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showLockScreen, setShowLockScreen] = useState(false);
  const [showAppSettings, setShowAppSettings] = useState(false);
  const [deviceApps, setDeviceApps] = useState<any[]>([]);
  const [appConfig, setAppConfig] = useState<AppConfig>({
    lockType: 'pin',
    autoLock: true,
    autoLockTimeout: 5,
    miningEnabled: true,
    miningRate: 0.01
  });

  useEffect(() => {
    // Load installed apps from localStorage
    const storedApps = localStorage.getItem('deviceApps');
    if (storedApps) {
      setDeviceApps(JSON.parse(storedApps));
    }

    // Load app config from localStorage
    const storedConfig = localStorage.getItem('appConfig');
    if (storedConfig) {
      setAppConfig(JSON.parse(storedConfig));
    } else {
      // Save default config if none exists
      localStorage.setItem('appConfig', JSON.stringify(appConfig));
    }
  }, []);
  
  const androidReleases: AppRelease[] = [
    {
      version: '1.2.5',
      date: '2025-04-06',
      size: '24.5 MB',
      isLatest: true,
      sizeInMB: 24.5,
      miningEnabled: true,
      miningRate: 0.05
    },
    {
      version: '1.2.0',
      date: '2025-03-20',
      size: '23.8 MB',
      isLatest: false,
      sizeInMB: 23.8,
      miningEnabled: true,
      miningRate: 0.03
    },
    {
      version: '1.1.0',
      date: '2025-02-15',
      size: '22.1 MB',
      isLatest: false,
      sizeInMB: 22.1,
      miningEnabled: false
    }
  ];
  
  const iosReleases: AppRelease[] = [
    {
      version: '1.2.5',
      date: '2025-04-06',
      size: '30.2 MB',
      isLatest: true,
      sizeInMB: 30.2,
      miningEnabled: true,
      miningRate: 0.04
    },
    {
      version: '1.2.0',
      date: '2025-03-20',
      size: '29.7 MB',
      isLatest: false,
      sizeInMB: 29.7,
      miningEnabled: true,
      miningRate: 0.02
    },
    {
      version: '1.1.0',
      date: '2025-02-15',
      size: '28.3 MB',
      isLatest: false,
      sizeInMB: 28.3,
      miningEnabled: false
    }
  ];

  const handleDownloadApk = (version: string, sizeMB: number, miningEnabled?: boolean, miningRate?: number) => {
    setIsDownloading(true);
    toast.info(`Downloading Android APK v${version}...`);
    
    // Create a blob with appropriate MIME type
    const blob = new Blob([new ArrayBuffer(sizeMB * 1024 * 1024)], { 
      type: 'application/vnd.android.package-archive' 
    });
    
    // Create object URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Create temporary anchor element to trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = `mintopia-v${version}.apk`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Save the app to device apps list
    const newDeviceApp = {
      id: `app-${Date.now()}`,
      appType: 'APK',
      appName: 'Mintopia Wallet',
      appVersion: version,
      installed: true,
      installDate: new Date().toISOString(),
      miningEnabled: miningEnabled || false,
      miningRate: miningRate || 0
    };
    
    const updatedApps = [...deviceApps, newDeviceApp];
    setDeviceApps(updatedApps);
    localStorage.setItem('deviceApps', JSON.stringify(updatedApps));
    
    // Clean up by revoking the object URL
    setTimeout(() => {
      URL.revokeObjectURL(url);
      toast.success(`Android APK v${version} downloaded successfully`);
      setIsDownloading(false);
      
      // Show the lock screen setup
      setShowLockScreen(true);
    }, 1500);
  };

  const handleSaveAppConfig = (newConfig: AppConfig) => {
    setAppConfig(newConfig);
    localStorage.setItem('appConfig', JSON.stringify(newConfig));
    
    // Save PIN or pattern if set
    if (newConfig.lockType === 'pin') {
      localStorage.setItem('appLockType', 'pin');
      localStorage.setItem('appLockPin', '123456'); // Default PIN for demo
    } else if (newConfig.lockType === 'pattern') {
      localStorage.setItem('appLockType', 'pattern');
      localStorage.setItem('appLockPattern', JSON.stringify([0,1,2,5,8])); // Default pattern for demo
    }
    
    toast.success('App settings saved successfully');
    setShowAppSettings(false);
  };
  
  const currentUser = getUserInfo();
  const isAdmin = currentUser && (currentUser.isAdmin || currentUser.role === 'admin');
  
  return (
    <Layout>
      <div className="container px-4 py-8 mx-auto">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Mintopia Mobile App</h1>
            <p className="text-muted-foreground">
              Download and manage the Mintopia mobile app for your device
            </p>
          </div>
          
          {deviceApps.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-primary" />
                  Installed Applications
                </CardTitle>
                <CardDescription>
                  Manage your installed Mintopia apps
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md divide-y">
                  {deviceApps.map((app) => (
                    <div key={app.id} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{app.appName} {app.appVersion}</h4>
                          <Badge variant="outline" className="bg-green-500/20 text-green-700">
                            Installed
                          </Badge>
                          {app.miningEnabled && (
                            <Badge variant="outline" className="bg-blue-500/20 text-blue-700">
                              Mining
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Installed: {new Date(app.installDate).toLocaleDateString()}
                          {app.miningEnabled && (
                            <>
                              <ArrowUpDown className="h-4 w-4 ml-2" />
                              Mining Rate: {app.miningRate} coins/hour
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowLockScreen(true)}
                        >
                          <Lock className="h-4 w-4 mr-2" />
                          Unlock
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowAppSettings(true)}
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Settings
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-700/20 text-green-700 h-6">
                    Android
                  </Badge>
                  <span>Android App</span>
                </CardTitle>
                <CardDescription>
                  Download the Mintopia app for Android devices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md divide-y">
                  {androidReleases.map((release) => (
                    <div key={release.version} className="p-4 flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">Version {release.version}</h4>
                          {release.isLatest && (
                            <Badge variant="outline" className="bg-blue-500/20 text-blue-700">
                              Latest
                            </Badge>
                          )}
                          {release.miningEnabled && (
                            <Badge variant="outline" className="bg-purple-500/20 text-purple-700">
                              Mining
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Released: {release.date} • {release.size}
                          {release.miningEnabled && (
                            <span className="ml-2">• Mining Rate: {release.miningRate} coins/hour</span>
                          )}
                        </div>
                      </div>
                      
                      <Button
                        variant="default"
                        onClick={() => handleDownloadApk(release.version, release.sizeInMB, release.miningEnabled, release.miningRate)}
                        disabled={isDownloading}
                      >
                        {isDownloading && release.isLatest ? (
                          <>Downloading...</>
                        ) : (
                          <>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </>
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-blue-700/20 text-blue-700 h-6">
                    iOS
                  </Badge>
                  <span>iOS App</span>
                </CardTitle>
                <CardDescription>
                  Download the Mintopia app for iOS devices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md divide-y">
                  {iosReleases.map((release) => (
                    <div key={release.version} className="p-4 flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">Version {release.version}</h4>
                          {release.isLatest && (
                            <Badge variant="outline" className="bg-blue-500/20 text-blue-700">
                              Latest
                            </Badge>
                          )}
                          {release.miningEnabled && (
                            <Badge variant="outline" className="bg-purple-500/20 text-purple-700">
                              Mining
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Released: {release.date} • {release.size}
                          {release.miningEnabled && (
                            <span className="ml-2">• Mining Rate: {release.miningRate} coins/hour</span>
                          )}
                        </div>
                      </div>
                      
                      {/* Fixed: Replaced component prop with a regular anchor wrapped in Button */}
                      <a 
                        href="https://apps.apple.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline">
                          <Tablet className="h-4 w-4 mr-2" />
                          App Store
                        </Button>
                      </a>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {isAdmin && (
            <Card className="mt-4 border-primary/20">
              <CardHeader className="bg-primary/5">
                <Badge className="w-fit mb-2">Admin Only</Badge>
                <CardTitle>Mobile App Configuration</CardTitle>
                <CardDescription>
                  Configure mining settings and app security
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Shield className="h-4 w-4 text-blue-600" />
                      Security Settings
                    </h3>
                    <div className="flex items-center justify-between space-x-2">
                      <div className="space-y-0.5">
                        <Label htmlFor="lock-enabled">App Lock</Label>
                        <p className="text-xs text-muted-foreground">
                          Require PIN or pattern to access the app
                        </p>
                      </div>
                      <Switch 
                        id="lock-enabled" 
                        checked={appConfig.lockType !== 'none'}
                        onCheckedChange={(checked) => {
                          setAppConfig({
                            ...appConfig,
                            lockType: checked ? 'pin' : 'none'
                          });
                        }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <div className="space-y-0.5">
                        <Label htmlFor="auto-lock">Auto-lock</Label>
                        <p className="text-xs text-muted-foreground">
                          Lock after inactivity
                        </p>
                      </div>
                      <Switch 
                        id="auto-lock" 
                        checked={appConfig.autoLock}
                        onCheckedChange={(checked) => {
                          setAppConfig({
                            ...appConfig,
                            autoLock: checked
                          });
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-semibold flex items-center gap-2">
                      <ArrowUpDown className="h-4 w-4 text-indigo-600" />
                      Mining Settings
                    </h3>
                    <div className="flex items-center justify-between space-x-2">
                      <div className="space-y-0.5">
                        <Label htmlFor="mining-enabled">Enable Mining</Label>
                        <p className="text-xs text-muted-foreground">
                          Allow apps to mine coins
                        </p>
                      </div>
                      <Switch 
                        id="mining-enabled" 
                        checked={appConfig.miningEnabled}
                        onCheckedChange={(checked) => {
                          setAppConfig({
                            ...appConfig,
                            miningEnabled: checked
                          });
                        }}
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="mining-rate">Mining Rate (coins/hour)</Label>
                      <Input 
                        id="mining-rate" 
                        type="number"
                        min="0.01"
                        max="1"
                        step="0.01"
                        value={appConfig.miningRate}
                        onChange={(e) => {
                          setAppConfig({
                            ...appConfig,
                            miningRate: parseFloat(e.target.value)
                          });
                        }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4 mt-4">
                  <Alert variant="default" className="bg-amber-50 text-amber-800 border-amber-200">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Admin Configuration</AlertTitle>
                    <AlertDescription>
                      These settings will apply to all new app installations. Users will need to update their app to receive these changes.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="ml-auto" 
                  onClick={() => {
                    localStorage.setItem('appConfig', JSON.stringify(appConfig));
                    toast.success('App configuration saved');
                  }}
                >
                  Save Configuration
                </Button>
              </CardFooter>
            </Card>
          )}
          
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Installation Instructions</CardTitle>
              <CardDescription>
                Follow these steps to install the Mintopia app on your device
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-lg mb-2">Android Installation</h3>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>Download the APK file by clicking the "Download" button above.</li>
                    <li>Open the downloaded file on your Android device.</li>
                    <li>If prompted, allow installation from unknown sources in your device settings.</li>
                    <li>Follow the on-screen instructions to complete the installation.</li>
                    <li>Once installed, open the Mintopia app and log in with your credentials.</li>
                  </ol>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg mb-2">iOS Installation</h3>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>Click the "App Store" button above to go to the App Store.</li>
                    <li>Tap "Get" or the download button on the App Store page.</li>
                    <li>Complete the download and installation process.</li>
                    <li>Once installed, open the Mintopia app and log in with your credentials.</li>
                  </ol>
                </div>
                
                <div className="bg-muted/50 p-4 rounded-lg mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <h4 className="font-medium">Need Help?</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    If you encounter any issues during installation or while using the app, please contact our support team at support@mintopia.io or visit the help section in your account settings.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <AppLockScreen 
        open={showLockScreen}
        onOpenChange={setShowLockScreen}
        onUnlock={() => toast.success('App unlocked successfully')}
        appName="Mintopia Wallet"
      />
      
      <Dialog open={showAppSettings} onOpenChange={setShowAppSettings}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>App Settings</DialogTitle>
            <DialogDescription>
              Configure security and mining settings
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="security" className="mt-4">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Security
              </TabsTrigger>
              <TabsTrigger value="mining" className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4" />
                Mining
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="security" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="lock-type">Lock Type</Label>
                    <select 
                      id="lock-type" 
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      value={appConfig.lockType}
                      onChange={(e) => setAppConfig({
                        ...appConfig,
                        lockType: e.target.value as 'pin' | 'pattern' | 'none'
                      })}
                    >
                      <option value="none">None</option>
                      <option value="pin">PIN Code</option>
                      <option value="pattern">Pattern</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="timeout">Auto-lock after (minutes)</Label>
                    <Input 
                      id="timeout" 
                      type="number"
                      min="1"
                      max="60"
                      value={appConfig.autoLockTimeout}
                      onChange={(e) => setAppConfig({
                        ...appConfig,
                        autoLockTimeout: parseInt(e.target.value)
                      })}
                      disabled={!appConfig.autoLock}
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="auto-lock" 
                    checked={appConfig.autoLock}
                    onCheckedChange={(checked) => setAppConfig({
                      ...appConfig,
                      autoLock: checked
                    })}
                  />
                  <Label htmlFor="auto-lock">Auto-lock when app is in background</Label>
                </div>
                
                <Separator />
                
                {appConfig.lockType === 'pin' && (
                  <div>
                    <Label htmlFor="pin-demo">Demo PIN: 123456</Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      For this demo, the PIN is fixed to 123456
                    </p>
                  </div>
                )}
                
                {appConfig.lockType === 'pattern' && (
                  <div>
                    <Label>Demo Pattern:</Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      For this demo, the pattern is fixed to the first three dots in the first row, plus the middle and bottom-right dots.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="mining" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="mining-enabled" 
                    checked={appConfig.miningEnabled}
                    onCheckedChange={(checked) => setAppConfig({
                      ...appConfig,
                      miningEnabled: checked
                    })}
                  />
                  <Label htmlFor="mining-enabled">Enable mining while app is running</Label>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="mining-rate">Mining Rate (coins/hour)</Label>
                  <Input 
                    id="mining-rate" 
                    type="number"
                    min="0.01"
                    max="1"
                    step="0.01"
                    value={appConfig.miningRate}
                    onChange={(e) => setAppConfig({
                      ...appConfig,
                      miningRate: parseFloat(e.target.value)
                    })}
                    disabled={!appConfig.miningEnabled}
                  />
                </div>
                
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Mining uses device resources and may affect battery life.
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAppSettings(false)}>
              Cancel
            </Button>
            <Button onClick={() => handleSaveAppConfig(appConfig)}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default MobileAppPage;
