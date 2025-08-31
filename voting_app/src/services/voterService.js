import api from './api';

// Voter API services
export const voterService = {
  // Register a new voter
  register: async (voterData) => {
    try {
      const response = await api.post('/voters/register', voterData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Login voter
  login: async (loginData) => {
    try {
      const response = await api.post('/voters/login', loginData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('currentUser', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get voter by ID
  getVoter: async (voterId) => {
    try {
      const response = await api.get(`/voters/${voterId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Logout voter
  logout: () => {
    localStorage.removeItem('token');
  },
};
