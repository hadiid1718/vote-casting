// Authentication redirect utilities
export const redirectAfterLogin = (isAdmin, navigate) => {
  // Redirect admins to admin dashboard, regular users to blogs
  if (isAdmin) {
    navigate('/admin');
  } else {
    navigate('/blogs');
  }
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
