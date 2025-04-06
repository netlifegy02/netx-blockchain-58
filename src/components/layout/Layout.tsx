
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isAdminPage = location.pathname.includes('/admin');
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      {!isAdminPage && (
        <div className="fixed bottom-6 right-6">
          <Button asChild variant="outline" size="icon" className="rounded-full h-12 w-12 shadow-lg">
            <Link to="/settings" title="Settings">
              <Settings className="h-6 w-6" />
            </Link>
          </Button>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Layout;
