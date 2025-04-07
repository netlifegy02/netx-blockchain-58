
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { ModeToggle } from '@/components/ModeToggle';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 p-4 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Mintopia Lab</h1>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <Link to="/settings" className="text-muted-foreground hover:text-foreground">
              Settings
            </Link>
          </div>
        </div>
        <main>{children}</main>
      </div>
    </div>
  );
};

export default Layout;
