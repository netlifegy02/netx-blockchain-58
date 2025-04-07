
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
    return parsed?.user || null;
  } catch (error) {
    console.error('Error getting user info:', error);
    return null;
  }
};

export const logout = (navigate: any) => {
  localStorage.removeItem('auth');
  navigate('/login');
};
