
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Download, Smartphone, Tablet, Github, CheckCircle } from 'lucide-react';
import Layout from '@/components/Layout';

interface AppRelease {
  version: string;
  date: string;
  size: string;
  isLatest: boolean;
  sizeInMB: number;
}

const MobileAppPage: React.FC = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  
  const androidReleases: AppRelease[] = [
    {
      version: '1.2.5',
      date: '2025-04-06',
      size: '24.5 MB',
      isLatest: true,
      sizeInMB: 24.5
    },
    {
      version: '1.2.0',
      date: '2025-03-20',
      size: '23.8 MB',
      isLatest: false,
      sizeInMB: 23.8
    },
    {
      version: '1.1.0',
      date: '2025-02-15',
      size: '22.1 MB',
      isLatest: false,
      sizeInMB: 22.1
    }
  ];
  
  const iosReleases: AppRelease[] = [
    {
      version: '1.2.5',
      date: '2025-04-06',
      size: '30.2 MB',
      isLatest: true,
      sizeInMB: 30.2
    },
    {
      version: '1.2.0',
      date: '2025-03-20',
      size: '29.7 MB',
      isLatest: false,
      sizeInMB: 29.7
    },
    {
      version: '1.1.0',
      date: '2025-02-15',
      size: '28.3 MB',
      isLatest: false,
      sizeInMB: 28.3
    }
  ];

  const handleDownloadApk = (version: string, sizeMB: number) => {
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
    
    // Clean up by revoking the object URL
    setTimeout(() => {
      URL.revokeObjectURL(url);
      toast.success(`Android APK v${version} downloaded successfully`);
      setIsDownloading(false);
    }, 1500);
  };
  
  return (
    <Layout>
      <div className="container px-4 py-8 mx-auto">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Mintopia Mobile App</h1>
            <p className="text-muted-foreground">
              Download the Mintopia mobile app for your device
            </p>
          </div>
          
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
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Released: {release.date} • {release.size}
                        </div>
                      </div>
                      
                      <Button
                        variant="default"
                        onClick={() => handleDownloadApk(release.version, release.sizeInMB)}
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
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Released: {release.date} • {release.size}
                        </div>
                      </div>
                      
                      <Button
                        variant="outline"
                        component="a"
                        href="https://apps.apple.com"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Tablet className="h-4 w-4 mr-2" />
                        App Store
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
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
    </Layout>
  );
};

export default MobileAppPage;
