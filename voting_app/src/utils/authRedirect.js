// Authentication redirect utilities
export const redirectAfterLogin = (isAdmin, navigate) => {
  // Both admin and regular users go to blogs page after login
  navigate('/blogs');
};

export const redirectAfterLogout = (navigate) => {
  // Always redirect to register page after logout
  navigate('/register');
};

export const getDefaultRoute = (isAuthenticated, isAdmin) => {
  if (!isAuthenticated) {
    return '/';
  }
  
  return '/blogs';
};
