
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Copy, ExternalLink, Check, AlertTriangle, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface WalletImportInstructionsProps {
  walletName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recoveryPhrase?: string;
}

const WalletImportInstructions: React.FC<WalletImportInstructionsProps> = ({
  walletName,
  open,
  onOpenChange,
  recoveryPhrase
}) => {
  const [copied, setCopied] = useState(false);
  const [customRecoveryPhrase, setCustomRecoveryPhrase] = useState('');
  const [phraseError, setPhraseError] = useState<string | null>(null);
  const [phraseValid, setPhraseValid] = useState(false);
  
  // Use the provided recoveryPhrase or the custom one
  const activePhrase = recoveryPhrase || customRecoveryPhrase;
  
  // Reset custom phrase when dialog opens/closes or when a new recoveryPhrase is provided
  useEffect(() => {
    if (recoveryPhrase) {
      setCustomRecoveryPhrase('');
      setPhraseError(null);
      // Auto-validate provided phrases
      validatePhraseFormat(recoveryPhrase);
    } else {
      setPhraseValid(false);
    }
  }, [open, recoveryPhrase]);
  
  const copyToClipboard = () => {
    if (activePhrase) {
      navigator.clipboard.writeText(activePhrase);
      setCopied(true);
      toast.success('Recovery phrase copied to clipboard');
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  // Helper function to check if a phrase matches the expected format
  const validatePhraseFormat = (phrase: string) => {
    if (!phrase.trim()) {
      setPhraseError('Please enter a recovery phrase');
      setPhraseValid(false);
      return false;
    }
    
    // Check if the phrase has the expected number of words (usually 12 or 24)
    const words = phrase.trim().split(/\s+/);
    const wordCount = words.length;
    
    if (wordCount !== 12 && wordCount !== 24) {
      setPhraseError(`Recovery phrase should have 12 or 24 words (currently has ${wordCount})`);
      setPhraseValid(false);
      return false;
    }
    
    // Check if all words are valid (only letters, no numbers or special chars)
    const invalidWords = words.filter(word => !/^[a-zA-Z]+$/.test(word));
    if (invalidWords.length > 0) {
      setPhraseError(`Recovery phrase contains invalid words (words should only contain letters)`);
      setPhraseValid(false);
      return false;
    }
    
    setPhraseError(null);
    setPhraseValid(true);
    return true;
  };

  const validatePhrase = () => {
    if (validatePhraseFormat(customRecoveryPhrase)) {
      toast.success('Recovery phrase validated successfully');
      return true;
    }
    return false;
  };

  const handleCustomPhraseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomRecoveryPhrase(e.target.value);
    if (phraseError) {
      setPhraseError(null);
      setPhraseValid(false);
    }
  };

  const getInstructions = () => {
    switch (walletName.toLowerCase()) {
      case 'phantom wallet':
        return [
          "Download Phantom Wallet from the App Store or Google Play.",
          "Open the app and select 'Import an existing wallet'.",
          "Enter your recovery phrase when prompted.",
          "Create a strong password for your wallet.",
          "Complete the setup and your wallet will be imported."
        ];
      case 'trust wallet':
        return [
          "Download Trust Wallet from the App Store or Google Play.",
          "Open the app and tap 'I already have a wallet'.",
          "Select 'Recovery phrase' and enter your phrase.",
          "Set up a PIN or biometric authentication.",
          "Your wallet will now be accessible in Trust Wallet."
        ];
      case 'metamask':
        return [
          "Download MetaMask from the App Store or Google Play.",
          "Open the app and tap 'Import using Secret Recovery Phrase'.",
          "Enter your 12-word recovery phrase.",
          "Create a new password.",
          "Review and accept the terms before completing setup."
        ];
      default:
        return [
          "Download the wallet app from the official source.",
          "Open the app and look for an import or restore option.",
          "Enter your recovery phrase when prompted.",
          "Set up security features as recommended.",
          "Your wallet should now be imported successfully."
        ];
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{walletName} Import Instructions</DialogTitle>
          <DialogDescription>
            Follow these steps to import your wallet to {walletName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-4">
            {getInstructions().map((instruction, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-primary text-xs text-primary-foreground">
                  {index + 1}
                </div>
                <p className="text-sm text-muted-foreground">{instruction}</p>
              </div>
            ))}
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <div className="text-sm font-medium">Your Recovery Phrase</div>
            {recoveryPhrase ? (
              <div className="rounded-md bg-muted p-3">
                <div className="text-sm break-all font-mono">{recoveryPhrase}</div>
                {phraseValid && (
                  <div className="flex items-center justify-center mt-2 text-green-600">
                    <ShieldCheck className="h-4 w-4 mr-1" />
                    <span className="text-xs">Valid recovery phrase</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <Input
                  placeholder="Enter your recovery phrase (12 or 24 words)"
                  value={customRecoveryPhrase}
                  onChange={handleCustomPhraseChange}
                  className="font-mono text-sm"
                />
                {phraseError && (
                  <Alert variant="destructive" className="py-2">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-xs ml-2">{phraseError}</AlertDescription>
                  </Alert>
                )}
                {phraseValid && (
                  <Alert variant="success" className="py-2 bg-green-50 border-green-200 text-green-800">
                    <ShieldCheck className="h-4 w-4" />
                    <AlertDescription className="text-xs ml-2">Recovery phrase is valid</AlertDescription>
                  </Alert>
                )}
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="w-full" 
                  onClick={validatePhrase}
                >
                  Validate Phrase
                </Button>
              </div>
            )}
            
            {activePhrase && (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full" 
                onClick={copyToClipboard}
                disabled={!phraseValid}
              >
                {copied ? (
                  <Check className="mr-2 h-4 w-4" />
                ) : (
                  <Copy className="mr-2 h-4 w-4" />
                )}
                {copied ? 'Copied' : 'Copy Recovery Phrase'}
              </Button>
            )}
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <div className="text-sm font-medium">Security Warning</div>
            <p className="text-sm text-muted-foreground">
              Never share your recovery phrase with anyone. Make sure you're on the official {walletName} website or app before entering your phrase.
            </p>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button
            variant="default"
            className="gap-1"
            onClick={() => {
              let url = '';
              switch(walletName.toLowerCase()) {
                case 'phantom wallet':
                  url = 'https://phantom.app/download';
                  break;
                case 'trust wallet':
                  url = 'https://trustwallet.com/download';
                  break;
                case 'metamask':
                  url = 'https://metamask.io/download/';
                  break;
                default:
                  url = 'https://google.com/search?q=' + encodeURIComponent(walletName + ' download');
              }
              window.open(url);
            }}
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            Download {walletName}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WalletImportInstructions;
