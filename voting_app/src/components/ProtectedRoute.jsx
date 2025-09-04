import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { currentVoter } = useSelector(state => state.vote);
  
  // Check if user is authenticated (has token)
  if (!currentVoter.token) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" replace />;
  }
  
  // If authenticated, render the protected component
  return children;
};

export default ProtectedRoute;
