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
    
    const updatedAuth = {
      ...parsed,
      user: {
        ...parsed.user,
        ...updates
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
            ...updates
          };
        }
        return user;
      });
      
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    }
    
    // Update the registered users as well
    const registeredUsers = localStorage.getItem('registeredUsers');
    if (registeredUsers) {
      const parsedRegisteredUsers = JSON.parse(registeredUsers);
      const updatedRegisteredUsers = parsedRegisteredUsers.map((user: any) => {
        if (user.username === parsed.user.username) {
          return {
            ...user,
            ...updates
          };
        }
        return user;
      });
      
      localStorage.setItem('registeredUsers', JSON.stringify(updatedRegisteredUsers));
    }
    
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
    return parsed?.user?.isAdmin === true || parsed?.user?.role === 'admin';
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
    
    // Also update the registeredUsers array
    const registeredUsers = localStorage.getItem('registeredUsers');
    if (registeredUsers) {
      const parsedRegisteredUsers = JSON.parse(registeredUsers);
      const updatedRegisteredUsers = parsedRegisteredUsers.map((user: any) => {
        if (user.username === parsed.user.username) {
          return {
            ...user,
            isFullySetup: true
          };
        }
        return user;
      });
      
      localStorage.setItem('registeredUsers', JSON.stringify(updatedRegisteredUsers));
    }
    
    // Update admin setup in securityConfig to track setup completion
    let securityConfig = {};
    try {
      const existingConfig = localStorage.getItem('securityConfig');
      if (existingConfig) {
        securityConfig = JSON.parse(existingConfig);
      }
      
      securityConfig = {
        ...securityConfig,
        adminSetupComplete: true
      };
      
      localStorage.setItem('securityConfig', JSON.stringify(securityConfig));
    } catch (err) {
      console.error('Error updating security config:', err);
    }
    
    // Ensure we have a default wallet set up
    const userWallet = localStorage.getItem('userWallet');
    if (!userWallet) {
      // Create a mock wallet if none exists
      const mockWallet = {
        address: '0x' + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
        privateKey: Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
        mnemonic: 'abandon ability able about above absent absorb abstract absurd abuse access accident'.split(' ').join(' ')
      };
      localStorage.setItem('userWallet', JSON.stringify(mockWallet));
    }
    
    console.log('Account marked as fully set up');
    return true;
  } catch (error) {
    console.error('Error marking account as set up:', error);
    return false;
  }
};

// Check if user account is fully set up - improved version
export const isAccountFullySetup = (): boolean => {
  try {
    // Check if admin setup is complete in security config
    const securityConfig = localStorage.getItem('securityConfig');
    if (securityConfig) {
      const parsedConfig = JSON.parse(securityConfig);
      if (parsedConfig.adminSetupComplete === true) {
        return true;
      }
    }
    
    // Check if the current user is marked as fully set up
    const authData = localStorage.getItem('auth');
    if (authData) {
      const parsed = JSON.parse(authData);
      if (parsed?.user?.isFullySetup === true) {
        return true;
      }
      
      // Check if the user's full profile exists
      const userProfile = localStorage.getItem('userProfile');
      if (userProfile) {
        return true;
      }
      
      // For registered users, check if they're fully set up
      const registeredUsers = localStorage.getItem('registeredUsers');
      if (registeredUsers) {
        const parsedUsers = JSON.parse(registeredUsers);
        const currentUser = parsedUsers.find((u: any) => u.username === parsed?.user?.username);
        if (currentUser?.isFullySetup === true) {
          return true;
        }
      }
      
      // Check if the user is in the admin list
      const adminUsers = localStorage.getItem('adminUsers');
      if (adminUsers) {
        const parsedAdmins = JSON.parse(adminUsers);
        if (parsed?.user?.username && parsedAdmins.includes(parsed.user.username)) {
          return true;
        }
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
    
    // Get security config
    const securityConfig = localStorage.getItem('securityConfig') || '{}';
    const parsedSecurityConfig = JSON.parse(securityConfig);
    
    // Get Google Drive config
    const driveConfig = localStorage.getItem('googleDriveConfig') || '{}';
    const parsedDriveConfig = JSON.parse(driveConfig);
    
    // Get registered users
    const registeredUsers = localStorage.getItem('registeredUsers') || '[]';
    const parsedRegisteredUsers = JSON.parse(registeredUsers);
    
    // Get admin users
    const adminUsers = localStorage.getItem('adminUsers') || '[]';
    const parsedAdminUsers = JSON.parse(adminUsers);
    
    const setupTasks = {
      accountInfo: false,
      googleDrive: false,
      security: false,
      users: false,
    };
    
    // Check account setup
    const authData = localStorage.getItem('auth');
    if (authData) {
      const parsed = JSON.parse(authData);
      setupTasks.accountInfo = parsed?.user?.isFullySetup === true || 
                            parsedSecurityConfig.adminSetupComplete === true;
    }
    
    // Check Google Drive setup
    setupTasks.googleDrive = parsedDriveConfig.isConnected === true;
    
    // Check security setup
    setupTasks.security = parsedSecurityConfig.securitySetupComplete === true;
    
    // Check user management setup
    setupTasks.users = parsedAdminUsers.length > 0 || 
                     parsedRegisteredUsers.length > 1 ||
                     parsedSecurityConfig.usersSetupComplete === true;
    
    return setupTasks;
  } catch (error) {
    console.error('Error getting setup completion status:', error);
    return null;
  }
};

// Function to update security settings (a shortcut to updating some security config values)
export const updateSecuritySettings = (settings: {[key: string]: any}) => {
  try {
    const securityConfig = localStorage.getItem('securityConfig') || '{}';
    const parsedConfig = JSON.parse(securityConfig);
    
    const updatedConfig = {
      ...parsedConfig,
      ...settings,
      securitySetupComplete: true
    };
    
    localStorage.setItem('securityConfig', JSON.stringify(updatedConfig));
    return true;
  } catch (error) {
    console.error('Error updating security settings:', error);
    return false;
  }
};

// Update Google Drive connection status - improved version
export const updateGoogleDriveConnection = (isConnected: boolean, email?: string) => {
  try {
    const driveConfig = localStorage.getItem('googleDriveConfig') || '{}';
    const parsedConfig = JSON.parse(driveConfig);
    
    const updatedConfig = {
      ...parsedConfig,
      isConnected,
      email: email || parsedConfig.email || 'user@example.com',
      setupComplete: true,
      lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem('googleDriveConfig', JSON.stringify(updatedConfig));
    
    // If connected, also update account setup status
    if (isConnected) {
      let securityConfig = {};
      try {
        const existingConfig = localStorage.getItem('securityConfig') || '{}';
        securityConfig = JSON.parse(existingConfig);
        
        securityConfig = {
          ...securityConfig,
          googleDriveConnected: true,
          adminSetupComplete: true // Ensure admin setup is marked as complete
        };
        
        localStorage.setItem('securityConfig', JSON.stringify(securityConfig));
        
        // Also mark the user's account as fully set up
        markAccountAsSetup();
      } catch (err) {
        console.error('Error updating security config:', err);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error updating Google Drive connection:', error);
    return false;
  }
};
