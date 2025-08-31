// Authentication redirect utilities
export const redirectAfterLogin = (isAdmin, navigate) => {
  if (isAdmin) {
    // Admin goes to elections page to manage elections
    navigate('/elections');
  } else {
    // Regular user goes to elections page to view and vote
    navigate('/elections');
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
  
  return '/elections';
};
