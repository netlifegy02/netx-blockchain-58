
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { Download, Server, Terminal, Settings, Shield, Code } from 'lucide-react';

interface NodeConfigProps {
  userId?: string;
  userRole?: string;
}

const NodeConfiguration: React.FC<NodeConfigProps> = ({ userId, userRole = 'user' }) => {
  const [activeTab, setActiveTab] = useState('windows');
  
  const handleDownloadConfig = (platform: string) => {
    // In a real app, this would generate a custom config file for the user
    // For demo, we'll just show a toast
    toast.success(`Configuration for ${platform} downloaded`);
    
    // Simulate file download
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(generateSampleConfig(platform)));
    element.setAttribute('download', `node_config_${platform}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  
  const generateSampleConfig = (platform: string) => {
    // This would be a user-specific configuration
    const userId = Math.floor(Math.random() * 10000);
    
    return `# Blockchain Node Configuration for ${platform}
# User ID: ${userId}
# Generated: ${new Date().toISOString()}

[Node]
NetworkID = 1
DataDir = "${platform === 'windows' ? 'C:\\Blockchain\\data' : '/var/blockchain/data'}"
EnableRPC = true
RPCPort = 8545
WSPort = 8546
P2PPort = 30303

[Mining]
Enabled = true
Threads = 4
GasPrice = 1000000000

[Security]
Firewall = true
AllowedIPs = "127.0.0.1,192.168.1.1"
MaxPeers = 50

[Network]
BootstrapNodes = [
  "enode://12345@123.456.78.90:30303",
  "enode://67890@98.765.43.21:30303"
]
`;
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="h-5 w-5 text-primary" />
          Node Configuration
        </CardTitle>
        <CardDescription>
          Download and set up your blockchain node configuration
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="windows" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="windows">Windows</TabsTrigger>
            <TabsTrigger value="macos">macOS</TabsTrigger>
            <TabsTrigger value="linux">Linux</TabsTrigger>
            <TabsTrigger value="docker">Docker</TabsTrigger>
          </TabsList>
          
          <TabsContent value="windows" className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Windows Setup</h3>
              <p className="text-sm text-muted-foreground">
                Follow these steps to set up your node on Windows:
              </p>
              
              <ol className="list-decimal ml-5 text-sm space-y-2 mt-2">
                <li>Download the Windows node configuration file</li>
                <li>Install the blockchain client from the official website</li>
                <li>Copy the configuration file to the installation directory</li>
                <li>Start the node client and follow the GUI instructions</li>
              </ol>
            </div>
            
            <div className="bg-muted p-4 rounded-md">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">Windows Configuration</span>
                    <div className="text-xs text-muted-foreground">
                      Version 1.4.2 • 24KB
                    </div>
                  </div>
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownloadConfig('windows')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="macos" className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">macOS Setup</h3>
              <p className="text-sm text-muted-foreground">
                Follow these steps to set up your node on macOS:
              </p>
              
              <ol className="list-decimal ml-5 text-sm space-y-2 mt-2">
                <li>Download the macOS node configuration file</li>
                <li>Install the blockchain client via Homebrew or the DMG installer</li>
                <li>Copy the configuration file to ~/Library/Application Support/Blockchain/</li>
                <li>Open Terminal and run the startup command</li>
              </ol>
            </div>
            
            <div className="bg-muted p-4 rounded-md">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">macOS Configuration</span>
                    <div className="text-xs text-muted-foreground">
                      Version 1.4.2 • 21KB
                    </div>
                  </div>
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownloadConfig('macos')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="linux" className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Linux Setup</h3>
              <p className="text-sm text-muted-foreground">
                Follow these steps to set up your node on Linux:
              </p>
              
              <ol className="list-decimal ml-5 text-sm space-y-2 mt-2">
                <li>Download the Linux node configuration file</li>
                <li>Install dependencies: <code>sudo apt update && sudo apt install -y build-essential</code></li>
                <li>Copy the configuration file to /etc/blockchain/</li>
                <li>Start the service: <code>sudo systemctl start blockchain-node</code></li>
              </ol>
            </div>
            
            <div className="bg-muted p-4 rounded-md">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">Linux Configuration</span>
                    <div className="text-xs text-muted-foreground">
                      Version 1.4.2 • 18KB
                    </div>
                  </div>
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownloadConfig('linux')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="docker" className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Docker Setup</h3>
              <p className="text-sm text-muted-foreground">
                Follow these steps to set up your node using Docker:
              </p>
              
              <ol className="list-decimal ml-5 text-sm space-y-2 mt-2">
                <li>Download the Docker node configuration file</li>
                <li>Make sure Docker is installed on your system</li>
                <li>Run: <code>docker pull blockchain/node:latest</code></li>
                <li>Start the container with your config mounted</li>
              </ol>
            </div>
            
            <div className="bg-muted p-4 rounded-md">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">Docker Configuration</span>
                    <div className="text-xs text-muted-foreground">
                      Version 1.4.2 • 14KB
                    </div>
                  </div>
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownloadConfig('docker')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="bg-muted p-4 rounded-md mt-4">
              <h4 className="text-sm font-medium mb-2">Docker Run Command</h4>
              <pre className="text-xs overflow-x-auto p-2 bg-background rounded">
                {`docker run -d \\
  --name blockchain-node \\
  -p 8545:8545 \\
  -p 8546:8546 \\
  -p 30303:30303 \\
  -v $(pwd)/config.yaml:/etc/blockchain/config.yaml \\
  blockchain/node:latest`}
              </pre>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2">
        <div className="text-sm font-medium">System Requirements</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full">
          <div className="bg-muted p-3 rounded-md">
            <div className="text-xs text-muted-foreground">CPU</div>
            <div className="font-medium">4+ cores</div>
          </div>
          <div className="bg-muted p-3 rounded-md">
            <div className="text-xs text-muted-foreground">RAM</div>
            <div className="font-medium">8GB minimum</div>
          </div>
          <div className="bg-muted p-3 rounded-md">
            <div className="text-xs text-muted-foreground">Storage</div>
            <div className="font-medium">250GB+ SSD</div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default NodeConfiguration;
