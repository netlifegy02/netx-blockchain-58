
import React, { useState, useEffect } from 'react';
import { ADMIN_ACCOUNT } from '@/lib/blockchain-data';
import { Link } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { 
  Calendar, 
  MapPin, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  KeySquare,
  Wallet,
  MessageSquare,
  Info,
  Check,
  X,
  Shield
} from 'lucide-react';
import WhatsAppVerification from '@/components/blockchain/WhatsAppVerification';
import HumanVerification from '@/components/HumanVerification';
import { Checkbox } from '@/components/ui/checkbox';

const formSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phoneNumber: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
  dateOfBirth: z.string().min(1, {
    message: "Date of birth is required.",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  confirmPassword: z.string().min(8, {
    message: "Confirm password must be at least 8 characters.",
  }),
  humanVerificationComplete: z.boolean().refine(val => val === true, {
    message: "You must verify you are human."
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const RegisterPage = () => {
  const [recoveryPhrase, setRecoveryPhrase] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isWhatsappVerified, setIsWhatsappVerified] = useState(false);
  const [isWhatsappEnabled, setIsWhatsappEnabled] = useState(false);
  const [humanVerified, setHumanVerified] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      fullName: "",
      email: "",
      phoneNumber: "",
      dateOfBirth: "",
      location: "",
      password: "",
      confirmPassword: "",
      humanVerificationComplete: false
    },
  });
  
  useEffect(() => {
    // Pre-fill with admin account for demo purposes
    form.setValue('email', ADMIN_ACCOUNT.email);
    form.setValue('phoneNumber', ADMIN_ACCOUNT.phoneNumber);
    form.setValue('password', ADMIN_ACCOUNT.password);
    form.setValue('confirmPassword', ADMIN_ACCOUNT.password);
    form.setValue('username', ADMIN_ACCOUNT.username);
    
    // Check if WhatsApp verification is enabled
    const verificationEnabled = localStorage.getItem('whatsappVerificationEnabled');
    setIsWhatsappEnabled(verificationEnabled === 'true');
  }, [form]);

  // Update the form value when human verification status changes
  useEffect(() => {
    form.setValue('humanVerificationComplete', humanVerified);
  }, [humanVerified, form]);

  const generateRecoveryPhrase = () => {
    // Simulated recovery phrase generation
    const words = [
      'apple', 'banana', 'orange', 'grape', 'lemon', 'peach',
      'melon', 'cherry', 'mango', 'kiwi', 'plum', 'pear',
      'apricot', 'fig', 'lime', 'coconut', 'berry', 'avocado',
      'pineapple', 'watermelon', 'pomegranate', 'guava', 'papaya', 'persimmon'
    ];
    
    const selectedWords = [];
    for (let i = 0; i < 12; i++) {
      const randomIndex = Math.floor(Math.random() * words.length);
      selectedWords.push(words[randomIndex]);
    }
    
    return selectedWords.join(' ');
  };
  
  function onSubmit(values: z.infer<typeof formSchema>) {
    if (isWhatsappEnabled && !isWhatsappVerified) {
      toast.error('Please verify your WhatsApp number before registering');
      return;
    }
    
    if (!values.humanVerificationComplete) {
      toast.error('Please verify you are human before registering');
      return;
    }
    
    setIsLoading(true);
    
    // Generate wallet recovery phrase for new user
    const phrase = generateRecoveryPhrase();
    setRecoveryPhrase(phrase);
    
    // Simulate API call to register user
    setTimeout(() => {
      toast.success('Registration successful! Your wallet has been created.');
      
      // For the first user, set them as admin
      const existingUsers = localStorage.getItem('users');
      if (!existingUsers) {
        // This is the first user, make them an admin
        const newUser = {
          ...values,
          isAdmin: true,
          id: '1',
          createdAt: new Date().toISOString()
        };
        localStorage.setItem('users', JSON.stringify([newUser]));
        
        // Store auth data to auto-login
        localStorage.setItem('auth', JSON.stringify({
          isAuthenticated: true,
          user: newUser
        }));
        
        toast.success('You have been registered as the administrator!');
      } else {
        // Add regular user
        const users = JSON.parse(existingUsers);
        const newUser = {
          ...values,
          isAdmin: false,
          id: String(users.length + 1),
          createdAt: new Date().toISOString()
        };
        localStorage.setItem('users', JSON.stringify([...users, newUser]));
      }
      
      setIsLoading(false);
    }, 2000);
  }
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-background to-secondary/20 p-4">
      <div className="max-w-4xl w-full grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-2xl">Create an Account</CardTitle>
            <CardDescription>
              Register to start using Mintopia blockchain platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input className="pl-10" placeholder="johndoe123" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input className="pl-10" placeholder="John Doe" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input className="pl-10" placeholder="john@example.com" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input className="pl-10" placeholder="+1 234 567 8900" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input className="pl-10" type="date" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input className="pl-10" placeholder="City, Country" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div></div> {/* Empty div for spacing */}
                  
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input className="pl-10" type="password" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <KeySquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input className="pl-10" type="password" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-4 border border-border rounded-md p-4">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">Human Verification</h3>
                  </div>
                  
                  <HumanVerification onVerified={setHumanVerified} />
                  
                  <FormField
                    control={form.control}
                    name="humanVerificationComplete"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={!humanVerified}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            I confirm I have completed human verification
                          </FormLabel>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    A wallet will be automatically created for you upon registration.
                    Make sure to back up your recovery phrase once registered.
                  </p>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Account...
                    </>
                  ) : (
                    'Register'
                  )}
                </Button>
                
                {recoveryPhrase && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-md space-y-2">
                    <div className="flex items-start gap-2">
                      <Wallet className="h-5 w-5 text-amber-600 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-amber-800">Your Wallet Recovery Phrase</h3>
                        <p className="text-sm text-amber-700 mb-2">
                          Store this phrase safely. It's the only way to recover your wallet.
                        </p>
                        <div className="p-3 bg-white border border-amber-300 rounded font-mono text-sm break-all">
                          {recoveryPhrase}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between flex-wrap">
            <div className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <Link to="/maintenance" className="text-muted-foreground hover:text-primary">
                System Status
              </Link>
            </div>
          </CardFooter>
        </Card>
        
        <div className="lg:col-span-2 space-y-6">
          {isWhatsappEnabled ? (
            <WhatsAppVerification 
              phoneNumber={form.getValues().phoneNumber}
              isVerified={isWhatsappVerified}
              onVerification={setIsWhatsappVerified}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-muted-foreground" />
                  WhatsApp Verification
                </CardTitle>
                <CardDescription>
                  WhatsApp verification is currently disabled
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-md border border-muted-foreground/20">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">WhatsApp verification is currently disabled</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        The administrator has disabled WhatsApp verification for all users. 
                        You can proceed with registration without WhatsApp verification.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Administrator Account</CardTitle>
              <CardDescription>
                Pre-filled with the admin credentials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Username</div>
                  <div className="font-medium">{ADMIN_ACCOUNT.username}</div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Email</div>
                  <div className="font-medium">{ADMIN_ACCOUNT.email}</div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Phone</div>
                  <div className="font-medium">{ADMIN_ACCOUNT.phoneNumber}</div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Role</div>
                  <div className="font-medium text-primary">Administrator</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
