// Authentication utilities
export const getStoredAuth = () => {
  try {
    const token = localStorage.getItem('token');
    const currentUser = localStorage.getItem('currentUser');
    
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      // Ensure we have the token in the userData
      if (token && !userData.token) {
        userData.token = token;
      }
      return userData;
    }
    
    if (token) {
      return { token };
    }
    
    return null;
  } catch (error) {
    console.error('Error reading stored auth:', error);
    return null;
  }
};

export const clearStoredAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('currentUser');
};

export const setStoredAuth = (authData) => {
  if (authData.token) {
    localStorage.setItem('token', authData.token);
  }
  localStorage.setItem('currentUser', JSON.stringify(authData));
};
