
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Smartphone, Tablet, AlertCircle, Check, X, Shield, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import AppLockScreen from './AppLockScreen';

interface VirtualPhoneTesterProps {
  appType: 'iOS' | 'Android' | 'APK';
  appVersion: string;
  appName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: () => void;
}

const VirtualPhoneTester: React.FC<VirtualPhoneTesterProps> = ({
  appType,
  appVersion,
  appName,
  open,
  onOpenChange,
  onApprove,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [installStep, setInstallStep] = useState(1);
  const [showLockScreen, setShowLockScreen] = useState(false);
  
  // Check localStorage for device apps that might be installed
  const [installedApps, setInstalledApps] = useState<any[]>([]);
  
  useEffect(() => {
    // Reset state when dialog opens
    if (open) {
      setIsLoading(true);
      setIsSuccess(false);
      setErrorDetails(null);
      setInstallStep(1);
      
      // Check for installed apps
      const deviceApps = JSON.parse(localStorage.getItem('deviceApps') || '[]');
      setInstalledApps(deviceApps);
      
      // Simulate device check
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    }
  }, [open]);
  
  const handleInstall = () => {
    setIsInstalling(true);
    setInstallStep(1);
    
    // Simulating installation process steps
    const simulateStep = (step: number, delay: number, callback: () => void) => {
      setTimeout(() => {
        setInstallStep(step);
        callback();
      }, delay);
    };
    
    // Step 1: Validating package (already set)
    simulateStep(2, 1000, () => {
      // Step 2: Unpacking APK
      simulateStep(3, 1500, () => {
        // Step 3: Verifying app permissions
        simulateStep(4, 1000, () => {
          // Step 4: Installing
          simulateStep(5, 2000, () => {
            // Check for random installation errors (20% chance)
            if (Math.random() < 0.2) {
              setIsSuccess(false);
              setErrorDetails(getRandomError());
              setIsInstalling(false);
            } else {
              // Installation successful
              setIsSuccess(true);
              setIsInstalling(false);
              
              // Add to installed apps
              const newApp = {
                id: `app-${Date.now()}`,
                appType,
                appName,
                appVersion,
                installed: true,
                installDate: new Date().toISOString(),
                miningEnabled: Math.random() > 0.3, // 70% chance mining is enabled
                miningRate: (Math.random() * 0.09 + 0.01).toFixed(2)
              };
              
              const updatedApps = [...installedApps, newApp];
              setInstalledApps(updatedApps);
              localStorage.setItem('deviceApps', JSON.stringify(updatedApps));
            }
          });
        });
      });
    });
  };
  
  const getRandomError = () => {
    const errors = [
      "Installation failed: INSTALL_FAILED_INSUFFICIENT_STORAGE",
      "Package file is invalid",
      "App not compatible with device",
      "Installation blocked by security settings",
      "Signature verification failed"
    ];
    return errors[Math.floor(Math.random() * errors.length)];
  };
  
  const getStepText = (step: number) => {
    switch(step) {
      case 1: return "Validating package";
      case 2: return "Unpacking APK";
      case 3: return "Verifying app permissions";
      case 4: return "Installing app";
      case 5: return "Finalizing installation";
      default: return "Processing";
    }
  };
  
  const handleApprove = () => {
    onApprove();
    onOpenChange(false);
  };
  
  const handleLaunchApp = () => {
    setShowLockScreen(true);
  };
  
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Virtual Device Tester</DialogTitle>
            <DialogDescription>
              Test {appName} v{appVersion} on a virtual {appType} device
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <Tabs defaultValue="device">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="device" className="flex gap-2 items-center">
                  {appType === 'iOS' ? <Tablet className="h-4 w-4" /> : <Smartphone className="h-4 w-4" />}
                  Virtual Device
                </TabsTrigger>
                <TabsTrigger value="logs" className="flex gap-2 items-center">
                  <Shield className="h-4 w-4" />
                  Installation Logs
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="device" className="space-y-4 pt-4">
                <div className="relative pb-[177.78%] bg-gray-900 rounded-lg border-4 border-gray-800 overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full flex flex-col">
                    <div className="h-6 bg-black flex items-center justify-center">
                      <div className="w-16 h-1 bg-gray-600 rounded-full"></div>
                    </div>
                    
                    {isLoading ? (
                      <div className="flex-1 bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center">
                        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-2"></div>
                        <p className="text-sm text-muted-foreground">Connecting to virtual device...</p>
                      </div>
                    ) : isInstalling ? (
                      <div className="flex-1 bg-gray-100 dark:bg-gray-900 p-4 flex flex-col items-center justify-center">
                        <div className="w-full max-w-xs">
                          <h2 className="text-lg font-medium mb-2">Installing {appName}</h2>
                          <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary transition-all duration-500 rounded-full" 
                              style={{ width: `${installStep * 20}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">{getStepText(installStep)}</p>
                        </div>
                      </div>
                    ) : isSuccess ? (
                      <div className="flex-1 bg-gray-100 dark:bg-gray-900 p-4 flex flex-col items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-3">
                          <Check className="h-8 w-8 text-green-600" />
                        </div>
                        <h2 className="text-lg font-medium text-center">Installation Complete</h2>
                        <p className="text-sm text-muted-foreground text-center mt-1 mb-4">
                          {appName} v{appVersion} has been successfully installed.
                        </p>
                        <Button onClick={handleLaunchApp}>Launch App</Button>
                      </div>
                    ) : errorDetails ? (
                      <div className="flex-1 bg-gray-100 dark:bg-gray-900 p-4 flex flex-col items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-3">
                          <X className="h-8 w-8 text-red-600" />
                        </div>
                        <h2 className="text-lg font-medium text-center">Installation Failed</h2>
                        <p className="text-sm text-red-500 text-center mt-1 mb-2">
                          {errorDetails}
                        </p>
                        <Alert variant="destructive" className="mt-2 mb-4 text-xs">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            The app failed security verification or may be incompatible with this device.
                          </AlertDescription>
                        </Alert>
                        <Button onClick={handleInstall} variant="outline">Retry Installation</Button>
                      </div>
                    ) : (
                      <div className="flex-1 bg-gray-100 dark:bg-gray-900 p-4 flex flex-col items-center justify-center">
                        <div className="w-full max-w-xs space-y-4">
                          <div className="space-y-2">
                            <h2 className="text-lg font-medium">Device Ready</h2>
                            <p className="text-sm text-muted-foreground">
                              Virtual {appType} device is ready for app testing.
                            </p>
                          </div>
                          
                          <div className="space-y-1">
                            <h3 className="text-sm font-medium">Device Info:</h3>
                            <p className="text-xs text-muted-foreground">
                              {appType === 'iOS' ? 'iOS 16.5.1' : 'Android 13.0'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              RAM: 4GB • Storage: 32GB (18GB free)
                            </p>
                          </div>
                          
                          <div className="space-y-1">
                            <h3 className="text-sm font-medium">Install Package:</h3>
                            <p className="text-xs">
                              {appName} v{appVersion} ({appType})
                            </p>
                          </div>
                          
                          {installedApps.length > 0 && (
                            <div className="space-y-1">
                              <h3 className="text-sm font-medium">Installed Apps:</h3>
                              <ul className="text-xs space-y-1">
                                {installedApps.map((app) => (
                                  <li key={app.id} className="flex items-center">
                                    <span className="text-green-600 mr-1">•</span>
                                    {app.appName} v{app.appVersion}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          <Button
                            className="w-full"
                            onClick={handleInstall}
                          >
                            Install App
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    <div className="h-10 bg-black flex items-center justify-center">
                      <div className="w-12 h-5 border-2 border-gray-600 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="logs" className="space-y-4 pt-4">
                <div className="rounded-md bg-black text-green-400 font-mono p-4 text-xs h-[300px] overflow-y-auto">
                  <div>$ adb install -r {appName.toLowerCase().replace(/\s+/g, '_')}-{appVersion}.apk</div>
                  {isLoading ? (
                    <div className="flex items-center mt-2">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Connecting to device...
                    </div>
                  ) : (
                    <>
                      <div className="mt-2">Found device: Virtual {appType} Device</div>
                      <div className="mt-2">Device ID: {appType === 'iOS' 
                        ? '00008110-00165D963634801E' 
                        : 'emulator-5554'}</div>
                      {installStep >= 1 && <div className="mt-1">Performing Streamed Install</div>}
                      {installStep >= 2 && <div className="mt-1">Verifying APK signature...</div>}
                      {installStep >= 3 && <div className="mt-1">Extracting native libraries...</div>}
                      {installStep >= 4 && <div className="mt-1">Installing {appName} {appVersion}...</div>}
                      {isSuccess && (
                        <>
                          <div className="mt-1">App installed successfully</div>
                          <div className="mt-1">Package: io.mintopia.wallet</div>
                          <div className="mt-1">Storage: 24.2MB used</div>
                          <div className="mt-1">Success</div>
                        </>
                      )}
                      {errorDetails && (
                        <>
                          <div className="mt-1 text-red-500">Error: {errorDetails}</div>
                          <div className="mt-1 text-red-500">Installation aborted</div>
                        </>
                      )}
                    </>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <DialogFooter className="gap-2 sm:space-x-0">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            
            <Button
              disabled={!isSuccess}
              onClick={handleApprove}
            >
              {isSuccess ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Approve App
                </>
              ) : (
                'Waiting for install'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <AppLockScreen
        open={showLockScreen}
        onOpenChange={setShowLockScreen}
        onUnlock={() => {
          toast.success(`${appName} unlocked successfully`);
          setTimeout(() => {
            handleApprove();
          }, 500);
        }}
        appName={appName}
      />
    </>
  );
};

export default VirtualPhoneTester;
