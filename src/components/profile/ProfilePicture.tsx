
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { Upload, X, Check } from 'lucide-react';

interface ProfilePictureProps {
  name: string;
  currentImage?: string;
  onImageChange?: (image: string) => void;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({
  name,
  currentImage,
  onImageChange
}) => {
  const [image, setImage] = useState<string | null>(currentImage || null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image is too large. Maximum size is 2MB.');
      return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed.');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreviewImage(result);
    };
    reader.readAsDataURL(file);
  };
  
  const handleUpload = () => {
    if (!previewImage) return;
    
    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      setImage(previewImage);
      setPreviewImage(null);
      setIsUploading(false);
      
      // Save to local storage
      localStorage.setItem('userProfileImage', previewImage);
      
      if (onImageChange) {
        onImageChange(previewImage);
      }
      
      toast.success('Profile picture updated successfully');
    }, 1500);
  };
  
  const handleCancel = () => {
    setPreviewImage(null);
  };
  
  const getInitials = (name: string) => {
    return name.split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Picture</CardTitle>
        <CardDescription>
          Upload a profile picture or company logo
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center justify-center gap-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={previewImage || image || undefined} />
            <AvatarFallback className="text-lg">{getInitials(name)}</AvatarFallback>
          </Avatar>
          
          {previewImage ? (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCancel}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button 
                size="sm"
                onClick={handleUpload}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>Uploading...</>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Save
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Label
                htmlFor="picture"
                className="cursor-pointer bg-primary/10 hover:bg-primary/20 text-primary py-2 px-4 rounded-md transition-colors flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Upload New Image
              </Label>
              <input
                type="file"
                id="picture"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              <p className="text-xs text-muted-foreground mt-2">
                JPEG, PNG or GIF • Max 2MB
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfilePicture;
