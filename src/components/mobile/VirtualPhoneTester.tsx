
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Smartphone, Check, X, RefreshCw, RotateCw, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface VirtualPhoneTesterProps {
  appType: 'iOS' | 'Android' | 'APK';
  appVersion: string;
  appName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: () => void;
}

interface TestResult {
  name: string;
  status: 'passed' | 'failed' | 'running' | 'pending';
  message?: string;
}

const VirtualPhoneTester: React.FC<VirtualPhoneTesterProps> = ({
  appType,
  appVersion,
  appName,
  open,
  onOpenChange,
  onApprove
}) => {
  const [deviceType, setDeviceType] = useState<'phone' | 'tablet'>('phone');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([
    { name: 'App Installation', status: 'pending' },
    { name: 'App Launch', status: 'pending' },
    { name: 'UI Rendering', status: 'pending' },
    { name: 'Network Connectivity', status: 'pending' },
    { name: 'Permissions', status: 'pending' },
    { name: 'Performance', status: 'pending' }
  ]);
  const [allPassed, setAllPassed] = useState(false);
  const [isReset, setIsReset] = useState(true);
  const [viewDetails, setViewDetails] = useState(false);
  const [selectedFailedTest, setSelectedFailedTest] = useState<TestResult | null>(null);
  
  const startTesting = () => {
    setIsReset(false);
    setIsRunning(true);
    setAllPassed(false);
    setViewDetails(false);
    setSelectedFailedTest(null);
    
    // Reset test results
    setTestResults(prev => prev.map(test => ({ ...test, status: 'pending', message: undefined })));
    
    // Simulate the testing process
    let currentTest = 0;
    
    const runTest = () => {
      if (currentTest >= testResults.length) {
        setIsRunning(false);
        // Check if all tests passed
        const allTestsPassed = testResults.every(test => test.status === 'passed');
        setAllPassed(allTestsPassed);
        
        if (allTestsPassed) {
          toast.success(`${appName} passed all tests on ${appType} ${deviceType}`);
        } else {
          toast.error(`${appName} failed some tests on ${appType} ${deviceType}`);
          
          // Set detailed error messages for failed tests
          setTestResults(prev => {
            return prev.map(test => {
              if (test.status === 'failed') {
                let detailedMessage = '';
                
                switch (test.name) {
                  case 'App Installation':
                    detailedMessage = `Installation failed due to ${appType === 'APK' ? 'invalid APK signature' : 'compatibility issues with the device OS'}.`;
                    break;
                  case 'App Launch':
                    detailedMessage = 'App crashed on startup. There may be initialization errors.';
                    break;
                  case 'UI Rendering':
                    detailedMessage = 'Some UI elements failed to render correctly on the target device.';
                    break;
                  case 'Network Connectivity':
                    detailedMessage = 'The app failed to establish secure network connections.';
                    break;
                  case 'Permissions':
                    detailedMessage = 'Required permissions were not granted or incorrectly implemented.';
                    break;
                  case 'Performance':
                    detailedMessage = 'App performance did not meet the required threshold for smooth operation.';
                    break;
                  default:
                    detailedMessage = 'Test failed for unknown reasons.';
                }
                
                return { ...test, message: detailedMessage };
              }
              return test;
            });
          });
        }
        return;
      }
      
      setTestResults(prev => {
        const newTests = [...prev];
        newTests[currentTest] = { 
          ...newTests[currentTest], 
          status: 'running' 
        };
        return newTests;
      });
      
      // Simulate test duration (1-2 seconds)
      const testDuration = Math.random() * 1000 + 1000;
      
      setTimeout(() => {
        // 80% chance of passing each test
        const passed = Math.random() > 0.2;
        
        // Special case: First test (App Installation) has a higher failure rate for APK
        let testPassed = passed;
        if (currentTest === 0 && appType === 'APK') {
          // 40% chance of passing for APK installation
          testPassed = Math.random() > 0.6;
        }
        
        const message = testPassed 
          ? `${testResults[currentTest].name} completed successfully` 
          : `${testResults[currentTest].name} encountered issues`;
        
        setTestResults(prev => {
          const newTests = [...prev];
          newTests[currentTest] = { 
            ...newTests[currentTest], 
            status: testPassed ? 'passed' : 'failed',
            message
          };
          return newTests;
        });
        
        currentTest++;
        runTest();
      }, testDuration);
    };
    
    runTest();
  };
  
  const resetTests = () => {
    setTestResults(prev => prev.map(test => ({ ...test, status: 'pending', message: undefined })));
    setIsRunning(false);
    setAllPassed(false);
    setIsReset(true);
    setViewDetails(false);
    setSelectedFailedTest(null);
    toast.info('Virtual device tests reset');
  };
  
  const showTestDetails = (test: TestResult) => {
    if (test.status === 'failed') {
      setSelectedFailedTest(test);
      setViewDetails(true);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isRunning) {
        onOpenChange(isOpen);
      }
    }}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Virtual Phone Test - {appName}
          </DialogTitle>
          <DialogDescription>
            Test your {appType} application on a virtual device before making it available to users
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex flex-wrap justify-between gap-2 p-3 bg-muted/40 rounded-md">
            <div>
              <div className="text-xs text-muted-foreground">App Type</div>
              <Badge variant="outline" className="mt-1">
                {appType}
              </Badge>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Version</div>
              <div className="text-sm font-medium mt-1">v{appVersion}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Device</div>
              <select 
                className="text-sm p-1 mt-1 border rounded bg-background"
                value={deviceType}
                onChange={(e) => setDeviceType(e.target.value as 'phone' | 'tablet')}
                disabled={isRunning}
              >
                <option value="phone">Phone</option>
                <option value="tablet">Tablet</option>
              </select>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Orientation</div>
              <select 
                className="text-sm p-1 mt-1 border rounded bg-background"
                value={orientation}
                onChange={(e) => setOrientation(e.target.value as 'portrait' | 'landscape')}
                disabled={isRunning}
              >
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </select>
            </div>
          </div>
          
          <Tabs defaultValue="tests">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="tests">Tests</TabsTrigger>
              <TabsTrigger value="preview">Device Preview</TabsTrigger>
              <TabsTrigger value="details" disabled={!selectedFailedTest}>Error Details</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tests" className="space-y-4">
              <div className="space-y-2 my-2">
                {testResults.map((test, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center justify-between p-2 border rounded ${test.status === 'failed' ? 'cursor-pointer hover:bg-red-50' : ''}`}
                    onClick={() => test.status === 'failed' ? showTestDetails(test) : null}
                  >
                    <div className="flex items-center gap-2">
                      {test.status === 'pending' && (
                        <div className="h-2 w-2 rounded-full bg-muted-foreground"></div>
                      )}
                      {test.status === 'running' && (
                        <RefreshCw size={16} className="animate-spin text-blue-500" />
                      )}
                      {test.status === 'passed' && (
                        <Check size={16} className="text-green-500" />
                      )}
                      {test.status === 'failed' && (
                        <X size={16} className="text-red-500" />
                      )}
                      <span className="text-sm">{test.name}</span>
                    </div>
                    <Badge 
                      variant="outline"
                      className={
                        test.status === 'pending'
                          ? 'bg-muted text-muted-foreground'
                          : test.status === 'running'
                          ? 'bg-blue-500/20 text-blue-700' 
                          : test.status === 'passed'
                          ? 'bg-green-500/20 text-green-700'
                          : 'bg-red-500/20 text-red-700'
                      }
                    >
                      {test.status}
                      {test.status === 'failed' && (
                        <span className="ml-1">- Click for details</span>
                      )}
                    </Badge>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="preview">
              <Card>
                <CardContent className="p-6">
                  <div className={`relative mx-auto border-4 border-slate-700 rounded-[24px] ${
                    orientation === 'portrait'
                      ? 'w-[220px] h-[400px]'
                      : 'w-[400px] h-[220px]'
                  }`}>
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-slate-700 rounded-b-md"></div>
                    <div className={`h-full w-full bg-muted flex items-center justify-center ${
                      isReset ? 'bg-muted' : isRunning ? 'bg-blue-50' : allPassed ? 'bg-green-50' : 'bg-red-50'
                    }`}>
                      <div className="text-center p-4">
                        {isReset ? (
                          <div className="text-sm text-muted-foreground">
                            Start testing to see app preview
                          </div>
                        ) : isRunning ? (
                          <div className="space-y-2">
                            <RefreshCw className="h-8 w-8 mx-auto animate-spin text-blue-500" />
                            <div className="text-sm text-blue-600">Testing in progress...</div>
                          </div>
                        ) : allPassed ? (
                          <div className="space-y-2">
                            <Check className="h-8 w-8 mx-auto text-green-500" />
                            <div className="text-sm text-green-600">All tests passed!</div>
                            <div className="text-xs text-muted-foreground">App ready for distribution</div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <X className="h-8 w-8 mx-auto text-red-500" />
                            <div className="text-sm text-red-600">Test failed</div>
                            <div className="text-xs text-muted-foreground">See test results for details</div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 rounded-full w-10 h-1 bg-slate-700"></div>
                  </div>
                  <div className="mt-4 flex justify-center">
                    <Button 
                      size="sm" 
                      onClick={() => setOrientation(orientation === 'portrait' ? 'landscape' : 'portrait')}
                      variant="outline"
                      disabled={isRunning}
                    >
                      <RotateCw className="h-4 w-4 mr-2" />
                      Rotate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="details">
              {selectedFailedTest && (
                <Card>
                  <CardContent className="p-4 space-y-4">
                    <div className="flex items-start gap-3 pb-3 border-b">
                      <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium">{selectedFailedTest.name} - Test Failed</h4>
                        <p className="text-sm text-muted-foreground">
                          {selectedFailedTest.message}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium mb-2">Detailed Error Information</h5>
                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-md p-3 text-sm">
                        {selectedFailedTest.name === 'App Installation' && (
                          <div className="space-y-2">
                            <p>Installation failed with error code: <span className="font-mono">INSTALL_PARSE_FAILED_NO_CERTIFICATES</span></p>
                            <p>Reason: The APK file signature is invalid or missing required certificates.</p>
                            <p>Solution: Rebuild the APK with proper signing configuration.</p>
                          </div>
                        )}
                        {selectedFailedTest.name === 'App Launch' && (
                          <div className="space-y-2">
                            <p>Launch failed with error: <span className="font-mono">FATAL EXCEPTION: main</span></p>
                            <p>Reason: Uncaught exception in application startup code.</p>
                            <p>Solution: Review initialization code and error handling.</p>
                          </div>
                        )}
                        {selectedFailedTest.name === 'UI Rendering' && (
                          <div className="space-y-2">
                            <p>UI error: <span className="font-mono">LayoutInflationException</span></p>
                            <p>Reason: Some layouts aren't compatible with the test device dimensions.</p>
                            <p>Solution: Test on various screen sizes and implement responsive layouts.</p>
                          </div>
                        )}
                        {selectedFailedTest.name === 'Network Connectivity' && (
                          <div className="space-y-2">
                            <p>Network error: <span className="font-mono">SSL_HANDSHAKE_FAILURE</span></p>
                            <p>Reason: Failed to establish secure connection with API endpoints.</p>
                            <p>Solution: Verify SSL configuration and certificate validity.</p>
                          </div>
                        )}
                        {selectedFailedTest.name === 'Permissions' && (
                          <div className="space-y-2">
                            <p>Permission error: <span className="font-mono">PERMISSION_DENIED</span></p>
                            <p>Reason: Required permissions not properly requested or denied by user.</p>
                            <p>Solution: Implement proper permission request flow with clear explanations.</p>
                          </div>
                        )}
                        {selectedFailedTest.name === 'Performance' && (
                          <div className="space-y-2">
                            <p>Performance issue: <span className="font-mono">ANR (Application Not Responding)</span></p>
                            <p>Reason: UI thread blocked for over 5 seconds during heavy operations.</p>
                            <p>Solution: Move intensive operations to background threads.</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => {
                        setViewDetails(false);
                        setSelectedFailedTest(null);
                      }}
                    >
                      Back to Test Results
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between gap-2">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isRunning}
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={resetTests}
              disabled={isRunning || isReset}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset Tests
            </Button>
          </div>
          
          <div className="flex gap-2">
            {!isRunning && allPassed && (
              <Button
                variant="default"
                onClick={() => {
                  onApprove();
                  onOpenChange(false);
                  toast.success(`${appName} approved for distribution on ${appType}!`);
                }}
              >
                <Check className="h-4 w-4 mr-2" />
                Approve for Distribution
              </Button>
            )}
            
            {(!isRunning || isReset) && (
              <Button
                variant={isReset ? "default" : "outline"}
                onClick={startTesting}
                disabled={isRunning}
              >
                Start Testing
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VirtualPhoneTester;
