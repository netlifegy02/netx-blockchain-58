import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Package, Settings, Activity, Power, Lock, Download } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { logout, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigationItems = [
    {
      icon: <Home className="h-5 w-5" />,
      name: 'Dashboard',
      path: '/',
    },
    {
      icon: <Users className="h-5 w-5" />,
      name: 'Nodes',
      path: '/nodes',
    },
    {
      icon: <Package className="h-5 w-5" />,
      name: 'Tokens',
      path: '/tokens',
    },
    {
      icon: <Activity className="h-5 w-5" />,
      name: 'Mining',
      path: '/mining',
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-smartphone h-5 w-5"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><line x1="12" x2="12.01" y1="18" y2="18"/></svg>,
      name: 'Mobile App',
      path: '/mobile',
    },
    {
      icon: <Settings className="h-5 w-5" />,
      name: 'Settings',
      path: '/settings',
    },
    {
      icon: <Download className="h-5 w-5" />,
      name: 'Installation',
      path: '/installation',
    },
  ];

  if (isAuthenticated && user?.role === 'admin') {
    navigationItems.push({
      icon: <Lock className="h-5 w-5" />,
      name: 'Admin',
      path: '/admin',
    });
  }

  return (
    <div className="flex flex-col h-full bg-secondary/50 border-r border-r-border">
      <div className="px-4 py-6">
        <Link to="/" className="flex items-center space-x-2">
          <img src="/logo.png" alt="Mintopia Logo" className="h-8 w-8" />
          <span className="text-lg font-bold">Mintopia</span>
        </Link>
      </div>
      <div className="flex-grow p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`flex items-center space-x-3 p-3 rounded-md hover:bg-secondary ${location.pathname === item.path ? 'bg-secondary text-primary' : ''
                  }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {isAuthenticated && (
        <div className="p-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 p-3 rounded-md hover:bg-secondary w-full"
                >
                  <Power className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                Logout from Mintopia
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
