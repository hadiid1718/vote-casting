import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { uiActions } from '../store/ui-slice'
import { voteForCandidate, fetchElections } from '../store/thunks'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'


const ConfirmVote = () => {
  const [ modalCandidate, setModalCandidate] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedVoteCandidate, candidates, currentVoter, selectedElection, loading } = useSelector(state => state.vote);

  const closeCandidateModal = () => {
     dispatch(uiActions.closeVoteCandidateModal())
  }

  // Find the selected candidate from Redux state
  useEffect(() => {
    const candidate = candidates.find(c => c._id === selectedVoteCandidate || c.id === selectedVoteCandidate);
    if (candidate) {
      setModalCandidate(candidate);
    }
  }, [selectedVoteCandidate, candidates]);

  const handleConfirmVote = async () => {
    try {
      const voteData = {
        currentVoterId: currentVoter.id,
        selectedElection: selectedElection
      };
      
      await dispatch(voteForCandidate({ 
        candidateId: selectedVoteCandidate, 
        voteData 
      })).unwrap();
      
      // Refresh elections data to update results
      dispatch(fetchElections());
      
      toast.success(`Vote cast successfully for ${modalCandidate.fullName}!`);
      closeCandidateModal();
      navigate('/congrates');
    } catch (error) {
      console.error('Voting failed:', error);
      toast.error(`Voting failed: ${error.message || 'Please try again'}`);
    }
  };
  return (
    <>
      <section className="modal">
        <div className="modal__content confirm__vote-content">
          <h5>Please Confirm Your Vote</h5>
          <div className="confirm__vote-image">
            <img src={modalCandidate.image} alt={modalCandidate.fullName} />
          </div>
          <h2>{modalCandidate.fullName?.length > 17 ? modalCandidate?.fullName?.substring(0,17) + '...' : modalCandidate?.fullName}</h2>
          <p>{modalCandidate.motto?.length > 45 ? modalCandidate?.motto?.substring(0,17) + '...' : modalCandidate?.motto}</p>
          <div className="confirm__vote-cta">
            <button className="btn" onClick={closeCandidateModal}>Cancel</button>
            <button className="btn primary" onClick={handleConfirmVote} disabled={loading}>
              {loading ? 'Voting...' : 'Confirm'}
            </button>
          </div>
        </div>
      </section>
    </>
  )
}

export default ConfirmVote
