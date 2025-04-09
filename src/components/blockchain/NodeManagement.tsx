
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  Server, 
  Power, 
  Coins, 
  Settings, 
  Activity, 
  Download, 
  Plus, 
  MoreVertical, 
  PlayCircle,
  PauseCircle,
  CircleAlert,
  CheckCircle2,
  XCircle,
  DatabaseBackup
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Node {
  id: string;
  name: string;
  ipAddress: string;
  location: string;
  status: 'online' | 'offline' | 'starting' | 'error' | 'maintenance';
  version: string;
  lastSeen: string;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  nodeType: 'mining' | 'validator' | 'archive' | 'light';
  tokens: string[];
  paymentStatus: 'paid' | 'unpaid' | 'pending';
  paymentMethod: 'NETGY' | 'NETX' | 'BTC';
  paymentRate: number;
}

const mockNodes: Node[] = [
  {
    id: 'node-001-ab3d',
    name: 'Primary Validator',
    ipAddress: '192.168.1.100',
    location: 'Frankfurt, DE',
    status: 'online',
    version: '1.4.2',
    lastSeen: '2025-04-09T09:45:22Z',
    cpuUsage: 23,
    memoryUsage: 42,
    diskUsage: 37,
    nodeType: 'validator',
    tokens: ['NETGY', 'NETX'],
    paymentStatus: 'paid',
    paymentMethod: 'NETGY',
    paymentRate: 450
  },
  {
    id: 'node-002-19ac',
    name: 'Mining Node #1',
    ipAddress: '192.168.1.101',
    location: 'Amsterdam, NL',
    status: 'online',
    version: '1.4.1',
    lastSeen: '2025-04-09T09:48:12Z',
    cpuUsage: 87,
    memoryUsage: 76,
    diskUsage: 62,
    nodeType: 'mining',
    tokens: ['NETGY'],
    paymentStatus: 'paid',
    paymentMethod: 'NETGY',
    paymentRate: 350
  },
  {
    id: 'node-003-7de1',
    name: 'Archive Node #1',
    ipAddress: '192.168.1.102',
    location: 'London, UK',
    status: 'maintenance',
    version: '1.4.0',
    lastSeen: '2025-04-08T23:12:48Z',
    cpuUsage: 12,
    memoryUsage: 45,
    diskUsage: 87,
    nodeType: 'archive',
    tokens: ['NETGY', 'NETX'],
    paymentStatus: 'unpaid',
    paymentMethod: 'NETX',
    paymentRate: 500
  },
  {
    id: 'node-004-3f7b',
    name: 'Light Node #1',
    ipAddress: '192.168.1.103',
    location: 'Paris, FR',
    status: 'offline',
    version: '1.3.9',
    lastSeen: '2025-04-07T18:32:10Z',
    cpuUsage: 0,
    memoryUsage: 0,
    diskUsage: 25,
    nodeType: 'light',
    tokens: ['NETX'],
    paymentStatus: 'pending',
    paymentMethod: 'NETX',
    paymentRate: 200
  },
  {
    id: 'node-005-c892',
    name: 'Mining Node #2',
    ipAddress: '192.168.1.104',
    location: 'New York, US',
    status: 'error',
    version: '1.4.2',
    lastSeen: '2025-04-09T05:16:45Z',
    cpuUsage: 0,
    memoryUsage: 42,
    diskUsage: 51,
    nodeType: 'mining',
    tokens: ['NETGY'],
    paymentStatus: 'paid',
    paymentMethod: 'BTC',
    paymentRate: 380
  }
];

interface NodeCardProps {
  node: Node;
  onToggleNode: (nodeId: string) => void;
  onViewDetails: (nodeId: string) => void;
}

const NodeCard: React.FC<NodeCardProps> = ({ node, onToggleNode, onViewDetails }) => {
  const getStatusColor = (status: Node['status']) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-gray-500';
      case 'starting': return 'bg-blue-500';
      case 'error': return 'bg-red-500';
      case 'maintenance': return 'bg-amber-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: Node['status']) => {
    switch (status) {
      case 'online': return 'Online';
      case 'offline': return 'Offline';
      case 'starting': return 'Starting';
      case 'error': return 'Error';
      case 'maintenance': return 'Maintenance';
      default: return 'Unknown';
    }
  };

  const getNodeTypeColor = (type: Node['nodeType']) => {
    switch (type) {
      case 'mining': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'validator': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'archive': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      case 'light': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${getStatusColor(node.status)}`}></div>
              <CardTitle className="text-base">{node.name}</CardTitle>
            </div>
            <CardDescription className="mt-1">ID: {node.id}</CardDescription>
          </div>
          <Badge variant="outline" className={getNodeTypeColor(node.nodeType)}>
            {node.nodeType.charAt(0).toUpperCase() + node.nodeType.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Status</span>
              <span className="font-medium">{getStatusText(node.status)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">IP Address</span>
              <span className="font-medium">{node.ipAddress}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Location</span>
              <span className="font-medium">{node.location}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Payment</span>
              <span className="font-medium">{node.paymentRate} {node.paymentMethod}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">CPU</span>
              <span>{node.cpuUsage}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
              <div 
                className={`h-1.5 rounded-full ${
                  node.cpuUsage > 90 ? 'bg-red-500' : 
                  node.cpuUsage > 70 ? 'bg-amber-500' : 'bg-green-500'
                }`} 
                style={{ width: `${node.cpuUsage}%` }}
              ></div>
            </div>
          </div>

          <div className="flex justify-between pt-2">
            <Button variant="outline" size="sm" onClick={() => onViewDetails(node.id)}>
              Details
            </Button>
            <Button 
              variant={node.status === 'online' ? 'destructive' : 'default'} 
              size="sm"
              onClick={() => onToggleNode(node.id)}
            >
              {node.status === 'online' ? 'Stop' : 'Start'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface NodeDetailProps {
  node: Node | null;
  setNode: (node: Node | null) => void;
  onUpdateNode: (node: Node) => void;
}

const NodeDetail: React.FC<NodeDetailProps> = ({ node, setNode, onUpdateNode }) => {
  const [editableNode, setEditableNode] = useState<Node | null>(node);

  const handleChange = (field: keyof Node, value: any) => {
    if (!editableNode) return;
    setEditableNode({ ...editableNode, [field]: value });
  };

  const handleSave = () => {
    if (!editableNode) return;
    onUpdateNode(editableNode);
    toast.success('Node settings updated');
  };

  const getStatusIcon = (status: Node['status']) => {
    switch (status) {
      case 'online': return <CheckCircle2 className="text-green-500" size={16} />;
      case 'offline': return <XCircle className="text-gray-500" size={16} />;
      case 'starting': return <Activity className="text-blue-500" size={16} />;
      case 'error': return <CircleAlert className="text-red-500" size={16} />;
      case 'maintenance': return <Settings className="text-amber-500" size={16} />;
      default: return <XCircle className="text-gray-500" size={16} />;
    }
  };

  if (!node || !editableNode) return null;

  return (
    <Dialog open={!!node} onOpenChange={(open) => !open && setNode(null)}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Node Details
          </DialogTitle>
          <DialogDescription>
            View and manage node settings, performance, and payments.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="node-name">Node Name</Label>
                  <Input 
                    id="node-name"
                    value={editableNode.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="node-ip">IP Address</Label>
                  <Input 
                    id="node-ip"
                    value={editableNode.ipAddress}
                    onChange={(e) => handleChange('ipAddress', e.target.value)}
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="node-location">Location</Label>
                  <Input 
                    id="node-location"
                    value={editableNode.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="node-version">Version</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      id="node-version"
                      value={editableNode.version}
                      readOnly
                    />
                    <Button variant="outline" size="sm">
                      Update
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="node-type">Node Type</Label>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs px-2 py-1 capitalize">
                      {editableNode.nodeType}
                    </Badge>
                    <span className="text-sm text-muted-foreground">(Cannot be changed)</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label>Status</Label>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(editableNode.status)}
                    <span className="capitalize">{editableNode.status}</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label>Last Seen</Label>
                  <div className="text-sm">
                    {new Date(editableNode.lastSeen).toLocaleString()}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label>Supported Tokens</Label>
                  <div className="flex flex-wrap gap-1">
                    {editableNode.tokens.map((token) => (
                      <Badge key={token} variant="secondary">{token}</Badge>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="node-active">Active Status</Label>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="node-active"
                      checked={editableNode.status === 'online'} 
                      onCheckedChange={(checked) => 
                        handleChange('status', checked ? 'online' : 'offline')
                      }
                    />
                    <Label htmlFor="node-active">
                      {editableNode.status === 'online' ? 'Node is active' : 'Node is inactive'}
                    </Label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setNode(null)}>Cancel</Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="performance" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Resource Usage</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>CPU Usage</Label>
                      <span>{editableNode.cpuUsage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          editableNode.cpuUsage > 90 ? 'bg-red-500' : 
                          editableNode.cpuUsage > 70 ? 'bg-amber-500' : 'bg-green-500'
                        }`} 
                        style={{ width: `${editableNode.cpuUsage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Memory Usage</Label>
                      <span>{editableNode.memoryUsage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          editableNode.memoryUsage > 90 ? 'bg-red-500' : 
                          editableNode.memoryUsage > 70 ? 'bg-amber-500' : 'bg-green-500'
                        }`} 
                        style={{ width: `${editableNode.memoryUsage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Disk Usage</Label>
                      <span>{editableNode.diskUsage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          editableNode.diskUsage > 90 ? 'bg-red-500' : 
                          editableNode.diskUsage > 70 ? 'bg-amber-500' : 'bg-green-500'
                        }`} 
                        style={{ width: `${editableNode.diskUsage}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">System Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <DatabaseBackup className="h-4 w-4" />
                      Backup Node
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <PowerIcon className="h-4 w-4" />
                      Restart Node
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Settings className="h-4 w-4" />
                      Maintenance Mode
                    </Button>
                    <Button variant="destructive" size="sm" className="flex items-center gap-1">
                      <PowerIcon className="h-4 w-4" />
                      Force Stop
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="payment" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Payment Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="payment-status">Payment Status</Label>
                  <div className="flex gap-2">
                    <Badge variant={editableNode.paymentStatus === 'paid' ? 'default' : 
                      editableNode.paymentStatus === 'pending' ? 'outline' : 'destructive'}>
                      {editableNode.paymentStatus.charAt(0).toUpperCase() + editableNode.paymentStatus.slice(1)}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="payment-method">Payment Method</Label>
                  <div className="flex items-center gap-2">
                    <select 
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      value={editableNode.paymentMethod}
                      onChange={(e) => handleChange('paymentMethod', e.target.value as Node['paymentMethod'])}
                    >
                      <option value="NETGY">NETGY</option>
                      <option value="NETX">NETX</option>
                      <option value="BTC">BTC</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="payment-rate">Payment Rate (per month)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="payment-rate"
                      type="number"
                      value={editableNode.paymentRate}
                      onChange={(e) => handleChange('paymentRate', parseInt(e.target.value))}
                    />
                    <span>{editableNode.paymentMethod}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>2025-04-01</TableCell>
                      <TableCell>{editableNode.paymentRate} {editableNode.paymentMethod}</TableCell>
                      <TableCell>
                        <Badge variant="default">Paid</Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>2025-03-01</TableCell>
                      <TableCell>{editableNode.paymentRate} {editableNode.paymentMethod}</TableCell>
                      <TableCell>
                        <Badge variant="default">Paid</Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>2025-02-01</TableCell>
                      <TableCell>{editableNode.paymentRate - 50} {editableNode.paymentMethod}</TableCell>
                      <TableCell>
                        <Badge variant="default">Paid</Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="logs" className="space-y-4">
            <div className="flex justify-between">
              <div className="space-x-2">
                <Button variant="outline" size="sm">Refresh</Button>
                <Button variant="outline" size="sm">Download Logs</Button>
              </div>
              <select 
                className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
              >
                <option value="all">All Logs</option>
                <option value="error">Error Logs</option>
                <option value="info">Info Logs</option>
                <option value="debug">Debug Logs</option>
              </select>
            </div>
            
            <div className="bg-muted rounded-md p-4 h-[300px] overflow-y-auto font-mono text-xs">
              <div className="text-green-500">[2025-04-09 09:45:22] [INFO] Node started successfully</div>
              <div className="text-green-500">[2025-04-09 09:45:24] [INFO] Connected to blockchain network</div>
              <div className="text-muted-foreground">[2025-04-09 09:48:12] [DEBUG] Processing block #3429871</div>
              <div className="text-muted-foreground">[2025-04-09 09:52:07] [DEBUG] Processing block #3429872</div>
              <div className="text-yellow-500">[2025-04-09 09:55:18] [WARN] High memory usage detected: 76%</div>
              <div className="text-muted-foreground">[2025-04-09 09:56:32] [DEBUG] Processing block #3429873</div>
              <div className="text-muted-foreground">[2025-04-09 10:01:15] [INFO] Validated transaction batch #28945</div>
              <div className="text-muted-foreground">[2025-04-09 10:04:22] [DEBUG] Processing block #3429874</div>
              <div className="text-muted-foreground">[2025-04-09 10:08:19] [DEBUG] Processing block #3429875</div>
              <div className="text-muted-foreground">[2025-04-09 10:12:45] [INFO] Validated transaction batch #28946</div>
              <div className="text-red-500">[2025-04-09 10:15:03] [ERROR] Failed to connect to peer node-003-7de1</div>
              <div className="text-yellow-500">[2025-04-09 10:15:12] [WARN] Retrying connection to peer...</div>
              <div className="text-green-500">[2025-04-09 10:15:38] [INFO] Successfully reconnected to peer node-003-7de1</div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

// Main component
const NodeManagement: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>(mockNodes);
  const [activeNode, setActiveNode] = useState<Node | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [newNodeDialog, setNewNodeDialog] = useState(false);

  const filteredNodes = nodes.filter(node => 
    node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    node.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    node.ipAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
    node.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNodeToggle = (nodeId: string) => {
    setNodes(nodes.map(node => {
      if (node.id === nodeId) {
        const newStatus = node.status === 'online' ? 'offline' : 'online';
        toast.success(`Node ${node.name} ${newStatus === 'online' ? 'started' : 'stopped'}`);
        return { ...node, status: newStatus };
      }
      return node;
    }));
  };

  const handleViewDetails = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId) || null;
    setActiveNode(node);
  };

  const handleUpdateNode = (updatedNode: Node) => {
    setNodes(nodes.map(node => 
      node.id === updatedNode.id ? updatedNode : node
    ));
    setActiveNode(null);
  };

  const handleAddNode = () => {
    // In a real app, this would make an API call to create the node
    const newNode: Node = {
      id: `node-${Math.floor(Math.random() * 10000)}`,
      name: 'New Node',
      ipAddress: '192.168.1.100',
      location: 'Custom Location',
      status: 'starting',
      version: '1.4.2',
      lastSeen: new Date().toISOString(),
      cpuUsage: 0,
      memoryUsage: 0,
      diskUsage: 0,
      nodeType: 'light',
      tokens: ['NETGY'],
      paymentStatus: 'pending',
      paymentMethod: 'NETGY',
      paymentRate: 200
    };
    
    setNodes([...nodes, newNode]);
    toast.success('New node created and initializing');
    setNewNodeDialog(false);
  };

  const getStatusSummary = () => {
    const online = nodes.filter(n => n.status === 'online').length;
    const offline = nodes.filter(n => n.status === 'offline').length;
    const error = nodes.filter(n => n.status === 'error').length;
    const maintenance = nodes.filter(n => n.status === 'maintenance').length;
    
    return { online, offline, error, maintenance };
  };

  const summary = getStatusSummary();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Node Management</h2>
          <p className="text-muted-foreground">
            Monitor and manage your blockchain network nodes
          </p>
        </div>
        
        <Button onClick={() => setNewNodeDialog(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Node
        </Button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs">Online Nodes</p>
                <p className="text-2xl font-bold">{summary.online}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs">Offline Nodes</p>
                <p className="text-2xl font-bold">{summary.offline}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                <Power className="h-5 w-5 text-gray-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs">Error Nodes</p>
                <p className="text-2xl font-bold">{summary.error}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                <CircleAlert className="h-5 w-5 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs">Maintenance</p>
                <p className="text-2xl font-bold">{summary.maintenance}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                <Settings className="h-5 w-5 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Input
            placeholder="Search nodes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={view === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('grid')}
          >
            Grid
          </Button>
          <Button
            variant={view === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('list')}
          >
            List
          </Button>
        </div>
      </div>
      
      {view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNodes.map((node) => (
            <NodeCard 
              key={node.id} 
              node={node} 
              onToggleNode={handleNodeToggle} 
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNodes.map((node) => (
                  <TableRow key={node.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${
                          node.status === 'online' ? 'bg-green-500' : 
                          node.status === 'offline' ? 'bg-gray-500' : 
                          node.status === 'error' ? 'bg-red-500' : 
                          node.status === 'maintenance' ? 'bg-amber-500' : 
                          'bg-blue-500'
                        }`}></div>
                        <span className="capitalize">{node.status}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div>{node.name}</div>
                        <div className="text-xs text-muted-foreground">{node.id}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {node.nodeType}
                      </Badge>
                    </TableCell>
                    <TableCell>{node.ipAddress}</TableCell>
                    <TableCell>{node.location}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span>{node.paymentRate}</span>
                        <Badge variant="secondary" className="text-xs">
                          {node.paymentMethod}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleViewDetails(node.id)} 
                          className="h-8 w-8 p-0"
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant={node.status === 'online' ? 'ghost' : 'default'}
                          size="sm"
                          onClick={() => handleNodeToggle(node.id)}
                          className="h-8 w-8 p-0"
                        >
                          {node.status === 'online' ? (
                            <PauseCircle className="h-4 w-4" />
                          ) : (
                            <PlayCircle className="h-4 w-4" />
                          )}
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Restart</DropdownMenuItem>
                            <DropdownMenuItem>View Logs</DropdownMenuItem>
                            <DropdownMenuItem>Backup</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              Delete Node
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      
      {/* Node detail dialog */}
      <NodeDetail 
        node={activeNode} 
        setNode={setActiveNode} 
        onUpdateNode={handleUpdateNode} 
      />
      
      {/* Add node dialog */}
      <Dialog open={newNodeDialog} onOpenChange={setNewNodeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Node</DialogTitle>
            <DialogDescription>
              Deploy a new blockchain node to your network.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="node-name">Node Name</Label>
              <Input id="node-name" placeholder="Enter node name" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="node-type">Node Type</Label>
              <select 
                id="node-type"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="mining">Mining Node</option>
                <option value="validator">Validator Node</option>
                <option value="archive">Archive Node</option>
                <option value="light">Light Node</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <select 
                id="location"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="Frankfurt, DE">Frankfurt, DE</option>
                <option value="Amsterdam, NL">Amsterdam, NL</option>
                <option value="London, UK">London, UK</option>
                <option value="Paris, FR">Paris, FR</option>
                <option value="New York, US">New York, US</option>
                <option value="custom">Custom...</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="payment-method">Payment Method</Label>
              <select 
                id="payment-method"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="NETGY">NETGY</option>
                <option value="NETX">NETX</option>
                <option value="BTC">BTC</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="payment-rate">Payment Rate (per month)</Label>
              <div className="flex items-center gap-2">
                <Input id="payment-rate" type="number" defaultValue="200" />
                <span>NETGY</span>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewNodeDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddNode}>
              Deploy Node
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NodeManagement;
