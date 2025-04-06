
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
  ArrowLeftRight, 
  ChevronDown, 
  ArrowDownUp,
  DollarSign,
  BarChart3,
  Landmark,
  Clock,
} from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/blockchain-utils';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TradeHistory {
  id: string;
  tokenFrom: string;
  tokenTo: string;
  amountFrom: number;
  amountTo: number;
  rate: number;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
}

const Trading: React.FC = () => {
  const [fromToken, setFromToken] = useState('MINT');
  const [toToken, setToToken] = useState('BTC');
  const [fromAmount, setFromAmount] = useState('0');
  const [toAmount, setToAmount] = useState('0');
  const [tradeHistory, setTradeHistory] = useState<TradeHistory[]>([
    {
      id: 'trade-001',
      tokenFrom: 'MINT',
      tokenTo: 'ETH',
      amountFrom: 500,
      amountTo: 0.25,
      rate: 0.0005,
      timestamp: '2025-04-06 12:30:20',
      status: 'completed'
    },
    {
      id: 'trade-002',
      tokenFrom: 'MINT',
      tokenTo: 'BTC',
      amountFrom: 1000,
      amountTo: 0.02,
      rate: 0.00002,
      timestamp: '2025-04-05 16:45:10',
      status: 'completed'
    },
    {
      id: 'trade-003',
      tokenFrom: 'ETH',
      tokenTo: 'MINT',
      amountFrom: 0.1,
      amountTo: 200,
      rate: 2000,
      timestamp: '2025-04-04 09:12:45',
      status: 'completed'
    }
  ]);

  const tokens = [
    { symbol: 'MINT', name: 'Mintopia', balance: 2500, value: 2500 },
    { symbol: 'BTC', name: 'Bitcoin', balance: 0.05, value: 3000 },
    { symbol: 'ETH', name: 'Ethereum', balance: 0.75, value: 1875 },
    { symbol: 'SOL', name: 'Solana', balance: 10, value: 1200 },
    { symbol: 'USDT', name: 'Tether', balance: 1000, value: 1000 }
  ];

  const handleCalculateExchange = (amount: string, from: string, to: string) => {
    const rates: Record<string, Record<string, number>> = {
      'MINT': { 'BTC': 0.00002, 'ETH': 0.0005, 'SOL': 0.01, 'USDT': 1 },
      'BTC': { 'MINT': 50000, 'ETH': 25, 'SOL': 500, 'USDT': 50000 },
      'ETH': { 'MINT': 2000, 'BTC': 0.04, 'SOL': 20, 'USDT': 2000 },
      'SOL': { 'MINT': 100, 'BTC': 0.002, 'ETH': 0.05, 'USDT': 100 },
      'USDT': { 'MINT': 1, 'BTC': 0.00002, 'ETH': 0.0005, 'SOL': 0.01 }
    };

    if (from === to) return '0';
    
    const rate = rates[from][to];
    const result = parseFloat(amount) * rate;
    return isNaN(result) ? '0' : result.toString();
  };

  const handleAmountChange = (amount: string) => {
    setFromAmount(amount);
    setToAmount(handleCalculateExchange(amount, fromToken, toToken));
  };

  const handleFromTokenChange = (token: string) => {
    setFromToken(token);
    setToAmount(handleCalculateExchange(fromAmount, token, toToken));
  };

  const handleToTokenChange = (token: string) => {
    setToToken(token);
    setToAmount(handleCalculateExchange(fromAmount, fromToken, token));
  };

  const handleSwapTokens = () => {
    const tempToken = fromToken;
    setFromToken(toToken);
    setToToken(tempToken);
    
    const tempAmount = fromAmount;
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  };

  const handleExecuteTrade = () => {
    if (parseFloat(fromAmount) <= 0) {
      toast.error('Please enter a valid amount to trade');
      return;
    }

    // Check if user has enough balance
    const token = tokens.find(t => t.symbol === fromToken);
    if (!token || token.balance < parseFloat(fromAmount)) {
      toast.error(`Insufficient ${fromToken} balance for this trade`);
      return;
    }

    toast.info('Processing trade...');

    // Simulate API call delay
    setTimeout(() => {
      const newTrade: TradeHistory = {
        id: `trade-${Math.random().toString(36).substring(2, 7)}`,
        tokenFrom: fromToken,
        tokenTo: toToken,
        amountFrom: parseFloat(fromAmount),
        amountTo: parseFloat(toAmount),
        rate: parseFloat(toAmount) / parseFloat(fromAmount),
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        status: 'completed'
      };

      setTradeHistory([newTrade, ...tradeHistory]);
      toast.success('Trade executed successfully');
      
      // Reset form
      setFromAmount('0');
      setToAmount('0');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowLeftRight className="h-5 w-5 text-primary" />
            Token Exchange
          </CardTitle>
          <CardDescription>
            Trade your tokens and coins with other cryptocurrencies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="p-6 border rounded-lg space-y-6">
                <div className="grid grid-cols-5 gap-4">
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="from-token">From</Label>
                    <Select 
                      value={fromToken} 
                      onValueChange={handleFromTokenChange}
                    >
                      <SelectTrigger>
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
                      Balance: {tokens.find(t => t.symbol === fromToken)?.balance.toFixed(8)} {fromToken}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={handleSwapTokens}
                      className="rounded-full h-10 w-10"
                    >
                      <ArrowDownUp className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="to-token">To</Label>
                    <Select 
                      value={toToken} 
                      onValueChange={handleToTokenChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select token" />
                      </SelectTrigger>
                      <SelectContent>
                        {tokens.map(token => (
                          <SelectItem key={token.symbol} value={token.symbol} disabled={token.symbol === fromToken}>
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
                      Balance: {tokens.find(t => t.symbol === toToken)?.balance.toFixed(8)} {toToken}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="from-amount">You send</Label>
                    <Input
                      id="from-amount"
                      type="number"
                      placeholder="0.00"
                      value={fromAmount}
                      onChange={(e) => handleAmountChange(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="to-amount">You receive</Label>
                    <Input
                      id="to-amount"
                      type="number"
                      placeholder="0.00"
                      value={toAmount}
                      readOnly
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Exchange Rate</span>
                    <span>1 {fromToken} = {handleCalculateExchange('1', fromToken, toToken)} {toToken}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Transaction Fee</span>
                    <span>0.1%</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleExecuteTrade}
                  disabled={parseFloat(fromAmount) <= 0}
                >
                  Execute Trade
                </Button>
              </div>
            </div>
            
            <div>
              <div className="border rounded-lg p-4 space-y-4">
                <h3 className="font-medium text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-muted-foreground" />
                  Market Overview
                </h3>
                
                <div className="space-y-4">
                  {tokens.map(token => (
                    <div key={token.symbol} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs">
                          {token.symbol.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">{token.symbol}</div>
                          <div className="text-xs text-muted-foreground">{token.name}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${token.symbol === 'BTC' ? '60,000' : token.symbol === 'ETH' ? '2,500' : '1.00'}</div>
                        <div className={`text-xs ${token.symbol === 'BTC' || token.symbol === 'ETH' ? 'text-green-600' : 'text-muted-foreground'}`}>
                          {token.symbol === 'BTC' ? '+2.3%' : token.symbol === 'ETH' ? '+1.5%' : '0%'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              Trade History
            </h3>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Pair</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tradeHistory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                      No trade history available
                    </TableCell>
                  </TableRow>
                ) : (
                  tradeHistory.map(trade => (
                    <TableRow key={trade.id}>
                      <TableCell>{trade.timestamp}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {trade.tokenFrom} → {trade.tokenTo}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>{trade.amountFrom.toFixed(4)} {trade.tokenFrom}</div>
                        <div className="text-sm text-muted-foreground">
                          for {trade.amountTo.toFixed(4)} {trade.tokenTo}
                        </div>
                      </TableCell>
                      <TableCell>
                        1 {trade.tokenFrom} = {trade.rate.toFixed(6)} {trade.tokenTo}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          className={
                            trade.status === 'completed' 
                              ? 'bg-green-500/20 text-green-700' 
                              : trade.status === 'pending' 
                              ? 'bg-yellow-500/20 text-yellow-700' 
                              : 'bg-red-500/20 text-red-700'
                          }
                        >
                          {trade.status}
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

export default Trading;
