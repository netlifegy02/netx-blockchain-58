
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CopyCommand } from '@/components/ui/copy-command';
import { Button } from '@/components/ui/button';

const NodeManagement = () => {
  const [commands, setCommands] = useState([]);

  useEffect(() => {
    // Simulate fetching commands from an API or configuration
    const fetchedCommands = [
      {
        id: 1,
        title: 'Initialize Node',
        command: 'mintopia node init',
        description: 'Initialize a new Mintopia node with default settings.',
      },
      {
        id: 2,
        title: 'Start Node',
        command: 'mintopia node start',
        description: 'Start the Mintopia node.',
      },
      {
        id: 3,
        title: 'Stop Node',
        command: 'mintopia node stop',
        description: 'Stop the Mintopia node.',
      },
      {
        id: 4,
        title: 'Check Status',
        command: 'mintopia node status',
        description: 'Check the current status of the Mintopia node.',
      },
    ];
    setCommands(fetchedCommands);
  }, []);

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Node Management</h1>
        <p className="text-muted-foreground">
          Manage your Mintopia blockchain nodes with ease.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {commands.map((command) => (
          <Card key={command.id}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shell className="h-5 w-5 text-primary" />
                <CardTitle>{command.title}</CardTitle>
              </div>
              <CardDescription>
                {command.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Badge variant="secondary">Command</Badge>
                <CopyCommand value={command.command} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Button>Additional Action</Button>
    </div>
  );
};

export default NodeManagement;
