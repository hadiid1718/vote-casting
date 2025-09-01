import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { useSelector, useDispatch} from 'react-redux'
import { useParams} from "react-router-dom"
import Candidate from '../components/Candidate';
import ConfirmVote from '../components/ConfirmVote';
import { fetchElectionCandidates, fetchElection } from '../store/thunks';
import { voterActions } from '../store/vote-slice';
import ElectionStatus from '../components/ElectionStatus';
import { toast } from 'react-toastify';
const Candidates = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { candidates, loading, error, currentVoter, currentElection } = useSelector(state => state.vote);
  const voteCandidateModalShowing = useSelector( state => state.ui.voteCandidateModalShowing)
  
  // Memoized fetch function to prevent unnecessary re-fetches
  const fetchElectionData = useCallback(() => {
    if (currentVoter.token && id) {
      dispatch(fetchElectionCandidates(id));
      dispatch(fetchElection(id));
      // Set the selected election for voting
      dispatch(voterActions.changeSelectedElection(id));
    }
  }, [currentVoter.token, id, dispatch]);

  // Fetch candidates and election details only once on mount or key dependencies change
  useEffect(() => {
    fetchElectionData();
  }, [fetchElectionData]);
  
  // Memoize voting allowed check to prevent unnecessary calculations
  const votingAllowed = useMemo(() => {
    if (!currentElection) return false;
    const now = new Date();
    const startTime = new Date(currentElection.votingStartTime);
    const endTime = new Date(currentElection.votingEndTime);
    return now >= startTime && now <= endTime && currentElection.status === 'active';
  }, [currentElection]);

  return (
    <>
      <section className="candidates">
        <header className="candidate__header">
          <h1>Vote your Candidate</h1>
          {currentVoter.isAdmin ? (
            <div className="alert alert-info">
              <h3>Admin Access</h3>
              <p>As an administrator, you cannot vote in elections. You can view candidates but voting is restricted to regular voters only.</p>
            </div>
          ) : (
            <p>These are the candidates for the selected election. Please vote once wisely, because you won't be allowed to vote in this election again.</p>
          )}
          
          {currentElection && (
            <ElectionStatus 
              election={currentElection}
              showControls={false}
            />
          )}
        </header>
        
        {!votingAllowed && currentElection && (
          <div className="voting-not-allowed">
            <div className="alert alert-warning">
              <h3>Voting is currently not available</h3>
              {currentElection.status === 'scheduled' && (
                <p>Voting will start at: {new Date(currentElection.votingStartTime).toLocaleString()}</p>
              )}
              {currentElection.status === 'completed' && (
                <p>Voting has ended. You can view the results on the Results page.</p>
              )}
            </div>
          </div>
        )}
        
        {loading && <p>Loading candidates...</p>}
        {error && <p className="form__error-message">Error: {JSON.stringify(error)}</p>}
        
        {votingAllowed && (
          <div className="container candidate__container">
                {
                  candidates.map(candidate => <Candidate key={candidate._id || candidate.id} {...candidate} votingAllowed={votingAllowed}/>)
                }
          </div>
        )}
        
        {!votingAllowed && candidates.length > 0 && (
          <div className="container candidate__container">
            <div className="candidates-preview">
              <h3>Election Candidates</h3>
              <p>Voting is not currently available, but you can preview the candidates below:</p>
              {
                candidates.map(candidate => (
                  <div key={candidate._id || candidate.id} className="candidate-preview">
                    <img src={candidate.image} alt={candidate.fullName} style={{width: '50px', height: '50px', borderRadius: '50%'}} />
                    <div>
                      <h5>{candidate.fullName}</h5>
                      <small>{candidate.motto}</small>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        )}
      </section>
      { voteCandidateModalShowing && <ConfirmVote/> }
    </>
  )
}

export default Candidates
