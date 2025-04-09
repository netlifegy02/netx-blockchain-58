
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Steps, Step } from '@/components/ui/steps';
import { CopyCommand } from '@/components/ui/copy-command';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, Download, ServerIcon, Terminal } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const InstallationGuidePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("server");
  
  const dockerInstallBash = `#!/bin/bash
# NETX Blockchain Node Installation Script
# For Ubuntu/Debian Linux Systems

set -e

echo "=========================================="
echo "NETX Blockchain Node Installation Script"
echo "=========================================="

# Check if running as root
if [ "$(id -u)" != "0" ]; then
   echo "This script must be run as root" 1>&2
   exit 1
fi

# Update system packages
echo "[1/7] Updating system packages..."
apt-get update
apt-get upgrade -y

# Install dependencies
echo "[2/7] Installing dependencies..."
apt-get install -y curl wget git build-essential apt-transport-https ca-certificates gnupg lsb-release

# Install Docker if not already installed
if ! command -v docker &> /dev/null; then
    echo "[3/7] Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    systemctl enable docker
    systemctl start docker
else
    echo "[3/7] Docker already installed, skipping..."
fi

# Install Docker Compose
echo "[4/7] Installing Docker Compose..."
COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep 'tag_name' | cut -d\" -f4)
curl -L "https://github.com/docker/compose/releases/download/${COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Create directory for node
echo "[5/7] Setting up NETX node directory..."
mkdir -p /opt/netx-node
cd /opt/netx-node

# Create docker-compose.yml file
echo "[6/7] Creating configuration files..."
cat > docker-compose.yml << 'EOL'
version: '3'

services:
  netx-node:
    container_name: netx-node
    image: netx/blockchain-node:latest
    restart: unless-stopped
    ports:
      - "8545:8545"
      - "30303:30303/tcp"
      - "30303:30303/udp"
    volumes:
      - ./data:/data
      - ./config:/config
    environment:
      - NODE_ID=${NODE_ID:-node1}
      - NODE_TYPE=${NODE_TYPE:-full}
      - NETWORK=${NETWORK:-mainnet}
    command: --config /config/node-config.json

  netx-monitor:
    container_name: netx-monitor
    image: netx/node-monitor:latest
    restart: unless-stopped
    depends_on:
      - netx-node
    ports:
      - "3000:3000"
    environment:
      - NODE_URL=http://netx-node:8545
EOL

# Create node config file
mkdir -p /opt/netx-node/config
cat > /opt/netx-node/config/node-config.json << 'EOL'
{
  "datadir": "/data",
  "network": "mainnet",
  "sync-mode": "fast",
  "rpc": {
    "enabled": true,
    "addr": "0.0.0.0",
    "port": 8545,
    "api": ["eth", "net", "web3", "txpool", "miner"]
  },
  "http": {
    "enabled": true,
    "addr": "0.0.0.0",
    "port": 8545,
    "api": ["eth", "net", "web3", "txpool"],
    "corsdomain": ["*"],
    "vhosts": ["*"]
  },
  "p2p": {
    "enabled": true,
    "port": 30303,
    "discovery": true
  },
  "metrics": {
    "enabled": true,
    "addr": "0.0.0.0",
    "port": 6060
  },
  "mining": {
    "enabled": false,
    "threads": 2,
    "etherbase": ""
  }
}
EOL

# Create environment file
cat > /opt/netx-node/.env << 'EOL'
# Node Configuration
NODE_ID=node1
NODE_TYPE=full
NETWORK=mainnet

# Replace with your wallet address to receive mining rewards
MINING_WALLET=

# Leave empty for automatic port selection
NODE_PORT=30303
RPC_PORT=8545
EOL

# Generate random node ID
NODE_ID=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 16 | head -n 1)
sed -i "s/NODE_ID=node1/NODE_ID=${NODE_ID}/" /opt/netx-node/.env

# Create service file for auto-start
cat > /etc/systemd/system/netx-node.service << 'EOL'
[Unit]
Description=NETX Blockchain Node
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/netx-node
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOL

# Reload systemd, enable and start service
systemctl daemon-reload
systemctl enable netx-node.service

echo "[7/7] Installation complete!"
echo ""
echo "Your NETX node has been installed with ID: ${NODE_ID}"
echo ""
echo "To start your node:"
echo "  systemctl start netx-node"
echo ""
echo "To check node status:"
echo "  cd /opt/netx-node && docker-compose ps"
echo ""
echo "To view logs:"
echo "  cd /opt/netx-node && docker-compose logs -f"
echo ""
echo "Node configuration can be edited at:"
echo "  /opt/netx-node/config/node-config.json"
echo ""
echo "Visit http://your-server-ip:3000 to access the node monitor"
echo ""
echo "Don't forget to register your node ID in the Mintopia admin panel to start earning rewards!"
echo "=========================================="`;

  const manualInstallSteps = [
    {
      title: "Update system packages",
      command: "apt update && apt upgrade -y"
    },
    {
      title: "Install dependencies",
      command: "apt install -y curl wget git build-essential apt-transport-https ca-certificates gnupg"
    },
    {
      title: "Install Docker",
      command: "curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh"
    },
    {
      title: "Install Docker Compose",
      command: "curl -L \"https://github.com/docker/compose/releases/download/v2.18.1/docker-compose-$(uname -s)-$(uname -m)\" -o /usr/local/bin/docker-compose && chmod +x /usr/local/bin/docker-compose"
    },
    {
      title: "Create node directory",
      command: "mkdir -p /opt/netx-node && cd /opt/netx-node"
    },
    {
      title: "Download configuration files",
      command: "wget -O netx-node.tar.gz https://github.com/netx/blockchain-node/releases/latest/download/config.tar.gz && tar -xzf netx-node.tar.gz"
    },
    {
      title: "Generate Node ID",
      command: "NODE_ID=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 16 | head -n 1) && echo \"NODE_ID=$NODE_ID\" > .env"
    },
    {
      title: "Start the node",
      command: "docker-compose up -d"
    }
  ];
  
  const oneClickScript = `#!/bin/bash
# One-Click MintopiaLab Installation Script
# -----------------------------------------
# This script automatically downloads and runs the full installation
# Simply run: curl -sSL https://mintopia-lab.com/install.sh | sudo bash

# Print banner
echo "=========================================================="
echo "  MintopiaLab - One-Click Installation for Ubuntu/Linux   "
echo "=========================================================="
echo

# Check if running as root
if [ "$(id -u)" != "0" ]; then
   echo "Error: This script must be run as root/sudo" 1>&2
   echo "Please run: curl -sSL https://mintopia-lab.com/install.sh | sudo bash"
   exit 1
fi

# Check system
echo "[1/6] Checking system compatibility..."
if [ -f /etc/os-release ]; then
    . /etc/os-release
    if [[ "$ID" == "ubuntu" || "$ID" == "debian" ]]; then
        echo "✅ Compatible system detected: $PRETTY_NAME"
    else
        echo "⚠️ Unsupported distribution: $PRETTY_NAME"
        echo "   This script is optimized for Ubuntu/Debian systems."
        echo "   Installation may not work correctly."
        read -p "Do you want to continue anyway? [y/N] " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo "Installation canceled."
            exit 1
        fi
    fi
else
    echo "⚠️ Could not determine OS."
    exit 1
fi

# Check requirements
echo "[2/6] Checking requirements..."
for cmd in curl wget systemctl; do
    if ! command -v $cmd &> /dev/null; then
        echo "Installing $cmd..."
        apt-get update &> /dev/null
        apt-get install -y $cmd &> /dev/null
    fi
done
echo "✅ All requirements satisfied"

# Download main installation script
echo "[3/6] Downloading installation files..."
mkdir -p /tmp/mintopia-install
cd /tmp/mintopia-install
wget -q https://mintopia-lab.com/setup/install.sh -O install.sh
chmod +x install.sh
echo "✅ Installation files downloaded"

# Set up configuration
echo "[4/6] Preparing configuration..."
cat > /tmp/mintopia-install/config.json << EOL
{
  "app": {
    "name": "MintopiaLab Node",
    "port": 3000,
    "apiPort": 8080,
    "adminUser": "admin",
    "adminPassword": "$(< /dev/urandom tr -dc A-Za-z0-9 | head -c 12)"
  },
  "blockchain": {
    "network": "mainnet",
    "enableMining": true,
    "autoBackup": true,
    "backupInterval": 24
  },
  "security": {
    "enableFirewall": true,
    "enableFail2ban": true,
    "maxLoginAttempts": 5
  }
}
EOL
echo "✅ Configuration prepared"

# Run installation
echo "[5/6] Running installation (this might take a few minutes)..."
bash /tmp/mintopia-install/install.sh -c /tmp/mintopia-install/config.json

# Clean up
echo "[6/6] Cleaning up temporary files..."
rm -rf /tmp/mintopia-install
echo "✅ Installation complete!"

# Display success message
echo
echo "=========================================================="
echo "  MintopiaLab has been successfully installed!           "
echo "=========================================================="
echo
echo "Your node is running at: http://$(hostname -I | awk '{print $1}'):3000"
echo "Admin dashboard: http://$(hostname -I | awk '{print $1}'):3000/admin"
echo
echo "Admin credentials have been saved to: /opt/mintopia-lab/credentials.txt"
echo
echo "To check the status of your node, run: systemctl status mintopia-lab"
echo
echo "Thank you for using MintopiaLab!"
echo "=========================================================="`;

  const handleDownloadScript = () => {
    // Create a blob with the bash script
    const blob = new Blob([dockerInstallBash], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary anchor element to download the file
    const link = document.createElement('a');
    link.href = url;
    link.download = 'install-netx-node.sh';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    URL.revokeObjectURL(url);
    toast.success("Setup script downloaded successfully");
  };
  
  const handleCopyScript = () => {
    navigator.clipboard.writeText(dockerInstallBash);
    toast.success("Bash script copied to clipboard");
  };

  const handleDownloadOneClickScript = () => {
    // Create a blob with the bash script
    const blob = new Blob([oneClickScript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary anchor element to download the file
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mintopia-one-click-install.sh';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    URL.revokeObjectURL(url);
    toast.success("One-click script downloaded successfully");
  };
  
  const handleCopyOneClickScript = () => {
    navigator.clipboard.writeText(oneClickScript);
    toast.success("One-click installation script copied to clipboard");
  };
  
  return (
    <Layout>
      <div className="container px-4 py-8 mx-auto">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">NETX Blockchain Installation Guide</h1>
            <p className="text-muted-foreground">
              Complete instructions for setting up NETX blockchain nodes and web application
            </p>
          </div>
          
          <Tabs defaultValue="server" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              <TabsTrigger value="server" className="flex items-center gap-2">
                <ServerIcon className="h-4 w-4" />
                Server Node
              </TabsTrigger>
              <TabsTrigger value="webapp" className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <rect width="20" height="14" x="2" y="3" rx="2" />
                  <line x1="8" x2="16" y1="21" y2="21" />
                  <line x1="12" x2="12" y1="17" y2="21" />
                </svg>
                Web Application
              </TabsTrigger>
              <TabsTrigger value="mobile" className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
                  <line x1="12" x2="12.01" y1="18" y2="18" />
                </svg>
                Mobile App
              </TabsTrigger>
              <TabsTrigger value="requirements" className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Requirements
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="server" className="space-y-6">
              <Card>
                <CardHeader>
                  <Badge className="w-fit mb-2">Linux / Ubuntu</Badge>
                  <CardTitle>One-Click Node Installation</CardTitle>
                  <CardDescription>
                    Deploy a NETX blockchain node with our automated script
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <ServerIcon className="h-4 w-4" />
                    <AlertTitle>Server Requirements</AlertTitle>
                    <AlertDescription>
                      Minimum: 2 CPU cores, 4GB RAM, 50GB SSD<br />
                      Recommended: 4 CPU cores, 8GB RAM, 100GB SSD
                    </AlertDescription>
                  </Alert>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Installation Steps</h3>
                    
                    <Steps>
                      <Step>
                        <StepTitle>Download the installation script</StepTitle>
                        <StepDescription>
                          <div className="space-y-2">
                            <p>Click the button below to download our automated installation script:</p>
                            <Button onClick={handleDownloadScript} className="gap-2">
                              <Download className="h-4 w-4" />
                              Download Install Script
                            </Button>
                          </div>
                        </StepDescription>
                      </Step>
                      
                      <Step>
                        <StepTitle>Make the script executable</StepTitle>
                        <StepDescription>
                          <div className="space-y-2">
                            <p>Upload the script to your server and make it executable:</p>
                            <CopyCommand value="chmod +x install-netx-node.sh" />
                          </div>
                        </StepDescription>
                      </Step>
                      
                      <Step>
                        <StepTitle>Run the installation script</StepTitle>
                        <StepDescription>
                          <div className="space-y-2">
                            <p>Execute the script with root privileges:</p>
                            <CopyCommand value="sudo ./install-netx-node.sh" />
                          </div>
                        </StepDescription>
                      </Step>
                      
                      <Step>
                        <StepTitle>Register your node in the admin panel</StepTitle>
                        <StepDescription>
                          <div className="space-y-2">
                            <p>After installation, the script will display your Node ID. Register this ID in the Mintopia Admin Panel to start earning NETGY/NETX coins for running your node.</p>
                          </div>
                        </StepDescription>
                      </Step>
                    </Steps>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Manual Installation</h3>
                    <p className="text-sm text-muted-foreground">
                      If you prefer to install the node manually, follow these steps:
                    </p>
                    
                    <Accordion type="single" collapsible className="w-full">
                      {manualInstallSteps.map((step, index) => (
                        <AccordionItem key={index} value={`step-${index}`}>
                          <AccordionTrigger>
                            <span className="text-sm font-medium">
                              Step {index + 1}: {step.title}
                            </span>
                          </AccordionTrigger>
                          <AccordionContent>
                            <CopyCommand value={step.command} className="mt-2" />
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Node Management Commands</CardTitle>
                  <CardDescription>
                    Common commands for managing your NETX blockchain node
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium">Start Node</h4>
                        <CopyCommand value="systemctl start netx-node" />
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">Stop Node</h4>
                        <CopyCommand value="systemctl stop netx-node" />
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">Check Node Status</h4>
                        <CopyCommand value="cd /opt/netx-node && docker-compose ps" />
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">View Node Logs</h4>
                        <CopyCommand value="cd /opt/netx-node && docker-compose logs -f" />
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">Update Node</h4>
                        <CopyCommand value="cd /opt/netx-node && docker-compose pull && docker-compose up -d" />
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">Access Node Monitor</h4>
                        <CopyCommand value="http://your-server-ip:3000" displayValue="http://your-server-ip:3000 (in web browser)" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="webapp" className="space-y-6">
              <Card>
                <CardHeader>
                  <Badge className="w-fit mb-2">Web Server</Badge>
                  <CardTitle>Web Application Deployment</CardTitle>
                  <CardDescription>
                    Deploy the NETX blockchain web interface to your server
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>Web Server Requirements</AlertTitle>
                    <AlertDescription>
                      Requires a web server with Node.js 16+ or a static web hosting service
                    </AlertDescription>
                  </Alert>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Deployment Steps</h3>
                    
                    <Steps>
                      <Step>
                        <StepTitle>Clone the repository</StepTitle>
                        <StepDescription>
                          <div className="space-y-2">
                            <CopyCommand value="git clone https://github.com/netx/blockchain-web.git" />
                          </div>
                        </StepDescription>
                      </Step>
                      
                      <Step>
                        <StepTitle>Install dependencies</StepTitle>
                        <StepDescription>
                          <div className="space-y-2">
                            <CopyCommand value="cd blockchain-web && npm install" />
                          </div>
                        </StepDescription>
                      </Step>
                      
                      <Step>
                        <StepTitle>Configure environment</StepTitle>
                        <StepDescription>
                          <div className="space-y-2">
                            <p>Create a .env file with your configuration:</p>
                            <CopyCommand value="VITE_API_URL=https://api.yourserver.com
VITE_NODE_RPC=https://rpc.yourserver.com
VITE_BLOCKCHAIN_EXPLORER=https://explorer.netx.network" />
                          </div>
                        </StepDescription>
                      </Step>
                      
                      <Step>
                        <StepTitle>Build the application</StepTitle>
                        <StepDescription>
                          <div className="space-y-2">
                            <CopyCommand value="npm run build" />
                          </div>
                        </StepDescription>
                      </Step>
                      
                      <Step>
                        <StepTitle>Deploy to web server</StepTitle>
                        <StepDescription>
                          <div className="space-y-2">
                            <p>Upload the contents of the dist directory to your web server, or deploy using:</p>
                            <CopyCommand value="npm run deploy" />
                          </div>
                        </StepDescription>
                      </Step>
                    </Steps>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="mobile" className="space-y-6">
              <Card>
                <CardHeader>
                  <Badge className="w-fit mb-2">Mobile</Badge>
                  <CardTitle>Mobile App Deployment</CardTitle>
                  <CardDescription>
                    Build and distribute the NETX mobile application
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Direct APK Download</h3>
                    <p>The latest version of the NETX Mobile App is available for direct download:</p>
                    
                    <div className="border rounded-lg p-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <h4 className="font-medium">NETX Wallet v1.2.5</h4>
                            <p className="text-sm text-muted-foreground">Android APK • 24.5 MB</p>
                          </div>
                          
                          <Button
                            className="flex items-center gap-2"
                            onClick={() => {
                              toast.success("APK download started");
                              // In a real app this would be a real download link
                            }}
                          >
                            <Download className="h-4 w-4" />
                            Download APK
                          </Button>
                        </div>
                        
                        <Separator />
                        
                        <div className="text-sm">
                          <h5 className="font-medium mb-2">Installation Instructions:</h5>
                          <ol className="list-decimal pl-6 space-y-1">
                            <li>Download the APK file to your Android device</li>
                            <li>Enable "Install from Unknown Sources" in your device settings</li>
                            <li>Open the downloaded file to start installation</li>
                            <li>Follow the on-screen prompts to complete installation</li>
                            <li>Open the app and log in with your credentials</li>
                          </ol>
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-medium mt-6">Build From Source</h3>
                    <p className="text-sm text-muted-foreground">
                      For developers who want to build the mobile app from source code:
                    </p>
                    
                    <Steps>
                      <Step>
                        <StepTitle>Clone the repository</StepTitle>
                        <StepDescription>
                          <CopyCommand value="git clone https://github.com/netx/mobile-wallet.git" />
                        </StepDescription>
                      </Step>
                      
                      <Step>
                        <StepTitle>Install dependencies</StepTitle>
                        <StepDescription>
                          <CopyCommand value="cd mobile-wallet && npm install" />
                        </StepDescription>
                      </Step>
                      
                      <Step>
                        <StepTitle>Configure environment</StepTitle>
                        <StepDescription>
                          <CopyCommand value="cp .env.example .env" />
                        </StepDescription>
                      </Step>
                      
                      <Step>
                        <StepTitle>Build Android APK</StepTitle>
                        <StepDescription>
                          <CopyCommand value="npm run build:android" />
                        </StepDescription>
                      </Step>
                      
                      <Step>
                        <StepTitle>Build iOS App</StepTitle>
                        <StepDescription>
                          <CopyCommand value="npm run build:ios" />
                        </StepDescription>
                      </Step>
                    </Steps>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="requirements" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Requirements</CardTitle>
                  <CardDescription>
                    Hardware and software requirements for running NETX blockchain components
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <h3 className="font-medium flex items-center gap-2">
                        <ServerIcon className="h-5 w-5 text-blue-600" />
                        Full Node
                      </h3>
                      <ul className="space-y-1 text-sm">
                        <li><span className="font-medium">CPU:</span> 4+ cores</li>
                        <li><span className="font-medium">RAM:</span> 8GB+ minimum</li>
                        <li><span className="font-medium">Storage:</span> 100GB+ SSD</li>
                        <li><span className="font-medium">Network:</span> 25 Mbps+, stable connection</li>
                        <li><span className="font-medium">OS:</span> Ubuntu 20.04 LTS or newer</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="font-medium flex items-center gap-2">
                        <ServerIcon className="h-5 w-5 text-green-600" />
                        Light Node
                      </h3>
                      <ul className="space-y-1 text-sm">
                        <li><span className="font-medium">CPU:</span> 2+ cores</li>
                        <li><span className="font-medium">RAM:</span> 4GB minimum</li>
                        <li><span className="font-medium">Storage:</span> 50GB SSD</li>
                        <li><span className="font-medium">Network:</span> 10 Mbps+, stable connection</li>
                        <li><span className="font-medium">OS:</span> Ubuntu 20.04 LTS or newer</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="font-medium flex items-center gap-2">
                        <Terminal className="h-5 w-5 text-purple-600" />
                        Web Application
                      </h3>
                      <ul className="space-y-1 text-sm">
                        <li><span className="font-medium">Server:</span> Any modern web server</li>
                        <li><span className="font-medium">Node.js:</span> v16+ (for building)</li>
                        <li><span className="font-medium">Storage:</span> 1GB+ for application</li>
                        <li><span className="font-medium">Database:</span> Optional local storage</li>
                      </ul>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Software Prerequisites</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium">For Node Deployment</h4>
                        <ul className="space-y-1 text-sm list-disc pl-5">
                          <li>Docker & Docker Compose</li>
                          <li>SSH access to server</li>
                          <li>Root or sudo privileges</li>
                          <li>Git (for manual installation)</li>
                          <li>Open ports: 8545 (RPC), 30303 (P2P)</li>
                        </ul>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">For Web Development</h4>
                        <ul className="space-y-1 text-sm list-disc pl-5">
                          <li>Node.js & npm</li>
                          <li>Git</li>
                          <li>Web browser (Chrome/Firefox recommended)</li>
                          <li>Code editor (VS Code recommended)</li>
                        </ul>
                      </div>
                    </div>
                    
                    <Alert variant="default">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Note about Security</AlertTitle>
                      <AlertDescription>
                        Always secure your server with proper firewall rules, SSH key authentication, and regular security updates.
                        Consider using a reverse proxy like Nginx for additional security layers.
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

interface StepTitleProps {
  children: React.ReactNode;
}

const StepTitle = ({ children }: StepTitleProps) => {
  return <h3 className="font-medium">{children}</h3>;
};

interface StepDescriptionProps {
  children: React.ReactNode;
}

const StepDescription = ({ children }: StepDescriptionProps) => {
  return <div className="text-sm text-muted-foreground">{children}</div>;
};

export default InstallationGuidePage;
