
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

// New function to mark user account as fully set up
export const markAccountAsSetup = () => {
  try {
    const authData = localStorage.getItem('auth');
    if (!authData) return false;
    
    const parsed = JSON.parse(authData);
    
    localStorage.setItem('auth', JSON.stringify({
      ...parsed,
      user: {
        ...parsed.user,
        isFullySetup: true
      }
    }));
    
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
      
      // Mark existing accounts as set up
      if (currentUser) {
        markAccountAsSetup();
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error checking if account is fully set up:', error);
    return false;
  }
};
