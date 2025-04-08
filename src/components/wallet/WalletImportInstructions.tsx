
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Copy, ExternalLink, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

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
  
  const copyToClipboard = () => {
    if (recoveryPhrase) {
      navigator.clipboard.writeText(recoveryPhrase);
      setCopied(true);
      toast.success('Recovery phrase copied to clipboard');
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
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
          
          {recoveryPhrase && (
            <>
              <Separator />
              <div className="space-y-2">
                <div className="text-sm font-medium">Your Recovery Phrase</div>
                <div className="rounded-md bg-muted p-3">
                  <div className="text-sm break-all font-mono">{recoveryPhrase}</div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full" 
                  onClick={copyToClipboard}
                >
                  {copied ? (
                    <Check className="mr-2 h-4 w-4" />
                  ) : (
                    <Copy className="mr-2 h-4 w-4" />
                  )}
                  {copied ? 'Copied' : 'Copy Recovery Phrase'}
                </Button>
              </div>
            </>
          )}
          
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
              window.open(
                walletName === 'Phantom Wallet'
                  ? 'https://phantom.app/download'
                  : walletName === 'Trust Wallet'
                  ? 'https://trustwallet.com/download'
                  : 'https://metamask.io/download/'
              );
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
