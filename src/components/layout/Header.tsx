
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Settings, 
  Wallet, 
  Zap,
  Bell
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">Mintopia</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">Dashboard</Link>
          <Link to="/tokens" className="text-sm font-medium transition-colors hover:text-primary">Tokens</Link>
          <Link to="/mining" className="text-sm font-medium transition-colors hover:text-primary">Mining</Link>
          <Link to="/admin" className="text-sm font-medium transition-colors hover:text-primary">Admin</Link>
        </nav>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-crypto-red"></span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Wallet className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Wallet</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Balance</span>
                  <span className="font-medium">1,234.56 MINT</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>View Transactions</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Link to="/settings">
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </Link>
          
          <Link to="/admin">
            <Button variant="default" size="sm" className="hidden md:flex">
              Admin Panel
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
