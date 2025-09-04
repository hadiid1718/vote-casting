import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { voterActions } from '../store/vote-slice';
import { getStoredAuth, clearStoredAuth, shouldRefreshToken } from '../utils/auth';
import api from '../services/api';

const SessionManager = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedAuth = getStoredAuth();
        
        if (!storedAuth || !storedAuth.token) {
          return; // No stored session
        }

        // Check if we need to refresh the token
        if (shouldRefreshToken()) {
          try {
            const refreshToken = storedAuth.refreshToken;
            if (!refreshToken) {
              throw new Error('No refresh token available');
            }

            const response = await api.post('/voters/refresh-token', {
              refreshToken
            });

            const { token, refreshToken: newRefreshToken, id, isAdmin } = response.data;
            const newAuthData = {
              token,
              refreshToken: newRefreshToken,
              id,
              isAdmin,
              votedElection: storedAuth.votedElection || []
            };

            // Update stored auth
            localStorage.setItem('token', token);
            localStorage.setItem('refreshToken', newRefreshToken);
            const expiryTime = Date.now() + (7 * 24 * 60 * 60 * 1000);
            localStorage.setItem('tokenExpiry', expiryTime.toString());
            localStorage.setItem('currentUser', JSON.stringify(newAuthData));

            // Update Redux state
            dispatch(voterActions.changeCurrentVoter(newAuthData));
            
            console.log('Session restored with refreshed token');
          } catch (error) {
            console.error('Failed to refresh token on startup:', error);
            clearStoredAuth();
            dispatch(voterActions.logout());
          }
        } else {
          // Token is still valid, restore session
          dispatch(voterActions.changeCurrentVoter(storedAuth));
          console.log('Session restored with existing token');
        }
      } catch (error) {
        console.error('Error restoring session:', error);
        clearStoredAuth();
        dispatch(voterActions.logout());
      }
    };

    restoreSession();
  }, [dispatch]);

  return children;
};

export default SessionManager;
