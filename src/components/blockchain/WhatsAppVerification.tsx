
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Phone, 
  MessageSquare, 
  Check, 
  RefreshCw,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface WhatsAppVerificationProps {
  phoneNumber?: string;
  isVerified?: boolean;
  onVerification?: (verified: boolean) => void;
}

const WhatsAppVerification: React.FC<WhatsAppVerificationProps> = ({ 
  phoneNumber: initialPhoneNumber = '', 
  isVerified: initialVerified = false,
  onVerification
}) => {
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerified, setIsVerified] = useState(initialVerified);
  const [codeSent, setCodeSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isEnabled, setIsEnabled] = useState(true);
  
  // Check if WhatsApp verification is enabled by admin
  useEffect(() => {
    const verificationEnabled = localStorage.getItem('whatsappVerificationEnabled');
    setIsEnabled(verificationEnabled !== 'false'); // Default to true if not set
  }, []);
  
  const handleSendCode = () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call to send verification code
    setTimeout(() => {
      setCodeSent(true);
      setIsLoading(false);
      setCountdown(60);
      
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      toast.success('Verification code sent to your WhatsApp');
    }, 1500);
  };
  
  const handleVerifyCode = () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error('Please enter a valid 6-digit verification code');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call to verify code
    setTimeout(() => {
      // For demo, we'll accept "123456" as the valid code
      if (verificationCode === '123456') {
        setIsVerified(true);
        if (onVerification) onVerification(true);
        toast.success('WhatsApp verification successful');
      } else {
        toast.error('Invalid verification code. Please try again');
      }
      
      setIsLoading(false);
    }, 1500);
  };
  
  const handleResendCode = () => {
    if (countdown > 0) return;
    handleSendCode();
  };
  
  // If WhatsApp verification is disabled, show a notice
  if (!isEnabled) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-muted-foreground" />
            WhatsApp Verification
          </CardTitle>
          <CardDescription>
            Verify your account with WhatsApp for enhanced security
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-md border border-muted-foreground/20">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">WhatsApp verification is currently disabled</p>
                <p className="text-sm text-muted-foreground mt-1">
                  The administrator has temporarily disabled WhatsApp verification for all users. 
                  Please check back later or contact support if you need assistance.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-green-600" />
          WhatsApp Verification
        </CardTitle>
        <CardDescription>
          Verify your account with WhatsApp for enhanced security
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isVerified ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-600">
              <ShieldCheck className="h-5 w-5" />
              <span className="font-medium">WhatsApp account verified</span>
            </div>
            
            <div className="bg-green-50 p-4 rounded-md border border-green-200">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-green-100 p-2">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Your WhatsApp is verified</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your account is now secured with WhatsApp verification. You'll receive
                    important notifications and security alerts on WhatsApp.
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{phoneNumber}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                setIsVerified(false);
                setCodeSent(false);
                setVerificationCode('');
                if (onVerification) onVerification(false);
              }}
            >
              Update Phone Number
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">WhatsApp Phone Number</Label>
              <div className="flex gap-2">
                <Input 
                  id="phone" 
                  placeholder="+1 234 567 8900"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={codeSent || isLoading}
                />
                {!codeSent ? (
                  <Button 
                    onClick={handleSendCode}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : 'Send Code'}
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    onClick={handleResendCode}
                    disabled={countdown > 0 || isLoading}
                  >
                    {countdown > 0 ? `Resend (${countdown}s)` : 'Resend Code'}
                  </Button>
                )}
              </div>
            </div>
            
            {codeSent && (
              <div className="space-y-2">
                <Label htmlFor="code">Verification Code</Label>
                <div className="flex gap-2">
                  <Input 
                    id="code" 
                    placeholder="6-digit code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                    maxLength={6}
                    disabled={isLoading}
                  />
                  <Button 
                    onClick={handleVerifyCode}
                    disabled={verificationCode.length !== 6 || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Verifying...
                      </>
                    ) : 'Verify'}
                  </Button>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  Please enter the 6-digit code sent to your WhatsApp number
                </p>
              </div>
            )}
            
            <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
              <div className="flex items-start gap-3">
                <MessageSquare className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm">
                  <p>For testing purposes, use the code <span className="font-medium">123456</span></p>
                  <p className="text-muted-foreground mt-1">
                    In a production environment, you would receive a real WhatsApp message with a verification code.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2">
        <div className="text-sm text-muted-foreground">
          Why verify your WhatsApp?
        </div>
        <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
          <li>Receive important security notifications</li>
          <li>Two-factor authentication for sensitive operations</li>
          <li>Get instant alerts on account activity</li>
          <li>Enhanced account recovery options</li>
        </ul>
      </CardFooter>
    </Card>
  );
};

export default WhatsAppVerification;
