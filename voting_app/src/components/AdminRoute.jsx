import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const { currentVoter } = useSelector(state => state.vote);
  
  // Check if user is authenticated and is admin
  if (!currentVoter.token) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" replace />;
  }
  
  if (!currentVoter.isAdmin) {
    // Redirect to results page if not admin (they can view results but not manage elections)
    return <Navigate to="/results" replace />;
  }
  
  // If authenticated and admin, render the protected component
  return children;
};

export default AdminRoute;
