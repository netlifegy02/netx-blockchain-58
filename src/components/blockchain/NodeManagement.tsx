
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { 
  Activity,
  Server, 
  Globe, 
  Cpu, 
  Database, 
  RefreshCcw, 
  Search,
  Package,
  Clock,
  Zap,
  Power,
  Plus,
  Download,
  Shield,
  Network
} from 'lucide-react';
import { CopyCommand } from '@/components/ui/copy-command';

interface NodeProps {
  id: string;
  name: string;
  type: string;
  location: string;
  status: 'online' | 'offline' | 'syncing' | 'error';
  cpu: number;
  memory: number;
  storage: number;
  peers: number;
  blocks: number;
  version: string;
  earnings: number;
  lastSeen: string;
  uptime: string;
  cost: number;
  currency: 'NETGY' | 'NETX';
}

const NodeManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [nodes, setNodes] = useState<NodeProps[]>([
    {
      id: 'node-1a52f3',
      name: 'Primary Node',
      type: 'Validator',
      location: 'US East',
      status: 'online',
      cpu: 45,
      memory: 62,
      storage: 58,
      peers: 32,
      blocks: 5892345,
      version: 'v1.2.4',
      earnings: 1256.43,
      lastSeen: 'Just now',
      uptime: '99.98%',
      cost: 250,
      currency: 'NETGY'
    },
    {
      id: 'node-2b61a7',
      name: 'Secondary Node',
      type: 'Full',
      location: 'EU West',
      status: 'online',
      cpu: 38,
      memory: 57,
      storage: 42,
      peers: 28,
      blocks: 5892340,
      version: 'v1.2.4',
      earnings: 842.19,
      lastSeen: '1m ago',
      uptime: '99.89%',
      cost: 200,
      currency: 'NETGY'
    },
    {
      id: 'node-3c72e8',
      name: 'Mining Node',
      type: 'Mining',
      location: 'Asia Pacific',
      status: 'syncing',
      cpu: 78,
      memory: 82,
      storage: 65,
      peers: 15,
      blocks: 5891978,
      version: 'v1.2.3',
      earnings: 568.72,
      lastSeen: '2m ago',
      uptime: '98.76%',
      cost: 300,
      currency: 'NETX'
    },
    {
      id: 'node-4d83f9',
      name: 'Archive Node',
      type: 'Archive',
      location: 'US West',
      status: 'offline',
      cpu: 0,
      memory: 0,
      storage: 95,
      peers: 0,
      blocks: 5689423,
      version: 'v1.2.2',
      earnings: 0,
      lastSeen: '2d ago',
      uptime: '95.42%',
      cost: 400,
      currency: 'NETX'
    },
    {
      id: 'node-5e94g0',
      name: 'Light Node',
      type: 'Light',
      location: 'South America',
      status: 'error',
      cpu: 22,
      memory: 35,
      storage: 28,
      peers: 8,
      blocks: 5892102,
      version: 'v1.2.4',
      earnings: 124.87,
      lastSeen: '15m ago',
      uptime: '97.23%',
      cost: 100,
      currency: 'NETGY'
    }
  ]);
  
  const filteredNodes = nodes.filter(node => 
    node.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    node.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    node.type.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleStartNode = (nodeId: string) => {
    toast.success(`Starting node ${nodeId}...`);
    setNodes(nodes.map(node => 
      node.id === nodeId ? { ...node, status: 'syncing' } : node
    ));
    
    // Simulate node coming online after a delay
    setTimeout(() => {
      setNodes(nodes.map(node => 
        node.id === nodeId ? { ...node, status: 'online' } : node
      ));
      toast.success(`Node ${nodeId} is now online`);
    }, 3000);
  };
  
  const handleStopNode = (nodeId: string) => {
    toast.success(`Stopping node ${nodeId}...`);
    setNodes(nodes.map(node => 
      node.id === nodeId ? { ...node, status: 'offline' } : node
    ));
  };
  
  const handleRestartNode = (nodeId: string) => {
    toast.success(`Restarting node ${nodeId}...`);
    setNodes(nodes.map(node => 
      node.id === nodeId ? { ...node, status: 'offline' } : node
    ));
    
    // Simulate node coming back online after a delay
    setTimeout(() => {
      setNodes(nodes.map(node => 
        node.id === nodeId ? { ...node, status: 'syncing' } : node
      ));
      
      setTimeout(() => {
        setNodes(nodes.map(node => 
          node.id === nodeId ? { ...node, status: 'online' } : node
        ));
        toast.success(`Node ${nodeId} successfully restarted`);
      }, 2000);
    }, 1000);
  };
  
  const handleAddNode = () => {
    const newNodeId = `node-${Math.random().toString(36).substring(2, 8)}`;
    
    const newNode: NodeProps = {
      id: newNodeId,
      name: `New Node ${nodes.length + 1}`,
      type: 'Full',
      location: 'Custom Location',
      status: 'syncing',
      cpu: 0,
      memory: 0,
      storage: 0,
      peers: 0,
      blocks: 0,
      version: 'v1.2.4',
      earnings: 0,
      lastSeen: 'Just now',
      uptime: '0%',
      cost: 200,
      currency: Math.random() > 0.5 ? 'NETGY' : 'NETX'
    };
    
    setNodes([...nodes, newNode]);
    toast.success(`Node ${newNodeId} added and syncing`);
  };
  
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500/20 text-green-700 border-green-600/20';
      case 'offline':
        return 'bg-gray-500/20 text-gray-700 border-gray-600/20';
      case 'syncing':
        return 'bg-blue-500/20 text-blue-700 border-blue-600/20';
      case 'error':
        return 'bg-red-500/20 text-red-700 border-red-600/20';
      default:
        return '';
    }
  };
  
  const formatStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Node Management</h2>
          <p className="text-muted-foreground">
            Deploy, monitor, and manage your blockchain nodes across the network.
          </p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search nodes..."
              className="pl-8 w-full md:w-[200px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button onClick={handleAddNode}>
            <Plus className="h-4 w-4 mr-2" />
            Add Node
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNodes.map((node) => (
          <Card key={node.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="h-4 w-4" />
                    {node.name}
                  </CardTitle>
                  <CardDescription className="flex items-center text-xs mt-1">
                    ID: {node.id} • {node.type} Node
                  </CardDescription>
                </div>
                <Badge 
                  variant="outline"
                  className={getStatusBadgeColor(node.status)}
                >
                  {formatStatusText(node.status)}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="pb-0">
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">CPU</div>
                    <div className="text-sm font-medium">
                      {node.status !== 'offline' ? `${node.cpu}%` : '–'}
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${node.status !== 'offline' ? node.cpu : 0}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Memory</div>
                    <div className="text-sm font-medium">
                      {node.status !== 'offline' ? `${node.memory}%` : '–'}
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${node.status !== 'offline' ? node.memory : 0}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Storage</div>
                    <div className="text-sm font-medium">{node.storage}%</div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-orange-500 rounded-full"
                        style={{ width: `${node.storage}%` }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Peers</div>
                    <div className="text-sm font-medium flex items-center justify-center">
                      <Globe className="h-3 w-3 mr-1" />
                      {node.status !== 'offline' ? node.peers : '–'}
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Blocks</div>
                    <div className="text-sm font-medium flex items-center justify-center">
                      <Package className="h-3 w-3 mr-1" />
                      {node.blocks.toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Version</div>
                    <div className="text-sm font-medium">{node.version}</div>
                  </div>
                </div>
                
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-xs text-muted-foreground">Last Seen</div>
                      <div className="text-sm flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {node.lastSeen}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">Earnings</div>
                      <div className="text-sm font-medium text-green-600 flex items-center justify-end">
                        <Zap className="h-3 w-3 mr-1" />
                        {node.status !== 'offline' ? node.earnings.toFixed(2) : '0.00'} {node.currency}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-xs text-muted-foreground">Cost</div>
                      <div className="text-sm font-medium">
                        {node.cost} {node.currency}/month
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">Uptime</div>
                      <div className="text-sm font-medium">
                        {node.uptime}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-md p-2">
                  <div className="text-xs font-medium mb-1">Connection String:</div>
                  <CopyCommand 
                    command={`mintopia connect --node ${node.id} --location "${node.location}" --type ${node.type}`}
                    className="text-xs"
                  />
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between pt-4">
              <div className="flex gap-2">
                {node.status === 'offline' ? (
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => handleStartNode(node.id)}
                  >
                    <Power className="h-4 w-4 mr-1" />
                    Start
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleStopNode(node.id)}
                  >
                    <Power className="h-4 w-4 mr-1" />
                    Stop
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleRestartNode(node.id)}
                >
                  <RefreshCcw className="h-4 w-4 mr-1" />
                  Restart
                </Button>
              </div>
              
              <Button variant="ghost" size="sm">
                Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Network className="h-5 w-5" />
              Network Overview
            </CardTitle>
            <CardDescription>
              Current statistics for the global node network
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Total Active Nodes</div>
                <div className="text-3xl font-bold">
                  {nodes.filter(node => node.status === 'online' || node.status === 'syncing').length}/{nodes.length}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Network Health</div>
                <div className="flex items-center">
                  <Activity className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-xl font-semibold">98.7%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5" />
              Administrative Actions
            </CardTitle>
            <CardDescription>
              Manage network wide actions and maintenance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Update All Nodes
              </Button>
              
              <Button variant="outline" className="flex-1">
                <Database className="h-4 w-4 mr-2" />
                Backup Network
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="text-sm text-muted-foreground">
        <p>
          Need help setting up a new node? Check the <a href="#" className="text-primary underline">Linux Setup Guide</a> or 
          view the <a href="#" className="text-primary underline">Node Configuration</a> documentation.
        </p>
      </div>
    </div>
  );
};

export default NodeManagement;
