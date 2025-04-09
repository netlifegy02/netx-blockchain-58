
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  KeyRound, 
  Lock, 
  Shield, 
  AlertTriangle, 
  Fingerprint,
  Check,
  X
} from 'lucide-react';
import { toast } from 'sonner';

interface AppLockScreenProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUnlock: () => void;
  appName: string;
}

const AppLockScreen: React.FC<AppLockScreenProps> = ({
  open,
  onOpenChange,
  onUnlock,
  appName
}) => {
  const [lockType, setLockType] = useState<'pin' | 'pattern'>('pin');
  const [pin, setPin] = useState('');
  const [pattern, setPattern] = useState<number[]>([]);
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  
  // Get stored pin or pattern from localStorage
  useEffect(() => {
    const storedLockType = localStorage.getItem('appLockType');
    if (storedLockType === 'pin' || storedLockType === 'pattern') {
      setLockType(storedLockType);
    }
    
    // Reset attempts when opening
    if (open) {
      setIncorrectAttempts(0);
      setPin('');
      setPattern([]);
    }
  }, [open]);
  
  // Lock the screen after 5 incorrect attempts
  useEffect(() => {
    if (incorrectAttempts >= 5) {
      setIsLocked(true);
      
      // Auto unlock after 30 seconds
      const timer = setTimeout(() => {
        setIsLocked(false);
        setIncorrectAttempts(0);
      }, 30000);
      
      return () => clearTimeout(timer);
    }
  }, [incorrectAttempts]);
  
  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow digits
    if (/^\d*$/.test(value) && value.length <= 6) {
      setPin(value);
    }
  };
  
  const handlePatternDot = (index: number) => {
    if (pattern.includes(index)) {
      // Remove this dot and all dots after it
      const dotIndex = pattern.indexOf(index);
      setPattern(pattern.slice(0, dotIndex));
    } else {
      // Add this dot
      setPattern([...pattern, index]);
    }
  };
  
  const handleUnlock = () => {
    let isCorrect = false;
    
    if (lockType === 'pin') {
      // For demo, use "123456" as the correct PIN
      const correctPin = localStorage.getItem('appLockPin') || '123456';
      isCorrect = pin === correctPin;
    } else {
      // For demo, use [0,1,2,5,8] as the correct pattern
      const correctPattern = JSON.parse(localStorage.getItem('appLockPattern') || '[0,1,2,5,8]');
      isCorrect = JSON.stringify(pattern) === JSON.stringify(correctPattern);
    }
    
    if (isCorrect) {
      toast.success('App unlocked successfully');
      onUnlock();
      onOpenChange(false);
    } else {
      setIncorrectAttempts(prev => prev + 1);
      toast.error(`Incorrect ${lockType}. Attempts remaining: ${4 - incorrectAttempts}`);
      
      // Clear the input
      setPin('');
      setPattern([]);
    }
  };
  
  const renderPatternDot = (index: number) => {
    const isSelected = pattern.includes(index);
    const isLastSelected = pattern.length > 0 && pattern[pattern.length - 1] === index;
    
    return (
      <div 
        key={index} 
        className={`w-12 h-12 rounded-full border-2 flex items-center justify-center
          ${isSelected ? 'bg-primary border-primary' : 'border-gray-300 dark:border-gray-600'}
          transition-all duration-200 cursor-pointer`}
        onClick={() => !isLocked && handlePatternDot(index)}
      >
        {isLastSelected && <div className="w-3 h-3 bg-white rounded-full"></div>}
      </div>
    );
  };
  
  return (
    <Dialog open={open} onOpenChange={(value) => {
      // Prevent closing the dialog by clicking outside
      if (!value) return;
      onOpenChange(value);
    }}>
      <DialogContent className="sm:max-w-md" onInteractOutside={e => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-2 text-center">
            <Lock className="h-5 w-5" />
            <span>{appName} is locked</span>
          </DialogTitle>
        </DialogHeader>
        
        {isLocked ? (
          <div className="p-6 text-center space-y-4">
            <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto" />
            <h3 className="text-xl font-bold">Too many attempts</h3>
            <p className="text-muted-foreground">
              App is temporarily locked due to multiple incorrect attempts.
              Please try again in 30 seconds.
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-6">
            <div className="flex justify-center">
              <Tabs
                defaultValue={lockType}
                onValueChange={(v) => setLockType(v as 'pin' | 'pattern')}
                className="w-full"
              >
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="pin" className="flex items-center gap-2">
                    <KeyRound className="h-4 w-4" />
                    PIN Code
                  </TabsTrigger>
                  <TabsTrigger value="pattern" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Pattern
                  </TabsTrigger>
                </TabsList>
                
                {lockType === 'pin' && (
                  <div className="mt-6 space-y-4">
                    <div className="text-center mb-2">
                      <p className="text-sm text-muted-foreground">Enter your 6-digit PIN</p>
                    </div>
                    
                    <div className="flex justify-center mb-4">
                      <Input
                        type="password"
                        value={pin}
                        onChange={handlePinChange}
                        className="text-center text-2xl tracking-widest w-40"
                        placeholder="******"
                        autoFocus
                      />
                    </div>
                    
                    <div className="flex justify-center space-x-4">
                      <Button 
                        variant="outline" 
                        onClick={() => setPin('')}
                        disabled={pin.length === 0}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Clear
                      </Button>
                      <Button 
                        onClick={handleUnlock}
                        disabled={pin.length < 4}
                      >
                        <Fingerprint className="h-4 w-4 mr-2" />
                        Unlock
                      </Button>
                    </div>
                  </div>
                )}
                
                {lockType === 'pattern' && (
                  <div className="mt-6 space-y-4">
                    <div className="text-center mb-2">
                      <p className="text-sm text-muted-foreground">Draw your unlock pattern</p>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 max-w-[240px] mx-auto">
                      {Array.from({ length: 9 }).map((_, i) => renderPatternDot(i))}
                    </div>
                    
                    <div className="flex justify-center space-x-4 mt-4">
                      <Button 
                        variant="outline" 
                        onClick={() => setPattern([])}
                        disabled={pattern.length === 0}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Clear
                      </Button>
                      <Button 
                        onClick={handleUnlock}
                        disabled={pattern.length < 4}
                      >
                        <Fingerprint className="h-4 w-4 mr-2" />
                        Unlock
                      </Button>
                    </div>
                  </div>
                )}
              </Tabs>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AppLockScreen;
