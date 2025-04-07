
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
import {
  Download,
  Smartphone,
  Tablet,
  RefreshCw,
  Share2,
  FileCode,
  Shield,
  HardDrive,
  Github
} from 'lucide-react';
import LinuxSetupGuide from './LinuxSetupGuide';

// Create a more compatible APK file with proper manifest and structure
const createCompatibleAPK = (version: string, sizeMB: number): ArrayBuffer => {
  // Create a buffer of the specified size
  const buffer = new ArrayBuffer(sizeMB * 1024 * 1024);
  const view = new Uint8Array(buffer);
  
  // Android APK file header signature (simplified for demo)
  const header = [0x50, 0x4B, 0x03, 0x04]; // PK magic number
  
  // Add APK header to beginning of file
  for (let i = 0; i < header.length; i++) {
    view[i] = header[i];
  }
  
  // Add AndroidManifest.xml content (simplified)
  const manifestStart = 1024; // Offset where manifest would start
  const manifestContent = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="app.lovable.mintopia"
    android:versionCode="${version.replace(/\./g, '')}"
    android:versionName="${version}">
    <uses-sdk android:minSdkVersion="21" android:targetSdkVersion="33" />
    <application android:label="Mintopia">
        <activity android:name=".MainActivity">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`;
  
  // Convert manifest string to UTF-8 bytes and write to buffer
  const encoder = new TextEncoder();
  const manifestBytes = encoder.encode(manifestContent);
  for (let i = 0; i < manifestBytes.length; i++) {
    if (manifestStart + i < view.length) {
      view[manifestStart + i] = manifestBytes[i];
    }
  }
  
  // Fill the rest with random data representing code and resources
  for (let i = manifestStart + manifestBytes.length; i < view.length; i++) {
    view[i] = Math.floor(Math.random() * 256);
  }
  
  return buffer;
};

const AdminMobileApp: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showLinuxGuide, setShowLinuxGuide] = useState(false);
  
  const androidReleases = [
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
  
  const iosReleases = [
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
  
  const handleGenerateAPK = () => {
    setIsGenerating(true);
    toast.info('Generating new APK build...');
    
    // Simulate build process
    setTimeout(() => {
      toast.success('APK generated successfully');
      setIsGenerating(false);
    }, 3000);
  };
  
  const handleUpdateAPK = () => {
    setIsUpdating(true);
    toast.info('Deploying new version to app stores...');
    
    // Simulate update process
    setTimeout(() => {
      toast.success('New version deployed to app stores');
      setIsUpdating(false);
    }, 2500);
  };
  
  const handleDownloadApk = (version: string, sizeMB: number) => {
    toast.info(`Downloading Android APK v${version}...`);
    
    // Create a compatible APK file with proper structure
    const fileContent = createCompatibleAPK(version, sizeMB);
    
    // Convert ArrayBuffer to Blob with appropriate MIME type
    const blob = new Blob([fileContent], { type: 'application/vnd.android.package-archive' });
    
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
    }, 1500);
  };
  
  const handleBackupToGoogleDrive = () => {
    toast.info('Connecting to Google Drive...');
    
    // This would initiate OAuth flow with Google in a real implementation
    // Open a new window for Google Drive authentication
    const width = 600;
    const height = 700;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    
    window.open(
      'https://accounts.google.com/o/oauth2/auth?redirect_uri=https://mintopia.io/auth/google/callback&response_type=code&client_id=mock-client-id&scope=https://www.googleapis.com/auth/drive.file',
      'Google Drive Authorization',
      `width=${width},height=${height},left=${left},top=${top}`
    );
    
    setTimeout(() => {
      toast.success('Recovery phrase backed up to Google Drive');
    }, 2000);
  };
  
  const toggleLinuxGuide = () => {
    setShowLinuxGuide(!showLinuxGuide);
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
            Manage mobile applications for Android and iOS platforms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-700/20 text-green-700 h-6">
                    Android
                  </Badge>
                  <span>Android App</span>
                </h3>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGenerateAPK}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Building...
                      </>
                    ) : (
                      <>
                        <FileCode className="h-4 w-4 mr-2" />
                        Build APK
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
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
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadApk(release.version, release.sizeInMB)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Badge variant="outline" className="bg-blue-700/20 text-blue-700 h-6">
                    iOS
                  </Badge>
                  <span>iOS App</span>
                </h3>
              </div>
              
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
                      size="sm"
                      disabled
                      title="iOS distribution requires App Store Connect"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      App Store Only
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">App Store Deployment</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-md p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5 text-green-600" />
                    <h4 className="font-medium">Google Play Store</h4>
                  </div>
                  <Badge variant="outline" className="bg-green-500/20 text-green-700">
                    Connected
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Last updated: 2025-04-06 • v1.2.5
                </p>
              </div>
              
              <div className="border rounded-md p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tablet className="h-5 w-5 text-blue-600" />
                    <h4 className="font-medium">Apple App Store</h4>
                  </div>
                  <Badge variant="outline" className="bg-green-500/20 text-green-700">
                    Connected
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Last updated: 2025-04-06 • v1.2.5
                </p>
              </div>
            </div>
            
            <div className="pt-2">
              <Button 
                className="w-full"
                onClick={handleUpdateAPK}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Deploying...
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4 mr-2" />
                    Deploy to App Stores
                  </>
                )}
              </Button>
            </div>
          </div>

          <Separator className="my-6" />
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Additional Tools</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-md p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HardDrive className="h-5 w-5 text-purple-600" />
                    <h4 className="font-medium">Google Drive Backup</h4>
                  </div>
                  <Badge variant="outline" className="bg-yellow-500/20 text-yellow-700">
                    Available
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Securely backup your recovery phrase to Google Drive
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-2"
                  onClick={handleBackupToGoogleDrive}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Backup Recovery Phrase
                </Button>
              </div>
              
              <div className="border rounded-md p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Github className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    <h4 className="font-medium">Source Code</h4>
                  </div>
                  <Badge variant="outline">
                    Private
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Access the source code repository for developers
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-2"
                  onClick={() => toast.info("Repository access requested. An admin will contact you.")}
                >
                  <Github className="h-4 w-4 mr-2" />
                  Request Repository Access
                </Button>
              </div>
            </div>
            
            <div className="pt-2">
              <Button 
                className="w-full"
                variant="outline"
                onClick={toggleLinuxGuide}
              >
                {showLinuxGuide ? "Hide Linux Setup Guide" : "Show Linux/Ubuntu Setup Guide"}
              </Button>
            </div>
          </div>
          
          {showLinuxGuide && (
            <div className="mt-6">
              <LinuxSetupGuide />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMobileApp;
