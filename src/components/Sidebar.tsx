
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Coins, Gem, Settings, Users, Download, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  active?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon: Icon, label, active }) => {
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
  
  return (
    <div className="h-screen w-64 border-r p-4 hidden md:block">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-primary mb-1">Mintopia</h2>
        <p className="text-muted-foreground text-sm">Blockchain Platform</p>
      </div>
      
      <nav className="space-y-1">
        <SidebarItem to="/" icon={Home} label="Dashboard" active={path === '/'} />
        <SidebarItem to="/tokens" icon={Coins} label="Tokens" active={path.startsWith('/tokens')} />
        <SidebarItem to="/mining" icon={Gem} label="Mining" active={path === '/mining'} />
        <SidebarItem to="/mobile-app" icon={Download} label="Mobile App" active={path === '/mobile-app'} />
        <SidebarItem to="/admin" icon={Shield} label="Admin" active={path === '/admin'} />
        <SidebarItem to="/settings" icon={Settings} label="Settings" active={path === '/settings'} />
      </nav>
    </div>
  );
};
