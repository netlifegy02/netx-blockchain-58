
import React from 'react';
import Layout from '@/components/layout/Layout';
import NodeManagement from '@/components/blockchain/NodeManagement';
import LinuxSetupGuide from '@/components/blockchain/LinuxSetupGuide';
import NodeConfiguration from '@/components/blockchain/NodeConfiguration';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Server, Terminal, Settings } from 'lucide-react';

const NodesPage = () => {
  return (
    <Layout>
      <div className="container py-6 space-y-6">
        <h1 className="text-3xl font-bold">Node Management</h1>
        <p className="text-muted-foreground">
          Deploy, monitor and manage your blockchain nodes
        </p>
        
        <Tabs defaultValue="management">
          <TabsList>
            <TabsTrigger value="management" className="flex items-center gap-2">
              <Server className="h-4 w-4" />
              Node Dashboard
            </TabsTrigger>
            <TabsTrigger value="setup" className="flex items-center gap-2">
              <Terminal className="h-4 w-4" />
              Linux Setup Guide
            </TabsTrigger>
            <TabsTrigger value="config" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configuration
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="management" className="mt-6">
            <NodeManagement />
          </TabsContent>
          
          <TabsContent value="setup" className="mt-6">
            <LinuxSetupGuide />
          </TabsContent>
          
          <TabsContent value="config" className="mt-6">
            <NodeConfiguration />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default NodesPage;
