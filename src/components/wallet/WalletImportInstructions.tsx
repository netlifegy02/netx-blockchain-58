
import React, { useState, useEffect, ChangeEvent } from 'react';
import { Check, Clipboard, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';

interface WalletImportInstructionsProps {
  onImport?: (phrase: string) => void;
  walletName?: string;
  open?: boolean;
  onOpenChange?: () => void;
  recoveryPhrase?: string;
}

export const WalletImportInstructions: React.FC<WalletImportInstructionsProps> = ({ 
  onImport, 
  walletName, 
  open,
  onOpenChange,
  recoveryPhrase: initialPhrase 
}) => {
  const [recoveryPhrase, setRecoveryPhrase] = useState(initialPhrase || '');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [copied, setCopied] = useState(false);
  
  // Sample recovery phrase for demonstration
  const samplePhrase = "medal device machine glance memory detail flee forest sponsor license swamp review";
  
  useEffect(() => {
    if (initialPhrase) {
      setRecoveryPhrase(initialPhrase);
    }
  }, [initialPhrase]);

  const handleCopy = () => {
    navigator.clipboard.writeText(samplePhrase);
    setCopied(true);
    toast.success('Sample phrase copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };
  
  const validateRecoveryPhrase = (phrase: string): boolean => {
    // Check if phrase is empty
    if (!phrase.trim()) {
      setValidationError('Recovery phrase cannot be empty');
      return false;
    }
    
    // Basic validation: check for 12 words separated by spaces
    const words = phrase.trim().split(/\s+/);
    if (words.length !== 12) {
      setValidationError('Recovery phrase must contain exactly 12 words');
      return false;
    }
    
    // Check if all words match the expected pattern (only letters)
    const wordPattern = /^[a-zA-Z]+$/;
    const invalidWords = words.filter(word => !wordPattern.test(word));
    if (invalidWords.length > 0) {
      setValidationError('Recovery phrase contains invalid characters');
      return false;
    }
    
    // Passed validation
    setValidationError('');
    return true;
  };
  
  const handleImport = () => {
    if (validateRecoveryPhrase(recoveryPhrase)) {
      toast.success('Wallet successfully imported');
      if (onImport) {
        onImport(recoveryPhrase);
      }
      
      // Update localStorage to mark wallet as imported
      localStorage.setItem('walletImported', 'true');
      
      // Record timestamp of import
      localStorage.setItem('walletImportTimestamp', new Date().toISOString());
      
      // Store wallet address (in production this would be derived from the phrase)
      localStorage.setItem('walletAddress', `0x${Math.random().toString(16).substr(2, 40)}`);
      
      // Store the recovery phrase in localStorage
      localStorage.setItem('walletRecoveryPhrase', recoveryPhrase);
      
      // Close sheet if open
      if (onOpenChange) {
        onOpenChange();
      }
    } else {
      toast.error('Invalid recovery phrase');
    }
  };
  
  // Render as Sheet if open prop is provided
  if (typeof open !== 'undefined') {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Import to {walletName}</SheetTitle>
            <SheetDescription>
              Enter your 12-word recovery phrase to import your wallet
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="font-medium text-sm">Recovery Phrase</div>
                <label className="flex items-center text-xs text-muted-foreground">
                  <input 
                    type="checkbox" 
                    className="mr-2" 
                    checked={passwordVisible}
                    onChange={() => setPasswordVisible(!passwordVisible)}
                  />
                  Show recovery phrase
                </label>
              </div>
              <Textarea
                id="recovery-phrase"
                placeholder="Enter your 12-word recovery phrase separated by spaces"
                className="mt-1 resize-none font-mono"
                rows={3}
                value={passwordVisible ? recoveryPhrase : '• • • • • • • • • • • •'}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                  if (passwordVisible) {
                    setRecoveryPhrase(e.target.value);
                    if (validationError) validateRecoveryPhrase(e.target.value);
                  }
                }}
              />
            </div>
            
            {validationError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {validationError}
                </AlertDescription>
              </Alert>
            )}
            
            <Button 
              onClick={handleImport} 
              className="w-full"
              disabled={!passwordVisible || !recoveryPhrase.trim()}
            >
              Import to {walletName}
            </Button>
            
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Security Notice</AlertTitle>
              <AlertDescription>
                Never share your recovery phrase with anyone. It provides full access to your wallet.
              </AlertDescription>
            </Alert>
          </div>
        </SheetContent>
      </Sheet>
    );
  }
  
  // Standard display for the wallet import page
  return (
    <CardContent className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Import Your Existing Wallet</h3>
        <p className="text-sm text-muted-foreground">
          Enter your 12-word recovery phrase to access your existing crypto wallet.
        </p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="recovery-phrase" className="text-sm font-medium">
            Recovery Phrase
          </label>
          <Textarea
            id="recovery-phrase"
            placeholder="Enter your 12-word recovery phrase separated by spaces"
            className="mt-1 resize-none font-mono"
            rows={3}
            value={passwordVisible ? recoveryPhrase : '• • • • • • • • • • • •'}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
              if (passwordVisible) {
                setRecoveryPhrase(e.target.value);
                if (validationError) validateRecoveryPhrase(e.target.value);
              }
            }}
          />
          <div className="flex justify-between mt-1">
            <label className="flex items-center text-xs text-muted-foreground">
              <input 
                type="checkbox" 
                className="mr-2" 
                checked={passwordVisible}
                onChange={() => setPasswordVisible(!passwordVisible)}
              />
              Show recovery phrase
            </label>
            {validationError && (
              <p className="text-xs text-destructive">{validationError}</p>
            )}
          </div>
        </div>
        
        {validationError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {validationError}
            </AlertDescription>
          </Alert>
        )}
        
        <div>
          <Button 
            onClick={handleImport} 
            className="w-full"
            disabled={!passwordVisible || !recoveryPhrase.trim()}
          >
            Import Wallet
          </Button>
        </div>
      </div>
      
      <div className="border-t pt-4 space-y-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Don't have a recovery phrase?</h4>
          <p className="text-sm text-muted-foreground">
            If you're new to cryptocurrency or don't have an existing wallet, 
            you can use our sample recovery phrase for testing purposes:
          </p>
        </div>
        
        <div className="bg-muted p-3 rounded-md relative">
          <pre className="text-xs font-mono overflow-x-auto whitespace-pre-wrap break-all">
            {samplePhrase}
          </pre>
          <Button
            size="sm"
            variant="ghost"
            className="absolute right-2 top-2"
            onClick={handleCopy}
          >
            {copied ? <Check size={16} /> : <Clipboard size={16} />}
          </Button>
        </div>
        
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Important Security Notice</AlertTitle>
          <AlertDescription>
            Never share your real recovery phrase with anyone. The sample phrase provided here 
            is for demonstration purposes only and should not be used for actual funds.
          </AlertDescription>
        </Alert>
      </div>
    </CardContent>
  );
};

export default WalletImportInstructions;
