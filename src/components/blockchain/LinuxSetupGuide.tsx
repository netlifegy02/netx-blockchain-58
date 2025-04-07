
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, Copy, Download, CheckCircle, Terminal } from 'lucide-react';
import { toast } from 'sonner';

const LinuxSetupGuide: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const bashScript = `#!/bin/bash
# MintopiaLab Setup Script for Ubuntu/Linux
# ------------------------------------------

echo "====================================="
echo "MintopiaLab Node Setup Script"
echo "====================================="
echo

# Check if running as root
if [ "$(id -u)" != "0" ]; then
   echo "This script must be run as root" 1>&2
   exit 1
fi

# Update system
echo "Updating system packages..."
apt-get update
apt-get upgrade -y

# Install dependencies
echo "Installing dependencies..."
apt-get install -y curl wget git build-essential nodejs npm

# Install Node.js v18
echo "Installing Node.js v18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Verify installation
echo "Node.js version:"
node -v
echo "NPM version:"
npm -v

# Create application directory
echo "Creating application directory..."
mkdir -p /opt/mintopia-lab
cd /opt/mintopia-lab

# Clone repository
echo "Cloning MintopiaLab repository..."
git clone https://github.com/your-org/mintopia-lab.git .

# Install dependencies
echo "Installing application dependencies..."
npm install

# Build the application
echo "Building application..."
npm run build

# Setup service
echo "Setting up systemd service..."
cat > /etc/systemd/system/mintopia-lab.service << EOL
[Unit]
Description=MintopiaLab Node
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/mintopia-lab
ExecStart=/usr/bin/npm start
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOL

# Enable and start service
echo "Enabling and starting service..."
systemctl daemon-reload
systemctl enable mintopia-lab
systemctl start mintopia-lab

# Setup Firewall
echo "Configuring firewall..."
ufw allow 3000/tcp
ufw allow 8080/tcp

# Setup backup cron job
echo "Setting up automatic backups..."
mkdir -p /opt/mintopia-lab/backups
cat > /etc/cron.daily/mintopia-backup << EOL
#!/bin/bash
DATE=\$(date +%Y-%m-%d)
BACKUP_DIR="/opt/mintopia-lab/backups"
tar -czf \$BACKUP_DIR/mintopia-backup-\$DATE.tar.gz -C /opt/mintopia-lab .
find \$BACKUP_DIR -type f -name "mintopia-backup-*.tar.gz" -mtime +7 -delete
EOL
chmod +x /etc/cron.daily/mintopia-backup

# Configure fail2ban for security
echo "Installing and configuring fail2ban..."
apt-get install -y fail2ban
cat > /etc/fail2ban/jail.local << EOL
[DEFAULT]
bantime = 86400
findtime = 3600
maxretry = 5

[mintopia]
enabled = true
filter = mintopia
logpath = /opt/mintopia-lab/logs/*.log
maxretry = 3
bantime = 86400
EOL

cat > /etc/fail2ban/filter.d/mintopia.conf << EOL
[Definition]
failregex = Failed login attempt from <HOST> for user .*
ignoreregex =
EOL

systemctl restart fail2ban

echo
echo "====================================="
echo "MintopiaLab setup complete!"
echo "====================================="
echo
echo "Your node is running at: http://your-server-ip:3000"
echo "Admin dashboard: http://your-server-ip:3000/admin"
echo "Backups are stored in: /opt/mintopia-lab/backups"
echo
echo "Important: Update the repository URL and configure"
echo "your blockchain parameters in the config file:"
echo "/opt/mintopia-lab/config.json"
echo
echo "For more information, visit: https://docs.mintopia-lab.com"
echo "====================================="
`;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(bashScript);
    setCopied(true);
    toast.success("Bash script copied to clipboard");
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleDownloadScript = () => {
    const element = document.createElement("a");
    const file = new Blob([bashScript], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "mintopia-setup.sh";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Setup script downloaded successfully");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Terminal className="h-5 w-5 text-primary" />
          Ubuntu/Linux Setup Guide
        </CardTitle>
        <CardDescription>
          Bash script to automatically set up MintopiaLab node on Ubuntu/Linux servers
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="script" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="script">Bash Script</TabsTrigger>
            <TabsTrigger value="instructions">Setup Instructions</TabsTrigger>
          </TabsList>
          <TabsContent value="script" className="space-y-4">
            <div className="relative">
              <div className="max-h-[400px] overflow-y-auto rounded-md bg-muted p-4 font-mono text-sm">
                <pre>{bashScript}</pre>
              </div>
              <div className="absolute top-2 right-2 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 bg-background/80 backdrop-blur-sm"
                  onClick={handleCopyScript}
                >
                  {copied ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={handleDownloadScript}>
                <Download className="mr-2 h-4 w-4" />
                Download Script
              </Button>
              <Button onClick={handleCopyScript}>
                <Copy className="mr-2 h-4 w-4" />
                Copy to Clipboard
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="instructions" className="space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Prerequisites</h3>
                <ul className="ml-6 list-disc text-muted-foreground">
                  <li>Ubuntu 20.04 LTS or newer / Debian-based Linux distribution</li>
                  <li>Root or sudo access to the server</li>
                  <li>At least 2GB RAM and 20GB storage</li>
                  <li>Open ports: 3000 (web), 8080 (node)</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Manual Installation Steps</h3>
                <ol className="ml-6 list-decimal space-y-2 text-muted-foreground">
                  <li>SSH into your server as root or a user with sudo privileges</li>
                  <li>Download the setup script: <code>wget https://mintopia-lab.com/setup.sh -O setup.sh</code></li>
                  <li>Make the script executable: <code>chmod +x setup.sh</code></li>
                  <li>Run the script: <code>sudo ./setup.sh</code></li>
                  <li>Follow the on-screen instructions to complete setup</li>
                </ol>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">After Installation</h3>
                <ul className="ml-6 list-disc text-muted-foreground">
                  <li>Access your node dashboard at <code>http://your-server-ip:3000</code></li>
                  <li>Log in with your admin credentials</li>
                  <li>Configure node settings in the admin dashboard</li>
                  <li>Set up secure HTTPS with Let&apos;s Encrypt (optional)</li>
                  <li>Configure regular backups to cloud storage (Google Drive, S3)</li>
                </ul>
              </div>
              
              <div className="rounded-md bg-yellow-50 p-4 dark:bg-yellow-900/20">
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Important Notes</h4>
                <ul className="ml-6 mt-2 list-disc text-yellow-700 dark:text-yellow-300/80">
                  <li>Customize the config.json file to match your specific requirements</li>
                  <li>Set strong passwords for all admin accounts</li>
                  <li>Keep your system updated regularly</li>
                  <li>Backup your recovery phrases and private keys securely</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LinuxSetupGuide;
