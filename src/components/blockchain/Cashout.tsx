
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  DollarSign, 
  CreditCard, 
  BanknoteIcon,
  Wallet,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency, formatNumber } from '@/lib/blockchain-utils';

interface CashoutHistory {
  id: string;
  token: string;
  amount: number;
  fiatAmount: number;
  method: string;
  status: 'completed' | 'pending' | 'failed';
  timestamp: string;
}

const Cashout: React.FC = () => {
  const [selectedToken, setSelectedToken] = useState('MINT');
  const [amount, setAmount] = useState('');
  const [cashoutMethod, setCashoutMethod] = useState('bank');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [history, setHistory] = useState<CashoutHistory[]>([
    {
      id: 'cashout-001',
      token: 'MINT',
      amount: 500,
      fiatAmount: 500,
      method: 'bank',
      status: 'completed',
      timestamp: '2025-04-05 10:30:00'
    },
    {
      id: 'cashout-002',
      token: 'BTC',
      amount: 0.01,
      fiatAmount: 600,
      method: 'paypal',
      status: 'completed',
      timestamp: '2025-04-02 15:45:00'
    },
    {
      id: 'cashout-003',
      token: 'ETH',
      amount: 0.25,
      fiatAmount: 625,
      method: 'bank',
      status: 'pending',
      timestamp: '2025-04-01 09:15:00'
    }
  ]);

  const tokens = [
    { symbol: 'MINT', name: 'Mintopia', balance: 2500, value: 2500, price: 1 },
    { symbol: 'BTC', name: 'Bitcoin', balance: 0.05, value: 3000, price: 60000 },
    { symbol: 'ETH', name: 'Ethereum', balance: 0.75, value: 1875, price: 2500 },
    { symbol: 'USDT', name: 'Tether', balance: 1000, value: 1000, price: 1 }
  ];

  const calculateFiatAmount = (tokenAmount: string, tokenSymbol: string) => {
    const token = tokens.find(t => t.symbol === tokenSymbol);
    if (!token || isNaN(parseFloat(tokenAmount))) return 0;
    return parseFloat(tokenAmount) * token.price;
  };

  const handleCashout = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (cashoutMethod === 'bank' && (!bankName || !accountNumber || !routingNumber)) {
      toast.error('Please fill in all bank details');
      return;
    }

    const token = tokens.find(t => t.symbol === selectedToken);
    if (!token || token.balance < parseFloat(amount)) {
      toast.error(`Insufficient ${selectedToken} balance`);
      return;
    }

    toast.info('Processing cashout request...');

    // Simulate API call delay
    setTimeout(() => {
      const newCashout: CashoutHistory = {
        id: `cashout-${Math.random().toString(36).substring(2, 7)}`,
        token: selectedToken,
        amount: parseFloat(amount),
        fiatAmount: calculateFiatAmount(amount, selectedToken),
        method: cashoutMethod,
        status: 'pending',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };

      setHistory([newCashout, ...history]);
      toast.success('Cashout request submitted successfully');
      
      // Reset form
      setAmount('');
      setBankName('');
      setAccountNumber('');
      setRoutingNumber('');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BanknoteIcon className="h-5 w-5 text-primary" />
            Cash Out
          </CardTitle>
          <CardDescription>
            Convert your cryptocurrency to fiat money
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="border rounded-lg p-6 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Convert to Fiat</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="token">Select Token</Label>
                      <Select 
                        value={selectedToken} 
                        onValueChange={setSelectedToken}
                      >
                        <SelectTrigger id="token">
                          <SelectValue placeholder="Select token" />
                        </SelectTrigger>
                        <SelectContent>
                          {tokens.map(token => (
                            <SelectItem key={token.symbol} value={token.symbol}>
                              <div className="flex items-center">
                                <div className="w-6 h-6 rounded-full bg-primary/20 mr-2 flex items-center justify-center text-xs">
                                  {token.symbol.charAt(0)}
                                </div>
                                {token.symbol}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="text-sm text-muted-foreground">
                        Balance: {tokens.find(t => t.symbol === selectedToken)?.balance.toFixed(8)} {selectedToken}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                      <div className="text-sm text-muted-foreground">
                        ≈ ${calculateFiatAmount(amount, selectedToken).toFixed(2)} USD
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Cashout Method</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <Button
                        type="button"
                        variant={cashoutMethod === 'bank' ? 'default' : 'outline'}
                        className="justify-start"
                        onClick={() => setCashoutMethod('bank')}
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Bank Transfer
                      </Button>
                      
                      <Button
                        type="button"
                        variant={cashoutMethod === 'paypal' ? 'default' : 'outline'}
                        className="justify-start"
                        onClick={() => setCashoutMethod('paypal')}
                      >
                        <DollarSign className="h-4 w-4 mr-2" />
                        PayPal
                      </Button>
                    </div>
                  </div>
                  
                  {cashoutMethod === 'bank' && (
                    <div className="space-y-4 border p-4 rounded-md">
                      <h4 className="font-medium">Bank Transfer Details</h4>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bank-name">Bank Name</Label>
                        <Input
                          id="bank-name"
                          placeholder="Enter your bank name"
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="account-number">Account Number</Label>
                        <Input
                          id="account-number"
                          placeholder="Enter your account number"
                          value={accountNumber}
                          onChange={(e) => setAccountNumber(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="routing-number">Routing Number</Label>
                        <Input
                          id="routing-number"
                          placeholder="Enter your routing number"
                          value={routingNumber}
                          onChange={(e) => setRoutingNumber(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                  
                  {cashoutMethod === 'paypal' && (
                    <div className="space-y-4 border p-4 rounded-md">
                      <h4 className="font-medium">PayPal Details</h4>
                      
                      <div className="space-y-2">
                        <Label htmlFor="paypal-email">PayPal Email</Label>
                        <Input
                          id="paypal-email"
                          type="email"
                          placeholder="Enter your PayPal email"
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="pt-2">
                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={handleCashout}
                      disabled={!amount || parseFloat(amount) <= 0}
                    >
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Cash Out
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="border rounded-lg p-4 space-y-4">
                <h3 className="font-medium text-lg flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-muted-foreground" />
                  Portfolio Value
                </h3>
                
                <div className="text-3xl font-bold">
                  ${tokens.reduce((sum, token) => sum + token.value, 0).toLocaleString()}
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground">Token Allocation</div>
                  
                  {tokens.map(token => (
                    <div key={token.symbol} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs">
                            {token.symbol.charAt(0)}
                          </div>
                          <span>{token.symbol}</span>
                        </div>
                        <span>${token.value.toLocaleString()}</span>
                      </div>
                      
                      <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            token.symbol === 'BTC' 
                              ? 'bg-yellow-500' 
                              : token.symbol === 'ETH' 
                              ? 'bg-blue-500' 
                              : 'bg-primary'
                          }`}
                          style={{ 
                            width: `${(token.value / tokens.reduce((sum, t) => sum + t.value, 0)) * 100}%` 
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="pt-2">
                  <div className="bg-muted p-3 rounded-md text-sm">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Cashout Notice</p>
                        <p className="text-muted-foreground">
                          Cashout requests are processed within 1-3 business days. Fees may apply based on your selected method.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              Cashout History
            </h3>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Token</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                      No cashout history available
                    </TableCell>
                  </TableRow>
                ) : (
                  history.map(cashout => (
                    <TableRow key={cashout.id}>
                      <TableCell>{cashout.timestamp}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs">
                            {cashout.token.charAt(0)}
                          </div>
                          {cashout.token}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>{cashout.amount.toFixed(4)} {cashout.token}</div>
                        <div className="text-sm text-muted-foreground">
                          ≈ ${cashout.fiatAmount.toFixed(2)} USD
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {cashout.method === 'bank' ? 'Bank Transfer' : 'PayPal'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          className={
                            cashout.status === 'completed' 
                              ? 'bg-green-500/20 text-green-700' 
                              : cashout.status === 'pending' 
                              ? 'bg-yellow-500/20 text-yellow-700' 
                              : 'bg-red-500/20 text-red-700'
                          }
                        >
                          {cashout.status === 'completed' ? (
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                          ) : cashout.status === 'pending' ? (
                            <Clock className="h-3 w-3 mr-1" />
                          ) : (
                            <AlertCircle className="h-3 w-3 mr-1" />
                          )}
                          {cashout.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Cashout;
