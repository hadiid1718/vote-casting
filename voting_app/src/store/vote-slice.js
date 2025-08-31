import { createSlice } from "@reduxjs/toolkit";
import {
  registerVoter,
  loginVoter,
  fetchVoter,
  fetchElections,
  fetchElection,
  createElection,
  updateElection,
  deleteElection,
  fetchElectionCandidates,
  fetchElectionVoters,
  updateElectionStatus,
  startVoting,
  addCandidate,
  fetchCandidate,
  removeCandidate,
  voteForCandidate,
} from './thunks';

const currentVoter = { id: "", token: "", isAdmin: false, votedElection: [] };
const initialState = {
  selectedVoteCandidate: "",
  currentVoter,
  selectedElection: "",
  idOfElectionToUpdate: "",
  addCandidateElectionId: "",
  // API states
  elections: [],
  candidates: [],
  voters: [],
  currentElection: null,
  loading: false,
  error: null,
};

const voterSlice = createSlice({
  name: "voter",
  initialState,
  reducers: {
    changeCurrentVoter(state, action) {
      state.currentVoter = action.payload;
    },
    changeSelectedVoteCandidate(state, action) {
      state.selectedVoteCandidate = action.payload;
    },
    changeSelectedElection(state, action) {
      state.selectedElection = action.payload;
    },
    changeIdOfCandidateElectionId(state, action) {
      state.addCandidateElectionId = action.payload;
    },
    changeAddCandidateElectionId(state, action) {
      state.addCandidateElectionId = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
    logout(state) {
      state.currentVoter = { id: "", token: "", isAdmin: false, votedElection: [] };
      state.elections = [];
      state.candidates = [];
      state.voters = [];
      state.currentElection = null;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
    },
  },
  extraReducers: (builder) => {
    builder
      // Voter Registration
      .addCase(registerVoter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerVoter.fulfilled, (state, action) => {
        state.loading = false;
        // Handle successful registration
      })
      .addCase(registerVoter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Voter Login
      .addCase(loginVoter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginVoter.fulfilled, (state, action) => {
        state.loading = false;
        // Backend returns: { token, id, isAdmin, votedElection }
        const { token, id, isAdmin, votedElection } = action.payload;
        const userData = {
          id,
          token,
          isAdmin,
          votedElection: votedElection || []
        };
        state.currentVoter = userData;
        
        // Store in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('currentUser', JSON.stringify(userData));
      })
      .addCase(loginVoter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Voter
      .addCase(fetchVoter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVoter.fulfilled, (state, action) => {
        state.loading = false;
        state.currentVoter = action.payload;
      })
      .addCase(fetchVoter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Elections
      .addCase(fetchElections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchElections.fulfilled, (state, action) => {
        state.loading = false;
        state.elections = action.payload;
      })
      .addCase(fetchElections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Single Election
      .addCase(fetchElection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchElection.fulfilled, (state, action) => {
        state.loading = false;
        state.currentElection = action.payload;
      })
      .addCase(fetchElection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Election
      .addCase(createElection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createElection.fulfilled, (state, action) => {
        state.loading = false;
        state.elections.push(action.payload);
      })
      .addCase(createElection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Election
      .addCase(updateElection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateElection.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.elections.findIndex(e => e._id === action.payload._id);
        if (index !== -1) {
          state.elections[index] = action.payload;
        }
      })
      .addCase(updateElection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Election
      .addCase(deleteElection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteElection.fulfilled, (state, action) => {
        state.loading = false;
        state.elections = state.elections.filter(e => e._id !== action.payload);
      })
      .addCase(deleteElection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Election Candidates
      .addCase(fetchElectionCandidates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchElectionCandidates.fulfilled, (state, action) => {
        state.loading = false;
        state.candidates = action.payload;
      })
      .addCase(fetchElectionCandidates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Election Voters
      .addCase(fetchElectionVoters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchElectionVoters.fulfilled, (state, action) => {
        state.loading = false;
        state.voters = action.payload;
      })
      .addCase(fetchElectionVoters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Candidate
      .addCase(addCandidate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCandidate.fulfilled, (state, action) => {
        state.loading = false;
        state.candidates.push(action.payload);
      })
      .addCase(addCandidate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove Candidate
      .addCase(removeCandidate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeCandidate.fulfilled, (state, action) => {
        state.loading = false;
        state.candidates = state.candidates.filter(c => c._id !== action.payload);
      })
      .addCase(removeCandidate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Vote for Candidate
      .addCase(voteForCandidate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(voteForCandidate.fulfilled, (state, action) => {
        state.loading = false;
        // Update the candidate in the candidates array
        const index = state.candidates.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.candidates[index] = action.payload;
        }
        // Also update the candidate in elections array if it exists there
        state.elections.forEach(election => {
          if (election.candidates) {
            const candidateIndex = election.candidates.findIndex(c => c._id === action.payload._id);
            if (candidateIndex !== -1) {
              election.candidates[candidateIndex] = action.payload;
            }
          }
        });
        
        // Update current voter's votedElection array with the election they just voted in
        if (state.selectedElection && !state.currentVoter.votedElection.includes(state.selectedElection)) {
          state.currentVoter.votedElection.push(state.selectedElection);
          // Update localStorage as well
          const updatedUser = {
            ...state.currentVoter,
            votedElection: state.currentVoter.votedElection
          };
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        }
        
        // Mark that voters data needs to be refreshed
        state.votersNeedRefresh = true;
      })
      .addCase(voteForCandidate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Election Status
      .addCase(updateElectionStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateElectionStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.elections.findIndex(e => e._id === action.payload._id);
        if (index !== -1) {
          state.elections[index] = action.payload;
        }
      })
      .addCase(updateElectionStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Start Voting
      .addCase(startVoting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startVoting.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.elections.findIndex(e => e._id === action.payload._id);
        if (index !== -1) {
          state.elections[index] = action.payload;
        }
      })
      .addCase(startVoting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const voterActions = voterSlice.actions;
export default voterSlice;
