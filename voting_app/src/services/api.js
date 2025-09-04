import axios from 'axios';
import { shouldRefreshToken, clearStoredAuth, setStoredAuth } from '../utils/auth';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 30000, // Increased to 30 seconds to prevent timeout errors
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token refresh function
const refreshAuthToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
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
      votedElection: JSON.parse(localStorage.getItem('currentUser') || '{}').votedElection || []
    };

    setStoredAuth(newAuthData);
    return token;
  } catch (error) {
    console.error('Token refresh failed:', error);
    // Clear auth data on refresh failure
    clearStoredAuth();
    throw error;
  }
};

// Track ongoing refresh promise to prevent multiple refresh attempts
let refreshPromise = null;

// Request interceptor to add auth token and handle refresh
api.interceptors.request.use(
  async (config) => {
    // Skip token refresh for refresh token endpoint
    if (config.url?.includes('/voters/refresh-token')) {
      return config;
    }

    // Only add token if explicitly requested or for non-public routes
    let token = localStorage.getItem('token');
    const publicRoutes = ['/blogs', '/test'];
    const isPublicRoute = publicRoutes.some(route => 
      config.url.includes(route) && config.method === 'get'
    );
    
    // Check if we need to refresh the token for protected routes
    if (token && !isPublicRoute && shouldRefreshToken()) {
      try {
        // Use existing refresh promise or create new one
        if (!refreshPromise) {
          refreshPromise = refreshAuthToken();
        }
        
        token = await refreshPromise;
        refreshPromise = null; // Reset promise after completion
      } catch (error) {
        refreshPromise = null;
        // Token refresh failed, clear auth and redirect
        clearStoredAuth();
        window.location.href = '/login';
        return Promise.reject(new Error('Session expired'));
      }
    }
    
    // Add token for all routes except public GET routes, unless forced
    if (token && (!isPublicRoute || config.headers.requireAuth)) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Clean up our custom header
    delete config.headers.requireAuth;
    
    // For FormData uploads, remove Content-Type to let browser set it
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Only handle token issues for protected routes
      const publicRoutes = ['/blogs', '/test'];
      const isPublicRoute = publicRoutes.some(route => 
        error.config?.url?.includes(route) && 
        error.config?.method === 'get'
      );
      
      if (!isPublicRoute) {
        // Token expired or invalid on protected route
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
