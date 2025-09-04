// Authentication utilities
export const getStoredAuth = () => {
  try {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    const currentUser = localStorage.getItem('currentUser');
    
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      // Ensure we have the tokens in the userData
      if (token && !userData.token) {
        userData.token = token;
      }
      if (refreshToken && !userData.refreshToken) {
        userData.refreshToken = refreshToken;
      }
      return userData;
    }
    
    if (token) {
      return { token, refreshToken };
    }
    
    return null;
  } catch (error) {
    console.error('Error reading stored auth:', error);
    return null;
  }
};

export const clearStoredAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('currentUser');
  localStorage.removeItem('tokenExpiry');
};

export const setStoredAuth = (authData) => {
  if (authData.token) {
    localStorage.setItem('token', authData.token);
    // Set token expiry time (7 days from now)
    const expiryTime = Date.now() + (7 * 24 * 60 * 60 * 1000);
    localStorage.setItem('tokenExpiry', expiryTime.toString());
  }
  if (authData.refreshToken) {
    localStorage.setItem('refreshToken', authData.refreshToken);
  }
  localStorage.setItem('currentUser', JSON.stringify(authData));
};

// Check if token is expired or about to expire (refresh if less than 1 day remaining)
export const isTokenExpired = () => {
  try {
    const tokenExpiry = localStorage.getItem('tokenExpiry');
    if (!tokenExpiry) return true;
    
    const expiryTime = parseInt(tokenExpiry, 10);
    const timeRemaining = expiryTime - Date.now();
    
    // Return true if token expires in less than 1 day
    return timeRemaining < (24 * 60 * 60 * 1000);
  } catch (error) {
    console.error('Error checking token expiry:', error);
    return true;
  }
};

export const shouldRefreshToken = () => {
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');
  return token && refreshToken && isTokenExpired();
};
