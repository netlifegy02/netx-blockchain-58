
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { getUserInfo, updateUserInfo } from '@/utils/authUtils';
import ProfilePicture from './ProfilePicture';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Separator } from "@/components/ui/separator";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  bio: z.string().max(160, "Bio must be 160 characters or less").optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      bio: "",
    },
  });
  
  useEffect(() => {
    const userInfo = getUserInfo();
    if (userInfo) {
      setUser(userInfo);
      
      // Update form values
      form.reset({
        name: userInfo.name || userInfo.username || "",
        email: userInfo.email || "",
        phone: userInfo.phone || "",
        bio: userInfo.bio || "",
      });
    }
  }, []);
  
  const onSubmit = (data: ProfileFormValues) => {
    updateUserInfo({
      name: data.name,
      email: data.email,
      phone: data.phone,
      bio: data.bio,
    });
    
    setUser((prev: any) => ({
      ...prev,
      name: data.name,
      email: data.email,
      phone: data.phone,
      bio: data.bio,
    }));
    
    toast.success("Profile updated successfully");
  };
  
  const handleProfileImageChange = (image: string) => {
    setUser((prev: any) => ({
      ...prev,
      profileImage: image
    }));
  };
  
  if (!user) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-pulse space-y-4 w-full max-w-2xl">
          <div className="h-8 bg-muted rounded-md w-1/3"></div>
          <div className="h-64 bg-muted rounded-md w-full"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <ProfilePicture 
            name={user.name || user.username || "User"} 
            currentImage={user.profileImage}
            onImageChange={handleProfileImageChange}
          />
        </div>
        
        <div className="md:w-2/3">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="John Doe" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="your@email.com" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="+1 (555) 123-4567" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Tell us about yourself" />
                        </FormControl>
                        <FormDescription>
                          Brief description for your profile. Max 160 characters.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Separator className="my-4" />
                  
                  <Button type="submit">
                    Save Changes
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
