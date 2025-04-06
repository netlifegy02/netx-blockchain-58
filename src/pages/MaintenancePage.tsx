
import React from 'react';
import { Wrench, AlertTriangle, Clock, Server } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const MaintenancePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
          <Wrench className="h-10 w-10 text-primary" />
        </div>
        
        <h1 className="text-3xl font-bold">System Maintenance</h1>
        
        <p className="text-muted-foreground">
          The Mintopia blockchain platform is currently undergoing scheduled maintenance to improve 
          performance and add new features. We'll be back shortly.
        </p>
        
        <div className="bg-secondary/40 p-4 rounded-lg flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <p className="text-sm text-left">
            Our team is working to complete maintenance as quickly as possible. Thank you for your patience.
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Estimated time remaining:</span>
            </div>
            <span className="font-medium">~30 minutes</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Maintenance type:</span>
            </div>
            <span className="font-medium">Database optimization</span>
          </div>
        </div>
        
        <div className="pt-4">
          <Button asChild variant="outline" className="w-full">
            <Link to="/">Check Again</Link>
          </Button>
        </div>
        
        <div className="text-sm text-muted-foreground pt-4">
          For urgent matters, please contact <span className="font-medium">support@mintopia.io</span>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;
