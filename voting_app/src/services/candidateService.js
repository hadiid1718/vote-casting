import api from './api';

// Candidate API services
export const candidateService = {
  // Add new candidate
  addCandidate: async (candidateData) => {
    try {
      const response = await api.post('/candidates', candidateData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get candidate by ID
  getCandidate: async (candidateId) => {
    try {
      const response = await api.get(`/candidates/${candidateId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete candidate
  removeCandidate: async (candidateId) => {
    try {
      const response = await api.delete(`/candidates/${candidateId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Vote for candidate
  voteCandidate: async (candidateId, voteData) => {
    try {
      const response = await api.patch(`/candidates/${candidateId}`, voteData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
