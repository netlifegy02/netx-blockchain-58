
import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from './button';

interface CopyCommandProps {
  value: string;
  className?: string;
  displayValue?: string;
}

export function CopyCommand({ value, className, displayValue }: CopyCommandProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn(
      "flex items-center border rounded-md overflow-hidden bg-muted/50", 
      className
    )}>
      <pre className="p-2 overflow-x-auto flex-1 text-xs md:text-sm">
        {displayValue || value}
      </pre>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={copyToClipboard} 
        className="h-full rounded-l-none border-l"
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  );
}

export default CopyCommand;
