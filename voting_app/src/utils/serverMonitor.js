// Server restart detection utility
import { toast } from 'react-toastify';

let serverStartTime = null;
let isMonitoring = false;

// Check if server has restarted by comparing server start time
export const checkServerRestart = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/test', {
      method: 'GET',
      cache: 'no-cache'
    });
    
    if (response.ok) {
      const data = await response.json();
      const currentServerTime = data.timestamp;
      
      // If we have a previous server time stored
      const storedServerTime = localStorage.getItem('serverStartTime');
      
      if (storedServerTime && currentServerTime) {
        const storedTime = new Date(storedServerTime);
        const currentTime = new Date(currentServerTime);
        
        // If server time is significantly different (more than 30 seconds older), 
        // it likely means the server restarted
        const timeDiff = Math.abs(currentTime - storedTime);
        
        if (timeDiff > 30000) { // 30 seconds
          console.log('Server restart detected');
          return true;
        }
      }
      
      // Store the current server time
      localStorage.setItem('serverStartTime', currentServerTime);
      return false;
    }
  } catch (error) {
    // Server might be down, don't trigger logout for network errors
    console.log('Server check failed:', error.message);
    return false;
  }
  
  return false;
};

// Initialize server monitoring
export const initializeServerMonitor = () => {
  if (isMonitoring) return;
  
  isMonitoring = true;
  
  // Check server status every 2 minutes
  const checkInterval = setInterval(async () => {
    const hasRestarted = await checkServerRestart();
    
    if (hasRestarted) {
      // Clear the interval to prevent multiple triggers
      clearInterval(checkInterval);
      isMonitoring = false;
      
      return true; // Signal that restart was detected
    }
  }, 120000); // Check every 2 minutes
  
  return checkInterval;
};

// Check server restart immediately (for app startup)
export const checkImmediateServerRestart = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/test', {
      method: 'GET',
      cache: 'no-cache'
    });
    
    if (response.ok) {
      const data = await response.json();
      const currentServerTime = data.timestamp;
      
      // Check if we have an authentication token but no server time stored
      // This could indicate the server restarted while user was logged in
      const hasToken = localStorage.getItem('token');
      const storedServerTime = localStorage.getItem('serverStartTime');
      
      if (hasToken && !storedServerTime) {
        // Store current server time and return restart detected
        localStorage.setItem('serverStartTime', currentServerTime);
        return true;
      }
      
      // Store current server time for future comparisons
      localStorage.setItem('serverStartTime', currentServerTime);
    }
  } catch (error) {
    console.log('Initial server check failed:', error.message);
  }
  
  return false;
};

// Clean up server monitoring
export const stopServerMonitor = (intervalId) => {
  if (intervalId) {
    clearInterval(intervalId);
  }
  isMonitoring = false;
};
