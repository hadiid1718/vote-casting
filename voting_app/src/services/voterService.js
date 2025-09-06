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

  // Admin student management services
  addStudent: async (studentData) => {
    try {
      const response = await api.post('/voters/add-student', studentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getAllStudents: async () => {
    try {
      const response = await api.get('/voters/students');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateStudent: async (studentId, studentData) => {
    try {
      const response = await api.patch(`/voters/students/${studentId}`, studentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteStudent: async (studentId) => {
    try {
      const response = await api.delete(`/voters/students/${studentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
