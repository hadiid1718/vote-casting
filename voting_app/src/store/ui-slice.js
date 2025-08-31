import { createSlice} from '@reduxjs/toolkit'


const initialState = {
  addCandidateModalShowing: false,
  voteCandidateModalShowing: false,
  electionModalShowing: false,
  updateElectionModalShowing: false,
  electionToUpdate: null,
}
const uiSlice = createSlice({
name: 'ui',
initialState,
reducers : {
   openAddCandidateModal(state) {
    state.addCandidateModalShowing = true;
   },
   closeAddCandidateModal(state) {
    state.addCandidateModalShowing = false;
   },
   openVoteCandidateModal(state) {
    state.voteCandidateModalShowing = true;
   },
   closeVoteCandidateModal(state) {
    state.voteCandidateModalShowing = false;
   },
   openElectionModal(state) {
    state.electionModalShowing = true;
   },
   closeElectionModal(state) {
    state.electionModalShowing = false;
   },
   openUpdateElectionModal(state) {
    state.updateElectionModalShowing = true;
   },
   closeUpdateElectionModal(state) {
    state.updateElectionModalShowing = false;
    state.electionToUpdate = null;
   },
   setElectionToUpdate(state, action) {
    state.electionToUpdate = action.payload;
   },

}
})
export const uiActions = uiSlice.actions;
export default uiSlice;