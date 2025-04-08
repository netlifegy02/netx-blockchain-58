
export const isAuthenticated = (): boolean => {
  try {
    const authData = localStorage.getItem('auth');
    if (!authData) return false;
    
    const parsed = JSON.parse(authData);
    return parsed?.isAuthenticated === true;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

export const redirectIfNotAuthenticated = (navigate: any): boolean => {
  if (!isAuthenticated()) {
    navigate('/login');
    return true;
  }
  return false;
};

export const getUserInfo = () => {
  try {
    const authData = localStorage.getItem('auth');
    if (!authData) return null;
    
    const parsed = JSON.parse(authData);
    
    // Check if there's a profile picture in localStorage
    const profileImage = localStorage.getItem('userProfileImage');
    
    return {
      ...(parsed?.user || null),
      profileImage
    };
  } catch (error) {
    console.error('Error getting user info:', error);
    return null;
  }
};

export const updateUserInfo = (updates: any) => {
  try {
    const authData = localStorage.getItem('auth');
    if (!authData) return false;
    
    const parsed = JSON.parse(authData);
    
    localStorage.setItem('auth', JSON.stringify({
      ...parsed,
      user: {
        ...parsed.user,
        ...updates
      }
    }));
    
    return true;
  } catch (error) {
    console.error('Error updating user info:', error);
    return false;
  }
};

export const logout = (navigate: any) => {
  localStorage.removeItem('auth');
  navigate('/login');
};

// Check if the user is the first registered user (admin)
export const isFirstUser = (): boolean => {
  try {
    const users = localStorage.getItem('users');
    if (!users) return true; // No users yet, so first user will be admin
    
    const parsedUsers = JSON.parse(users);
    return parsedUsers.length === 0;
  } catch (error) {
    console.error('Error checking if first user:', error);
    return false;
  }
};

// Check if current user is an admin
export const isAdmin = (): boolean => {
  try {
    const authData = localStorage.getItem('auth');
    if (!authData) return false;
    
    const parsed = JSON.parse(authData);
    return parsed?.user?.isAdmin === true;
  } catch (error) {
    console.error('Error checking if admin:', error);
    return false;
  }
};

// Check if username is available
export const isUsernameAvailable = (username: string): boolean => {
  try {
    const users = localStorage.getItem('users');
    if (!users) return true; // No users yet
    
    const parsedUsers = JSON.parse(users);
    return !parsedUsers.some((user: any) => 
      user.username?.toLowerCase() === username.toLowerCase()
    );
  } catch (error) {
    console.error('Error checking username availability:', error);
    return false;
  }
};

// Updated function to mark user account as fully set up
export const markAccountAsSetup = () => {
  try {
    const authData = localStorage.getItem('auth');
    if (!authData) return false;
    
    const parsed = JSON.parse(authData);
    
    const updatedAuth = {
      ...parsed,
      user: {
        ...parsed.user,
        isFullySetup: true
      }
    };
    
    localStorage.setItem('auth', JSON.stringify(updatedAuth));
    
    // Also update the user in the users array if it exists
    const users = localStorage.getItem('users');
    if (users) {
      const parsedUsers = JSON.parse(users);
      const updatedUsers = parsedUsers.map((user: any) => {
        if (user.username === parsed.user.username) {
          return {
            ...user,
            isFullySetup: true
          };
        }
        return user;
      });
      
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    }
    
    console.log('Account marked as fully set up');
    return true;
  } catch (error) {
    console.error('Error marking account as set up:', error);
    return false;
  }
};

// Check if user account is fully set up
export const isAccountFullySetup = (): boolean => {
  try {
    const authData = localStorage.getItem('auth');
    if (!authData) return false;
    
    const parsed = JSON.parse(authData);
    
    // If the isFullySetup flag exists and is true, return true
    if (parsed?.user?.isFullySetup === true) return true;
    
    // For backward compatibility with existing accounts
    const users = localStorage.getItem('users');
    if (users) {
      const parsedUsers = JSON.parse(users);
      const currentUser = parsedUsers.find((u: any) => u.username === parsed?.user?.username);
      
      if (currentUser?.isFullySetup === true) {
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error checking if account is fully set up:', error);
    return false;
  }
};

// New function to convert file to base64 string for profile image storage
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
};

// Get setup completion status for admin dashboard
export const getSetupCompletionStatus = () => {
  try {
    if (!isAdmin()) return null;
    
    const setupTasks = {
      accountInfo: isAccountFullySetup(),
      googleDrive: false,
      security: false,
      users: false,
    };
    
    // Check Google Drive setup
    const driveConfig = localStorage.getItem('googleDriveConfig');
    if (driveConfig) {
      const parsedConfig = JSON.parse(driveConfig);
      setupTasks.googleDrive = parsedConfig.isConnected === true;
    }
    
    // Check security setup
    const securityConfig = localStorage.getItem('securityConfig');
    if (securityConfig) {
      setupTasks.security = true;
    }
    
    // Check if any users have been added by admin
    const users = localStorage.getItem('users');
    if (users) {
      const parsedUsers = JSON.parse(users);
      setupTasks.users = parsedUsers.length > 1; // More than just the admin
    }
    
    return setupTasks;
  } catch (error) {
    console.error('Error getting setup completion status:', error);
    return null;
  }
};
