
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Smartphone,
  QrCode,
  Download,
  ArrowUpDown,
  RefreshCw,
  Edit,
  Play,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock
} from 'lucide-react';

interface AppData {
  id: string;
  name: string;
  version: string;
  platform: 'iOS' | 'Android' | 'Both';
  status: 'published' | 'pending' | 'rejected' | 'testing';
  lastUpdated: string;
  size: string;
  downloads: number;
  rating: number;
}

interface AdminMobileAppProps {
  onTestApp?: (appType: 'iOS' | 'Android' | 'APK', appVersion: string, appName: string) => void;
}

const AdminMobileApp: React.FC<AdminMobileAppProps> = ({ onTestApp }) => {
  const [apps, setApps] = useState<AppData[]>([
    {
      id: 'app-001',
      name: 'Mintopia Wallet',
      version: '1.2.0',
      platform: 'Both',
      status: 'published',
      lastUpdated: '2025-04-06',
      size: '35.2 MB',
      downloads: 2456,
      rating: 4.8
    },
    {
      id: 'app-002',
      name: 'Mintopia Miner',
      version: '1.1.5',
      platform: 'Android',
      status: 'published',
      lastUpdated: '2025-04-01',
      size: '28.7 MB',
      downloads: 1823,
      rating: 4.5
    },
    {
      id: 'app-003',
      name: 'Mintopia Exchange',
      version: '1.0.2',
      platform: 'iOS',
      status: 'pending',
      lastUpdated: '2025-04-07',
      size: '42.1 MB',
      downloads: 0,
      rating: 0
    },
    {
      id: 'app-004',
      name: 'Mintopia Node',
      version: '1.3.0',
      platform: 'Android',
      status: 'testing',
      lastUpdated: '2025-04-08',
      size: '31.5 MB',
      downloads: 0,
      rating: 0
    }
  ]);
  
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'android' | 'ios'>('android');
  const [apkVersion, setApkVersion] = useState('1.2.1');
  
  const handlePublishApp = (appId: string) => {
    setApps(apps.map(app => 
      app.id === appId ? { ...app, status: 'published' } : app
    ));
    toast.success(`App ${appId} published successfully`);
  };
  
  const handleRejectApp = (appId: string) => {
    setApps(apps.map(app => 
      app.id === appId ? { ...app, status: 'rejected' } : app
    ));
    toast.error(`App ${appId} rejected`);
  };
  
  const handleTestApp = (appId: string) => {
    const app = apps.find(a => a.id === appId);
    if (!app) return;
    
    if (onTestApp) {
      if (app.platform === 'Both') {
        // Let's assume we're testing Android version first
        onTestApp('Android', app.version, app.name);
      } else {
        onTestApp(app.platform, app.version, app.name);
      }
    } else {
      toast.info(`Testing ${app.name} v${app.version} on virtual device`);
    }
  };
  
  const handleUploadNewVersion = () => {
    setIsUploading(true);
    toast.info('Uploading new app version...');
    
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      
      const newApp: AppData = {
        id: `app-00${apps.length + 1}`,
        name: 'Mintopia Mobile',
        version: '1.0.0',
        platform: 'Both',
        status: 'pending',
        lastUpdated: new Date().toISOString().split('T')[0],
        size: '30.5 MB',
        downloads: 0,
        rating: 0
      };
      
      setApps([newApp, ...apps]);
      toast.success('New app version uploaded successfully and pending review');
    }, 2000);
  };
  
  const handleGenerateQRCode = (appId: string) => {
    toast.success(`QR code generated for app ${appId}`);
  };
  
  const handleDownloadAnalytics = () => {
    toast.success('Analytics report downloaded');
  };

  const handleTestAPK = () => {
    if (onTestApp) {
      onTestApp('APK', apkVersion, 'Mintopia Wallet APK');
    } else {
      toast.info(`Testing Mintopia Wallet APK v${apkVersion} on virtual device`);
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-primary" />
            Mobile App Management
          </CardTitle>
          <CardDescription>
            Manage and monitor your mobile applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-lg font-medium">App Dashboard</h3>
                <p className="text-sm text-muted-foreground">
                  Track and manage your mobile applications
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleDownloadAnalytics}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Analytics
                </Button>
                <Button
                  onClick={handleUploadNewVersion}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <ArrowUpDown className="h-4 w-4 mr-2" />
                      Upload New Version
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            <div className="rounded-md border">
              <div className="grid grid-cols-9 gap-2 p-4 border-b font-medium">
                <div className="col-span-2">App Name</div>
                <div>Version</div>
                <div>Platform</div>
                <div>Status</div>
                <div>Size</div>
                <div>Downloads</div>
                <div>Rating</div>
                <div className="text-right">Actions</div>
              </div>
              
              {apps.map(app => (
                <div key={app.id} className="grid grid-cols-9 gap-2 p-4 border-b last:border-0">
                  <div className="col-span-2 font-medium">{app.name}</div>
                  <div>{app.version}</div>
                  <div>
                    <Badge variant="outline">
                      {app.platform}
                    </Badge>
                  </div>
                  <div>
                    <Badge
                      variant="outline"
                      className={
                        app.status === 'published'
                          ? 'bg-green-500/20 text-green-700'
                          : app.status === 'pending'
                          ? 'bg-yellow-500/20 text-yellow-700'
                          : app.status === 'testing'
                          ? 'bg-blue-500/20 text-blue-700'
                          : 'bg-red-500/20 text-red-700'
                      }
                    >
                      {app.status}
                    </Badge>
                  </div>
                  <div>{app.size}</div>
                  <div>{app.downloads.toLocaleString()}</div>
                  <div className="flex items-center">
                    {app.rating > 0 ? (
                      <>
                        {app.rating}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-4 h-4 ml-1 text-yellow-500"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </>
                    ) : (
                      "N/A"
                    )}
                  </div>
                  <div className="flex justify-end gap-1">
                    {app.status === 'pending' && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleTestApp(app.id)}
                          title="Test"
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handlePublishApp(app.id)}
                          title="Publish"
                          className="text-green-500 hover:text-green-700"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRejectApp(app.id)}
                          title="Reject"
                          className="text-red-500 hover:text-red-700"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    {app.status === 'testing' && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleTestApp(app.id)}
                          title="Test"
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    {app.status === 'published' && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleGenerateQRCode(app.id)}
                          title="Generate QR Code"
                        >
                          <QrCode className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toast.info(`Editing ${app.name}`)}
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toast.info(`Options for ${app.name}`)}
                      title="More Options"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Virtual Phone Testing</h3>
              <p className="text-sm text-muted-foreground">
                Test your applications on virtual devices before publishing to users
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <Card className="border shadow-none">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">Test Latest Apps</CardTitle>
                      <Badge>New</Badge>
                    </div>
                    <CardDescription>
                      Test pending applications before publishing
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-muted p-4 rounded-md">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-semibold">Next App for Testing</div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {apps.find(app => app.status === 'pending')?.name || 'No pending apps'}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm">Pending Review</span>
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full" 
                        disabled={!apps.some(app => app.status === 'pending')}
                        onClick={() => {
                          const pendingApp = apps.find(app => app.status === 'pending');
                          if (pendingApp) {
                            handleTestApp(pendingApp.id);
                          }
                        }}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start Virtual Testing
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border shadow-none">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">APK Testing</CardTitle>
                      <Badge variant="outline" className="bg-blue-500/20 text-blue-700">Advanced</Badge>
                    </div>
                    <CardDescription>
                      Test direct APK installations without app stores
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between bg-muted p-4 rounded-md">
                        <div>
                          <div className="font-semibold">Mintopia Wallet APK</div>
                          <div className="text-sm text-muted-foreground mt-1">Version {apkVersion}</div>
                        </div>
                        <Badge variant="outline" className="bg-orange-500/20 text-orange-700">APK</Badge>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => toast.success('APK downloaded for testing')}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download APK
                        </Button>
                        <Button 
                          className="flex-1"
                          onClick={handleTestAPK}
                        >
                          <Smartphone className="h-4 w-4 mr-2" />
                          Test on Virtual Phone
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Mobile App Distribution</h3>
              
              <Tabs defaultValue="android" onValueChange={(value) => setActiveTab(value as 'android' | 'ios')}>
                <TabsList>
                  <TabsTrigger value="android">Android</TabsTrigger>
                  <TabsTrigger value="ios">iOS</TabsTrigger>
                </TabsList>
                <TabsContent value="android" className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border">
                      <CardContent className="p-6">
                        <div className="flex justify-between">
                          <div className="font-semibold">Google Play</div>
                          <Badge className="bg-green-500/20 text-green-700">Active</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Manage your Google Play store listing
                        </div>
                        <Button className="mt-4 w-full" onClick={() => toast.success('Opening Google Play Console')}>
                          Open Console
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card className="border">
                      <CardContent className="p-6">
                        <div className="flex justify-between">
                          <div className="font-semibold">APK Direct</div>
                          <Badge variant="outline">Manual</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Distribute APK files directly
                        </div>
                        <Button variant="outline" className="mt-4 w-full" onClick={() => handleTestAPK()}>
                          Test APK Install
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card className="border">
                      <CardContent className="p-6">
                        <div className="flex justify-between">
                          <div className="font-semibold">3rd Party Stores</div>
                          <Badge variant="outline">Optional</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Amazon, Samsung, Huawei stores
                        </div>
                        <Button variant="outline" className="mt-4 w-full" onClick={() => toast.info('Manage 3rd party store listings')}>
                          Manage Listings
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                <TabsContent value="ios" className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border">
                      <CardContent className="p-6">
                        <div className="flex justify-between">
                          <div className="font-semibold">App Store</div>
                          <Badge className="bg-green-500/20 text-green-700">Active</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Manage your App Store listing
                        </div>
                        <Button className="mt-4 w-full" onClick={() => toast.success('Opening App Store Connect')}>
                          Open App Store Connect
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card className="border">
                      <CardContent className="p-6">
                        <div className="flex justify-between">
                          <div className="font-semibold">TestFlight</div>
                          <Badge variant="outline">Beta Testing</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Distribute beta versions to testers
                        </div>
                        <Button variant="outline" className="mt-4 w-full" onClick={() => toast.info('Manage TestFlight')}>
                          Manage Testers
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card className="border">
                      <CardContent className="p-6">
                        <div className="flex justify-between">
                          <div className="font-semibold">Enterprise</div>
                          <Badge variant="outline">In-House</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Distribute within organization
                        </div>
                        <Button variant="outline" className="mt-4 w-full" onClick={() => toast.info('Manage enterprise distribution')}>
                          Manage Distribution
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMobileApp;
