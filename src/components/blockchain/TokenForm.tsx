
import React, { useState } from 'react';
import { Network } from '@/lib/blockchain-types';
import { createToken } from '@/lib/blockchain-data';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface TokenFormProps {
  onTokenCreated: () => void;
  onCancel: () => void;
}

const TokenForm: React.FC<TokenFormProps> = ({ onTokenCreated, onCancel }) => {
  const [symbol, setSymbol] = useState('');
  const [name, setName] = useState('');
  const [network, setNetwork] = useState<Network>('ethereum');
  const [initialSupply, setInitialSupply] = useState('1000000');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!symbol || !name || !network || !initialSupply) {
      toast.error('Please fill all required fields');
      return;
    }
    
    if (symbol.length < 2 || symbol.length > 8) {
      toast.error('Symbol must be between 2 and 8 characters');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await createToken(
        symbol.toUpperCase(),
        name,
        network,
        Number(initialSupply)
      );
      
      if (result.success) {
        toast.success('Token created successfully!');
        onTokenCreated();
      } else {
        toast.error(result.message || 'Failed to create token');
      }
    } catch (error) {
      toast.error('An error occurred while creating the token');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Create New Token</CardTitle>
        <CardDescription>
          Fill in the details to create your custom token
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="symbol">Token Symbol (2-8 characters)</Label>
            <Input 
              id="symbol" 
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              placeholder="BTC"
              maxLength={8}
              className="uppercase"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Token Name</Label>
            <Input 
              id="name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Bitcoin"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="network">Blockchain Network</Label>
            <Select 
              value={network} 
              onValueChange={(value) => setNetwork(value as Network)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select network" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Networks</SelectLabel>
                  <SelectItem value="ethereum">Ethereum</SelectItem>
                  <SelectItem value="binance">Binance Smart Chain</SelectItem>
                  <SelectItem value="polygon">Polygon</SelectItem>
                  <SelectItem value="solana">Solana</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="initialSupply">Initial Supply</Label>
            <Input 
              id="initialSupply" 
              type="number"
              value={initialSupply}
              onChange={(e) => setInitialSupply(e.target.value)}
              placeholder="1000000"
              required
              min="1"
            />
          </div>
          
          <div className="pt-4 flex gap-2 justify-end">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Token'}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="bg-secondary/50 text-sm text-muted-foreground">
        <p>
          Note: All new tokens require admin approval before they become active.
          Trading is enabled only when market cap reaches $100,000 and there are at least 10 holders.
        </p>
      </CardFooter>
    </Card>
  );
};

export default TokenForm;
