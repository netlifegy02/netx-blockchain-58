
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Lock,
  Smartphone,
  Shield,
  Database,
  AlertTriangle,
  Clock,
  Server,
  Share2
} from 'lucide-react';

const AdminSecurity: React.FC = () => {
  const [whatsappConfig, setWhatsappConfig] = useState({
    enabled: true,
    apiKey: 'wh_abc123def456',
    verificationTimeoutMinutes: 5,
    maxAttempts: 3,
    templateId: 'verification_template_001',
    webhookUrl: 'https://api.example.com/webhooks/whatsapp'
  });

  const [fail2banConfig, setFail2banConfig] = useState({
    enabled: true,
    maxRetry: 5,
    findTime: 600,
    banTime: 3600,
    ignoreIps: '127.0.0.1,192.168.1.1',
    logPath: '/var/log/auth.log'
  });
  
  const saveWhatsappConfig = () => {
    // Save WhatsApp config to localStorage for demo purposes
    localStorage.setItem('whatsappVerificationEnabled', whatsappConfig.enabled.toString());
    toast.success('WhatsApp verification settings saved');
  };
  
  const saveFail2banConfig = () => {
    toast.success('Fail2Ban settings saved');
  };
  
  const testWhatsappConnection = () => {
    toast.info('Testing WhatsApp connection...');
    setTimeout(() => {
      toast.success('WhatsApp connection test successful');
    }, 1500);
  };
  
  // Load WhatsApp enabled state from localStorage on component mount
  React.useEffect(() => {
    const savedEnabledState = localStorage.getItem('whatsappVerificationEnabled');
    if (savedEnabledState !== null) {
      setWhatsappConfig(prev => ({
        ...prev,
        enabled: savedEnabledState === 'true'
      }));
    }
  }, []);
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="whatsapp">
        <TabsList className="mb-4">
          <TabsTrigger value="whatsapp">
            <Smartphone className="h-4 w-4 mr-2" />
            WhatsApp Verification
          </TabsTrigger>
          <TabsTrigger value="fail2ban">
            <Shield className="h-4 w-4 mr-2" />
            Fail2Ban Protection
          </TabsTrigger>
          <TabsTrigger value="firewall">
            <Lock className="h-4 w-4 mr-2" />
            Firewall Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="whatsapp">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-primary" />
                WhatsApp Verification Configuration
              </CardTitle>
              <CardDescription>
                Configure WhatsApp verification for user authentication
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable WhatsApp Verification</Label>
                    <p className="text-sm text-muted-foreground">
                      Turn on WhatsApp verification for all new user registrations
                    </p>
                  </div>
                  <Switch 
                    checked={whatsappConfig.enabled} 
                    onCheckedChange={(checked) => 
                      setWhatsappConfig({...whatsappConfig, enabled: checked})
                    }
                  />
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="whatsappApiKey">WhatsApp API Key</Label>
                    <Input 
                      id="whatsappApiKey" 
                      value={whatsappConfig.apiKey}
                      onChange={(e) => 
                        setWhatsappConfig({...whatsappConfig, apiKey: e.target.value})
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Your WhatsApp Business API key
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="templateId">Message Template ID</Label>
                    <Input 
                      id="templateId" 
                      value={whatsappConfig.templateId}
                      onChange={(e) => 
                        setWhatsappConfig({...whatsappConfig, templateId: e.target.value})
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Pre-approved template ID for verification messages
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timeout">Verification Timeout (minutes)</Label>
                    <Input 
                      id="timeout" 
                      type="number"
                      value={whatsappConfig.verificationTimeoutMinutes}
                      onChange={(e) => 
                        setWhatsappConfig({
                          ...whatsappConfig, 
                          verificationTimeoutMinutes: Number(e.target.value)
                        })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      How long users have to complete verification
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxAttempts">Max Verification Attempts</Label>
                    <Input 
                      id="maxAttempts" 
                      type="number"
                      value={whatsappConfig.maxAttempts}
                      onChange={(e) => 
                        setWhatsappConfig({
                          ...whatsappConfig, 
                          maxAttempts: Number(e.target.value)
                        })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Maximum number of attempts before timeout
                    </p>
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="webhookUrl">Webhook URL</Label>
                    <Input 
                      id="webhookUrl" 
                      value={whatsappConfig.webhookUrl}
                      onChange={(e) => 
                        setWhatsappConfig({...whatsappConfig, webhookUrl: e.target.value})
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      URL where WhatsApp will send verification statuses
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 pt-4">
                  <Button onClick={saveWhatsappConfig}>
                    Save WhatsApp Configuration
                  </Button>
                  <Button variant="outline" onClick={testWhatsappConnection}>
                    Test Connection
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="fail2ban">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Fail2Ban Protection
              </CardTitle>
              <CardDescription>
                Configure Fail2Ban settings to protect against brute force attacks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Fail2Ban Protection</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically block suspicious IP addresses
                    </p>
                  </div>
                  <Switch 
                    checked={fail2banConfig.enabled} 
                    onCheckedChange={(checked) => 
                      setFail2banConfig({...fail2banConfig, enabled: checked})
                    }
                  />
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="maxRetry">Max Retry</Label>
                    <Input 
                      id="maxRetry" 
                      type="number"
                      value={fail2banConfig.maxRetry}
                      onChange={(e) => 
                        setFail2banConfig({
                          ...fail2banConfig, 
                          maxRetry: Number(e.target.value)
                        })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Number of failures before banning
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="findTime">Find Time (seconds)</Label>
                    <Input 
                      id="findTime" 
                      type="number"
                      value={fail2banConfig.findTime}
                      onChange={(e) => 
                        setFail2banConfig({
                          ...fail2banConfig, 
                          findTime: Number(e.target.value)
                        })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Time window to count failures
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="banTime">Ban Time (seconds)</Label>
                    <Input 
                      id="banTime" 
                      type="number"
                      value={fail2banConfig.banTime}
                      onChange={(e) => 
                        setFail2banConfig({
                          ...fail2banConfig, 
                          banTime: Number(e.target.value)
                        })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      How long to ban IPs
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="logPath">Log File Path</Label>
                    <Input 
                      id="logPath" 
                      value={fail2banConfig.logPath}
                      onChange={(e) => 
                        setFail2banConfig({
                          ...fail2banConfig, 
                          logPath: e.target.value
                        })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Path to the log file to monitor
                    </p>
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="ignoreIps">Ignored IPs (comma-separated)</Label>
                    <Input 
                      id="ignoreIps" 
                      value={fail2banConfig.ignoreIps}
                      onChange={(e) => 
                        setFail2banConfig({
                          ...fail2banConfig, 
                          ignoreIps: e.target.value
                        })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      IPs that should never be banned
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 pt-4">
                  <Button onClick={saveFail2banConfig}>
                    Save Fail2Ban Configuration
                  </Button>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md border border-yellow-200 dark:border-yellow-900/50">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mr-2 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-400">Important Note</h4>
                      <p className="text-sm text-yellow-700 dark:text-yellow-500 mt-1">
                        Fail2Ban requires server access to implement. These settings will be applied when deploying to a server environment.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="firewall">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                Firewall Configuration
              </CardTitle>
              <CardDescription>
                Configure firewall settings to secure the blockchain network
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md border border-green-200 dark:border-green-900/50">
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Firewall is currently active and protecting your network.
                  </p>
                </div>
                
                <h3 className="text-lg font-medium mt-6">Open Ports</h3>
                <div className="grid grid-cols-3 gap-2">
                  <Badge variant="outline" className="justify-center py-2">22 (SSH)</Badge>
                  <Badge variant="outline" className="justify-center py-2">80 (HTTP)</Badge>
                  <Badge variant="outline" className="justify-center py-2">443 (HTTPS)</Badge>
                  <Badge variant="outline" className="justify-center py-2">8545 (Blockchain RPC)</Badge>
                  <Badge variant="outline" className="justify-center py-2">8546 (Blockchain WS)</Badge>
                  <Badge variant="outline" className="justify-center py-2">30303 (P2P)</Badge>
                </div>
                
                <Button className="mt-4">
                  Manage Firewall Rules
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSecurity;
