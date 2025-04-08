
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Smartphone, Check, X, RefreshCw, RotateCw } from 'lucide-react';
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
  
  const startTesting = () => {
    setIsReset(false);
    setIsRunning(true);
    setAllPassed(false);
    
    // Reset test results
    setTestResults(prev => prev.map(test => ({ ...test, status: 'pending' })));
    
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
    toast.info('Virtual device tests reset');
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
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="tests">Tests</TabsTrigger>
              <TabsTrigger value="preview">Device Preview</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tests" className="space-y-4">
              <div className="space-y-2 my-2">
                {testResults.map((test, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
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
