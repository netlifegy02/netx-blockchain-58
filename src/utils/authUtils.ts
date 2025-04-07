
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
