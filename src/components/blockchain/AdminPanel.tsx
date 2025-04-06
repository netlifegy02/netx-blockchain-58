
import React, { useState } from 'react';
import { Token, AdminSettings } from '@/lib/blockchain-types';
import { formatCurrency, formatNumber, getNetworkClass } from '@/lib/blockchain-utils';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from 'sonner';
import { 
  Shield,
  Settings,
  DollarSign,
  CheckCircle,
  XCircle,
  Zap
} from 'lucide-react';

interface AdminPanelProps {
  tokens: Token[];
  settings: AdminSettings;
  onApproveToken: (tokenId: string) => void;
  onRejectToken: (tokenId: string) => void;
  onUpdateSettings: (settings: AdminSettings) => void;
  onToggleMining: (tokenId: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  tokens, 
  settings,
  onApproveToken,
  onRejectToken,
  onUpdateSettings,
  onToggleMining
}) => {
  const [editSettings, setEditSettings] = useState(false);
  const [updatedSettings, setUpdatedSettings] = useState<AdminSettings>({...settings});
  
  const handleSettingsChange = (
    category: keyof AdminSettings,
    field: string,
    value: number
  ) => {
    if (category === 'featureEnablementFees') {
      setUpdatedSettings({
        ...updatedSettings,
        featureEnablementFees: {
          ...updatedSettings.featureEnablementFees,
          [field]: value
        }
      });
    } else {
      setUpdatedSettings({
        ...updatedSettings,
        [field]: value
      });
    }
  };
  
  const saveSettings = () => {
    onUpdateSettings(updatedSettings);
    setEditSettings(false);
    toast.success('Settings updated successfully');
  };
  
  const pendingTokens = tokens.filter(token => !token.approved);
  const approvedTokens = tokens.filter(token => token.approved);
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-1">Admin Control Panel</h2>
        <p className="text-muted-foreground">
          Manage tokens and blockchain settings
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Token Approval
            </CardTitle>
            <CardDescription>
              Pending tokens requiring approval
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{pendingTokens.length}</div>
            <div className="text-sm text-muted-foreground">
              {pendingTokens.length === 0 ? 'No tokens pending approval' : 'Tokens waiting for review'}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-crypto-yellow" />
              Mining Tokens
            </CardTitle>
            <CardDescription>
              Tokens enabled for mining
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              {tokens.filter(token => token.miningEnabled).length}
            </div>
            <div className="text-sm text-muted-foreground">
              Out of {tokens.length} total tokens
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-crypto-green" />
              Fee Revenue
            </CardTitle>
            <CardDescription>
              Total revenue from feature enablement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{formatCurrency(12450)}</div>
            <div className="text-sm text-muted-foreground">
              From 45 feature enablements
            </div>
          </CardContent>
        </Card>
      </div>
      
      {pendingTokens.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Token Approvals</CardTitle>
            <CardDescription>
              Review and approve tokens created by users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Token</TableHead>
                  <TableHead>Network</TableHead>
                  <TableHead>Supply</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingTokens.map(token => (
                  <TableRow key={token.id}>
                    <TableCell>
                      <div className="font-medium">{token.symbol}</div>
                      <div className="text-sm text-muted-foreground">{token.name}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getNetworkClass(token.network)}>
                        {token.network}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatNumber(token.circulatingSupply)}</TableCell>
                    <TableCell>
                      {new Date(token.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => onApproveToken(token.id)}
                          className="bg-crypto-green hover:bg-crypto-green/90"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => onRejectToken(token.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Approved Tokens</CardTitle>
          <CardDescription>
            Manage tokens that have been approved
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Token</TableHead>
                <TableHead>Network</TableHead>
                <TableHead>Market Cap</TableHead>
                <TableHead>Holders</TableHead>
                <TableHead>Mining</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {approvedTokens.map(token => (
                <TableRow key={token.id}>
                  <TableCell>
                    <div className="font-medium">{token.symbol}</div>
                    <div className="text-sm text-muted-foreground">{token.name}</div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getNetworkClass(token.network)}>
                      {token.network}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(token.marketCap)}</TableCell>
                  <TableCell>{formatNumber(token.holders)}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={token.miningEnabled ? "default" : "outline"}
                      className={token.miningEnabled ? "bg-crypto-yellow text-black" : ""}
                    >
                      {token.miningEnabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      size="sm" 
                      variant={token.miningEnabled ? "outline" : "default"}
                      onClick={() => onToggleMining(token.id)}
                    >
                      {token.miningEnabled ? "Disable Mining" : "Enable Mining"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-muted-foreground" />
                System Settings
              </CardTitle>
              <CardDescription>
                Configure global blockchain settings
              </CardDescription>
            </div>
            
            {!editSettings && (
              <Button variant="outline" onClick={() => setEditSettings(true)}>
                Edit Settings
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {editSettings ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Trading Requirements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minMarketCap">Minimum Market Cap ($)</Label>
                    <Input 
                      id="minMarketCap" 
                      type="number"
                      value={updatedSettings.minMarketCapForTrading}
                      onChange={(e) => handleSettingsChange('minMarketCapForTrading', 'minMarketCapForTrading', Number(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="minHolders">Minimum Holders</Label>
                    <Input 
                      id="minHolders" 
                      type="number"
                      value={updatedSettings.minHoldersRequired}
                      onChange={(e) => handleSettingsChange('minHoldersRequired', 'minHoldersRequired', Number(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="minTokens">Minimum Tokens per Holder</Label>
                    <Input 
                      id="minTokens" 
                      type="number"
                      value={updatedSettings.minTokensPerHolder}
                      onChange={(e) => handleSettingsChange('minTokensPerHolder', 'minTokensPerHolder', Number(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="minHoldersForMining">Minimum Holders for Mining</Label>
                    <Input 
                      id="minHoldersForMining" 
                      type="number"
                      value={updatedSettings.minHoldersForMining}
                      onChange={(e) => handleSettingsChange('minHoldersForMining', 'minHoldersForMining', Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-4">Feature Enablement Fees</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mintingFee">Minting Fee ($)</Label>
                    <Input 
                      id="mintingFee" 
                      type="number"
                      value={updatedSettings.featureEnablementFees.minting}
                      onChange={(e) => handleSettingsChange('featureEnablementFees', 'minting', Number(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="mutableFee">Mutable Fee ($)</Label>
                    <Input 
                      id="mutableFee" 
                      type="number"
                      value={updatedSettings.featureEnablementFees.mutable}
                      onChange={(e) => handleSettingsChange('featureEnablementFees', 'mutable', Number(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="freezeFee">Freeze Fee ($)</Label>
                    <Input 
                      id="freezeFee" 
                      type="number"
                      value={updatedSettings.featureEnablementFees.freeze}
                      onChange={(e) => handleSettingsChange('featureEnablementFees', 'freeze', Number(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="unfreezeFee">Unfreeze Fee ($)</Label>
                    <Input 
                      id="unfreezeFee" 
                      type="number"
                      value={updatedSettings.featureEnablementFees.unfreeze}
                      onChange={(e) => handleSettingsChange('featureEnablementFees', 'unfreeze', Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setEditSettings(false);
                    setUpdatedSettings({...settings});
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={saveSettings}>
                  Save Settings
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Trading Requirements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-secondary/50 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground">Minimum Market Cap</div>
                    <div className="text-xl font-semibold">{formatCurrency(settings.minMarketCapForTrading)}</div>
                  </div>
                  
                  <div className="bg-secondary/50 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground">Minimum Holders</div>
                    <div className="text-xl font-semibold">{settings.minHoldersRequired}</div>
                  </div>
                  
                  <div className="bg-secondary/50 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground">Minimum Tokens per Holder</div>
                    <div className="text-xl font-semibold">{formatNumber(settings.minTokensPerHolder)}</div>
                  </div>
                  
                  <div className="bg-secondary/50 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground">Minimum Holders for Mining</div>
                    <div className="text-xl font-semibold">{formatNumber(settings.minHoldersForMining)}</div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-4">Feature Enablement Fees</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-secondary/50 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground">Minting Fee</div>
                    <div className="text-xl font-semibold">{formatCurrency(settings.featureEnablementFees.minting)}</div>
                  </div>
                  
                  <div className="bg-secondary/50 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground">Mutable Fee</div>
                    <div className="text-xl font-semibold">{formatCurrency(settings.featureEnablementFees.mutable)}</div>
                  </div>
                  
                  <div className="bg-secondary/50 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground">Freeze Fee</div>
                    <div className="text-xl font-semibold">{formatCurrency(settings.featureEnablementFees.freeze)}</div>
                  </div>
                  
                  <div className="bg-secondary/50 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground">Unfreeze Fee</div>
                    <div className="text-xl font-semibold">{formatCurrency(settings.featureEnablementFees.unfreeze)}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPanel;
