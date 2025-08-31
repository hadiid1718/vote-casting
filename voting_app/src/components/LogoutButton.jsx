import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { voterActions } from '../store/vote-slice';
import { clearStoredAuth } from '../utils/auth';

const LogoutButton = ({ className = "btn secondary", children = "Logout" }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear Redux state
    dispatch(voterActions.logout());
    
    // Clear localStorage
    clearStoredAuth();
    
    // Navigate to register page
    navigate('/register');
  };

  return (
    <button 
      onClick={handleLogout} 
      className={className}
      type="button"
    >
      {children}
    </button>
  );
};

export default LogoutButton;
