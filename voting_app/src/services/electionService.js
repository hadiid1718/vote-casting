import api from './api';

// Election API services
export const electionService = {
  // Add new election
  addElection: async (electionData) => {
    try {
      const response = await api.post('/elections', electionData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all elections
  getElections: async () => {
    try {
      const response = await api.get('/elections');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get election by ID
  getElection: async (electionId) => {
    try {
      const response = await api.get(`/elections/${electionId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update election
  updateElection: async (electionId, electionData) => {
    try {
      const config = {};
      // Check if electionData contains file (FormData object)
      if (electionData instanceof FormData) {
        config.headers = {
          'Content-Type': 'multipart/form-data',
        };
      }
      const response = await api.patch(`/elections/${electionId}`, electionData, config);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete election
  deleteElection: async (electionId) => {
    try {
      const response = await api.delete(`/elections/${electionId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get election candidates
  getElectionCandidates: async (electionId) => {
    try {
      const response = await api.get(`/elections/${electionId}/candidates`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get election voters (Admin only)
  getElectionVoters: async (electionId) => {
    try {
      const response = await api.get(`/elections/${electionId}/voters`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update election status (Admin only)
  updateElectionStatus: async (electionId, status) => {
    try {
      const response = await api.patch(`/elections/${electionId}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Start voting immediately (Admin only)
  startVoting: async (electionId) => {
    try {
      const response = await api.patch(`/elections/${electionId}/start`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
