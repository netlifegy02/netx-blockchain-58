
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Coins, 
  Gem, 
  Settings, 
  Users, 
  Download, 
  Shield,
  Smartphone, 
  Wallet,
  AreaChart,
  Clock,
  DollarSign,
  Lock,
  Server
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { getUserInfo } from '@/utils/authUtils';

interface SidebarItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  active?: boolean;
  adminOnly?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon: Icon, label, active, adminOnly }) => {
  const currentUser = getUserInfo();
  const isAdmin = currentUser && (currentUser.isAdmin || currentUser.role === 'admin');
  
  // Don't render admin-only items for non-admin users
  if (adminOnly && !isAdmin) return null;
  
  return (
    <Link to={to}>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-2 mb-1",
          active && "bg-accent text-accent-foreground"
        )}
      >
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </Button>
    </Link>
  );
};

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;
  const currentUser = getUserInfo();
  const isAdmin = currentUser && (currentUser.isAdmin || currentUser.role === 'admin');
  
  return (
    <div className="h-screen w-64 border-r p-4 hidden md:block">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-primary mb-1">Mintopia</h2>
        <p className="text-muted-foreground text-sm">Blockchain Platform</p>
        
        {isAdmin && (
          <div className="mt-2 bg-primary/10 text-primary text-xs px-2 py-1 rounded-sm inline-flex items-center">
            <Shield className="h-3 w-3 mr-1" />
            Admin Account
          </div>
        )}
      </div>
      
      <nav className="space-y-1">
        <SidebarItem to="/" icon={Home} label="Dashboard" active={path === '/'} />
        <SidebarItem to="/tokens" icon={Coins} label="Tokens" active={path.startsWith('/tokens')} />
        <SidebarItem to="/mining" icon={Gem} label="Mining" active={path === '/mining'} />
        <SidebarItem to="/wallet" icon={Wallet} label="My Wallet" active={path === '/wallet'} />
        <SidebarItem to="/trading" icon={AreaChart} label="Trading" active={path === '/trading'} />
        <SidebarItem to="/transactions" icon={Clock} label="Transactions" active={path === '/transactions'} />
        <SidebarItem to="/cashout" icon={DollarSign} label="Cashout" active={path === '/cashout'} />
        <SidebarItem to="/mobile-app" icon={Smartphone} label="Mobile App" active={path === '/mobile-app'} />
        <SidebarItem to="/nodes" icon={Server} label="Nodes" active={path === '/nodes'} />
        <SidebarItem to="/admin" icon={Shield} label="Admin" active={path === '/admin'} adminOnly={true} />
        <SidebarItem to="/users" icon={Users} label="User Accounts" active={path === '/users'} adminOnly={true} />
        <SidebarItem to="/security" icon={Lock} label="Security" active={path === '/security'} />
        <SidebarItem to="/settings" icon={Settings} label="Settings" active={path === '/settings'} />
      </nav>
    </div>
  );
};

export default Sidebar;
