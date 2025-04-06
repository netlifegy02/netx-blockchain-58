
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  User, 
  UserCheck, 
  UserX, 
  Search, 
  Users as UsersIcon,
  Smartphone,
  Server
} from 'lucide-react';
import { formatNumber } from '@/lib/blockchain-utils';

interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  tokens: number;
  nodes: number;
  status: 'active' | 'inactive' | 'pending';
  registeredAt: string;
  verificationStatus: 'verified' | 'unverified';
}

const AdminUsers: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [nodeCount, setNodeCount] = useState({ total: 0, active: 0 });
  
  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Generate mock user data
        const mockUsers: UserAccount[] = Array.from({ length: 12 }, (_, i) => ({
          id: `user-${i + 100}`,
          name: `User ${['John', 'Mary', 'David', 'Sarah', 'Michael', 'Jennifer', 'Robert', 'Lisa', 'Thomas', 'Emily'][i % 10]} ${String.fromCharCode(65 + i % 26)}`,
          email: `user${i + 100}@example.com`,
          phone: `+1 ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
          tokens: Math.floor(Math.random() * 5),
          nodes: Math.floor(Math.random() * 3),
          status: ['active', 'active', 'active', 'inactive', 'pending'][Math.floor(Math.random() * 5)] as 'active' | 'inactive' | 'pending',
          registeredAt: new Date(Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000)).toISOString(),
          verificationStatus: Math.random() > 0.3 ? 'verified' : 'unverified'
        }));
        
        setUsers(mockUsers);
        
        // Calculate total nodes
        const totalNodes = mockUsers.reduce((acc, user) => acc + user.nodes, 0);
        const activeNodes = Math.floor(totalNodes * 0.85); // Assume 85% of nodes are active
        setNodeCount({ total: totalNodes, active: activeNodes });
        
      } catch (error) {
        console.error('Error loading users:', error);
        toast.error('Failed to load user data');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUsers();
  }, []);
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone.includes(searchQuery)
  );
  
  const handleVerifyUser = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, verificationStatus: 'verified' } 
        : user
    ));
    toast.success('User has been verified');
  };
  
  const handleDeactivateUser = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: 'inactive' } 
        : user
    ));
    toast.success('User has been deactivated');
  };
  
  const handleActivateUser = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: 'active' } 
        : user
    ));
    toast.success('User has been activated');
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <UsersIcon className="h-5 w-5 text-primary" />
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatNumber(users.length)}</div>
            <div className="text-sm text-muted-foreground">
              {users.filter(u => u.status === 'active').length} active users
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-primary" />
              Verified Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatNumber(users.filter(u => u.verificationStatus === 'verified').length)}
            </div>
            <div className="text-sm text-muted-foreground">
              {((users.filter(u => u.verificationStatus === 'verified').length / users.length) * 100).toFixed(1)}% of all users
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5 text-primary" />
              Active Nodes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatNumber(nodeCount.active)}</div>
            <div className="text-sm text-muted-foreground">
              Out of {formatNumber(nodeCount.total)} total nodes
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>User Accounts</CardTitle>
          <CardDescription>
            Manage registered users and their verification status
          </CardDescription>
          
          <div className="relative mt-4">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search users by name, email or phone..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 flex justify-center">
              <div className="animate-pulse space-y-4 w-full">
                <div className="h-10 bg-muted rounded-md w-full"></div>
                <div className="h-20 bg-muted rounded-md w-full"></div>
                <div className="h-20 bg-muted rounded-md w-full"></div>
                <div className="h-20 bg-muted rounded-md w-full"></div>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Verification</TableHead>
                  <TableHead>Tokens/Nodes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No users found matching your search criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map(user => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          className={
                            user.status === 'active' 
                              ? 'bg-green-500/20 text-green-700' 
                              : user.status === 'inactive' 
                              ? 'bg-red-500/20 text-red-700' 
                              : 'bg-yellow-500/20 text-yellow-700'
                          }
                        >
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          className={
                            user.verificationStatus === 'verified' 
                              ? 'bg-blue-500/20 text-blue-700' 
                              : 'bg-gray-500/20 text-gray-700'
                          }
                        >
                          {user.verificationStatus === 'verified' ? 'Verified' : 'Unverified'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="text-sm">{user.tokens} Tokens</span>
                          <span className="text-muted-foreground mx-1">•</span>
                          <span className="text-sm">{user.nodes} Nodes</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {user.verificationStatus === 'unverified' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleVerifyUser(user.id)}
                            >
                              <UserCheck className="h-4 w-4 mr-1" />
                              Verify
                            </Button>
                          )}
                          
                          {user.status === 'active' ? (
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDeactivateUser(user.id)}
                            >
                              <UserX className="h-4 w-4 mr-1" />
                              Deactivate
                            </Button>
                          ) : (
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-green-600 hover:text-green-700"
                              onClick={() => handleActivateUser(user.id)}
                            >
                              <UserCheck className="h-4 w-4 mr-1" />
                              Activate
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
