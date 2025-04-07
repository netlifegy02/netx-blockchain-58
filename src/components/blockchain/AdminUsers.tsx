
import React, { useState, useEffect, useRef } from 'react';
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
  Server,
  Plus,
  Pencil,
  Trash2,
  DollarSign,
  MinusCircle,
  Upload,
  Image
} from 'lucide-react';
import { formatNumber } from '@/lib/blockchain-utils';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fileToBase64 } from '@/utils/authUtils';

interface UserAccount {
  id: string;
  name: string;
  username?: string;
  email: string;
  phone: string;
  tokens: number;
  balance: number;
  nodes: number;
  status: 'active' | 'inactive' | 'pending';
  registeredAt: string;
  verificationStatus: 'verified' | 'unverified';
  avatar?: string;
}

const AdminUsers: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [nodeCount, setNodeCount] = useState({ total: 0, active: 0 });
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isFundsDialogOpen, setIsFundsDialogOpen] = useState(false);
  const [fundAmount, setFundAmount] = useState('');
  const [newUser, setNewUser] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    avatar: ''
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      try {
        // Attempt to load users from localStorage first
        const savedUsers = localStorage.getItem('adminUsers');
        let mockUsers: UserAccount[] = [];
        
        if (savedUsers) {
          mockUsers = JSON.parse(savedUsers);
        } else {
          // Generate mock user data if not found in localStorage
          mockUsers = Array.from({ length: 12 }, (_, i) => ({
            id: `user-${i + 100}`,
            name: `User ${['John', 'Mary', 'David', 'Sarah', 'Michael', 'Jennifer', 'Robert', 'Lisa', 'Thomas', 'Emily'][i % 10]} ${String.fromCharCode(65 + i % 26)}`,
            username: `user${i + 100}`,
            email: `user${i + 100}@example.com`,
            phone: `+1 ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
            tokens: Math.floor(Math.random() * 5),
            balance: Math.floor(Math.random() * 1000),
            nodes: Math.floor(Math.random() * 3),
            status: ['active', 'active', 'active', 'inactive', 'pending'][Math.floor(Math.random() * 5)] as 'active' | 'inactive' | 'pending',
            registeredAt: new Date(Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000)).toISOString(),
            verificationStatus: Math.random() > 0.3 ? 'verified' : 'unverified',
            avatar: Math.random() > 0.7 ? `/avatars/avatar-${i % 5 + 1}.png` : undefined
          }));
          
          // Save to localStorage
          localStorage.setItem('adminUsers', JSON.stringify(mockUsers));
        }
        
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
  
  // Save users to localStorage whenever they change
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem('adminUsers', JSON.stringify(users));
    }
  }, [users]);
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone.includes(searchQuery) ||
    (user.username && user.username.toLowerCase().includes(searchQuery.toLowerCase()))
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
  
  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
    toast.success('User has been deleted');
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      try {
        const base64Image = await fileToBase64(files[0]);
        
        if (isEdit && selectedUser) {
          setSelectedUser({...selectedUser, avatar: base64Image});
        } else {
          setNewUser({...newUser, avatar: base64Image});
        }
        
        toast.success('Image uploaded successfully');
      } catch (error) {
        console.error('Error converting image:', error);
        toast.error('Failed to upload image');
      }
    }
  };
  
  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.password || !newUser.username) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Check if username already exists
    if (users.some(user => user.username?.toLowerCase() === newUser.username.toLowerCase())) {
      toast.error('Username already exists');
      return;
    }
    
    const newId = `user-${Date.now()}`;
    
    const userToAdd: UserAccount = {
      id: newId,
      name: newUser.name,
      username: newUser.username,
      email: newUser.email,
      phone: newUser.phone || '',
      tokens: 0,
      balance: 0,
      nodes: 0,
      status: 'active',
      registeredAt: new Date().toISOString(),
      verificationStatus: 'unverified',
      avatar: newUser.avatar || undefined
    };
    
    setUsers([userToAdd, ...users]);
    
    // Also add to registered users for login
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    registeredUsers.push({
      username: newUser.username,
      password: newUser.password,
      email: newUser.email,
      name: newUser.name,
      phone: newUser.phone,
      role: 'user',
      isFullySetup: true
    });
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    
    setNewUser({
      name: '',
      username: '',
      email: '',
      phone: '',
      password: '',
      avatar: ''
    });
    
    setIsAddUserOpen(false);
    toast.success('New user added successfully');
  };
  
  const handleEditUser = () => {
    if (!selectedUser) return;
    
    // Check if username is being changed and if it already exists
    if (selectedUser.username && 
        users.some(user => 
          user.id !== selectedUser.id && 
          user.username?.toLowerCase() === selectedUser.username.toLowerCase()
        )) {
      toast.error('Username already exists');
      return;
    }
    
    setUsers(users.map(user => 
      user.id === selectedUser.id ? selectedUser : user
    ));
    
    setIsEditUserOpen(false);
    toast.success('User information updated');
  };
  
  const handleAddFunds = () => {
    if (!selectedUser) return;
    
    const amount = parseFloat(fundAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    setUsers(users.map(user => 
      user.id === selectedUser.id 
        ? { ...user, balance: user.balance + amount } 
        : user
    ));
    
    setIsFundsDialogOpen(false);
    setFundAmount('');
    toast.success(`$${amount} added to ${selectedUser.name}'s account`);
  };
  
  const handleRemoveFunds = () => {
    if (!selectedUser) return;
    
    const amount = parseFloat(fundAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    if (amount > selectedUser.balance) {
      toast.error(`Cannot remove more than the current balance of $${selectedUser.balance}`);
      return;
    }
    
    setUsers(users.map(user => 
      user.id === selectedUser.id 
        ? { ...user, balance: user.balance - amount } 
        : user
    ));
    
    setIsFundsDialogOpen(false);
    setFundAmount('');
    toast.success(`$${amount} removed from ${selectedUser.name}'s account`);
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
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>User Accounts</CardTitle>
              <CardDescription>
                Manage registered users and their verification status
              </CardDescription>
            </div>
            
            <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                  <DialogDescription>
                    Create a new user account. The user will be able to log in with these credentials.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  {/* Profile Picture Upload */}
                  <div className="flex flex-col items-center space-y-2">
                    <div className="relative">
                      <Avatar className="w-24 h-24">
                        <AvatarImage src={newUser.avatar} />
                        <AvatarFallback className="text-xl">
                          {newUser.name ? newUser.name.charAt(0).toUpperCase() : <User className="h-12 w-12" />}
                        </AvatarFallback>
                      </Avatar>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4" />
                        <span className="sr-only">Upload</span>
                      </Button>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e)}
                      className="hidden"
                    />
                    <span className="text-sm text-muted-foreground">Click to upload profile picture</span>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name*</Label>
                    <Input 
                      id="name" 
                      value={newUser.name}
                      onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="username">Username*</Label>
                    <Input 
                      id="username" 
                      value={newUser.username}
                      onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                      placeholder="johndoe"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email*</Label>
                    <Input 
                      id="email" 
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      placeholder="john@example.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      value={newUser.phone}
                      onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password*</Label>
                    <Input 
                      id="password" 
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddUser}>Create User</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="relative mt-4">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search users by name, username, email or phone..." 
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
                  <TableHead>Balance/Assets</TableHead>
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
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {user.username ? `@${user.username} · ` : ''}{user.email}
                            </div>
                          </div>
                        </div>
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
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-sm font-medium">${user.balance.toFixed(2)}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <span>{user.tokens} Tokens</span>
                            <span className="mx-1">•</span>
                            <span>{user.nodes} Nodes</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setSelectedUser(user)}
                              >
                                <DollarSign className="h-4 w-4 mr-1" />
                                Funds
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Manage Funds</DialogTitle>
                                <DialogDescription>
                                  Add or remove funds from {user.name}'s account
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="py-4">
                                <div className="space-y-2">
                                  <Label htmlFor="fundAmount">Amount (USD)</Label>
                                  <Input 
                                    id="fundAmount" 
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={fundAmount}
                                    onChange={(e) => setFundAmount(e.target.value)}
                                    placeholder="0.00"
                                  />
                                </div>
                                
                                <div className="mt-4 p-3 bg-muted rounded-md">
                                  <div className="font-medium">Current Balance</div>
                                  <div className="text-2xl font-bold">${user.balance.toFixed(2)}</div>
                                </div>
                              </div>
                              
                              <DialogFooter>
                                <Button variant="outline" onClick={handleRemoveFunds}>
                                  <MinusCircle className="h-4 w-4 mr-2" />
                                  Remove Funds
                                </Button>
                                <Button onClick={handleAddFunds}>
                                  <Plus className="h-4 w-4 mr-2" />
                                  Add Funds
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          
                          <Dialog open={isEditUserOpen && selectedUser?.id === user.id} 
                                 onOpenChange={(open) => {
                                   setIsEditUserOpen(open);
                                   if (open) setSelectedUser(user);
                                 }}>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setIsEditUserOpen(true);
                                }}
                              >
                                <Pencil className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle>Edit User</DialogTitle>
                                <DialogDescription>
                                  Update user details
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="space-y-4 py-4">
                                {/* Edit Profile Picture */}
                                <div className="flex flex-col items-center space-y-2">
                                  <div className="relative">
                                    <Avatar className="w-24 h-24">
                                      <AvatarImage src={selectedUser?.avatar} />
                                      <AvatarFallback className="text-xl">
                                        {selectedUser?.name ? selectedUser.name.charAt(0).toUpperCase() : <User className="h-12 w-12" />}
                                      </AvatarFallback>
                                    </Avatar>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0"
                                      onClick={() => editFileInputRef.current?.click()}
                                    >
                                      <Upload className="h-4 w-4" />
                                      <span className="sr-only">Upload</span>
                                    </Button>
                                  </div>
                                  <input
                                    ref={editFileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, true)}
                                    className="hidden"
                                  />
                                  <span className="text-sm text-muted-foreground">Click to change profile picture</span>
                                </div>
                                
                                <div className="space-y-2">
                                  <Label htmlFor="edit-name">Full Name</Label>
                                  <Input 
                                    id="edit-name" 
                                    value={selectedUser?.name}
                                    onChange={(e) => setSelectedUser(prev => 
                                      prev ? {...prev, name: e.target.value} : null
                                    )}
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <Label htmlFor="edit-username">Username</Label>
                                  <Input 
                                    id="edit-username" 
                                    value={selectedUser?.username || ''}
                                    onChange={(e) => setSelectedUser(prev => 
                                      prev ? {...prev, username: e.target.value} : null
                                    )}
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <Label htmlFor="edit-email">Email</Label>
                                  <Input 
                                    id="edit-email" 
                                    type="email"
                                    value={selectedUser?.email}
                                    onChange={(e) => setSelectedUser(prev => 
                                      prev ? {...prev, email: e.target.value} : null
                                    )}
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <Label htmlFor="edit-phone">Phone Number</Label>
                                  <Input 
                                    id="edit-phone" 
                                    value={selectedUser?.phone}
                                    onChange={(e) => setSelectedUser(prev => 
                                      prev ? {...prev, phone: e.target.value} : null
                                    )}
                                  />
                                </div>
                              </div>
                              
                              <DialogFooter>
                                <Button 
                                  variant="destructive" 
                                  onClick={() => {
                                    if (selectedUser) {
                                      handleDeleteUser(selectedUser.id);
                                      setSelectedUser(null);
                                      setIsEditUserOpen(false);
                                    }
                                  }}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete User
                                </Button>
                                <Button onClick={handleEditUser}>Save Changes</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          
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
