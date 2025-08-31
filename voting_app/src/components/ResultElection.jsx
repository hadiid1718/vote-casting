import React, { useState, useEffect } from "react";
import CandidateRating from "../components/CandidateRating";
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux'
import { fetchElectionCandidates } from '../store/thunks'


const ResultElection = ({ _id, id, title, thumbnail }) => {
  // Use _id from MongoDB if available, fallback to id
  const electionId = _id || id;
  const [electionCandidates, setElectionCandidates] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const dispatch = useDispatch();
  const { currentVoter, candidates: globalCandidates } = useSelector(state => state.vote);
  
  // Check if current user has voted in this election
  const hasUserVoted = currentVoter.votedElection && currentVoter.votedElection.includes(electionId);

  // Fetch candidates for this election and update when global candidates change
  useEffect(() => {
    const fetchCandidates = async () => {
      if (currentVoter.token && electionId) {
        try {
          const result = await dispatch(fetchElectionCandidates(electionId)).unwrap();
          setElectionCandidates(result);
          // Calculate total votes
          const total = result.reduce((sum, candidate) => sum + (candidate.voteCount || 0), 0);
          setTotalVotes(total);
        } catch (error) {
          console.error('Failed to fetch candidates:', error);
          setElectionCandidates([]);
          setTotalVotes(0);
        }
      }
    };
    
    fetchCandidates();
  }, [currentVoter.token, electionId, dispatch, globalCandidates]);
  return (
    <>
      <article className="result">
        <header className="result__header">
          <h4>{title}</h4>
          <div className="result__header-img">
            <img src={thumbnail} alt={title} />
          </div>
        </header>
        
        {/* Voting Status Section */}
        <div className="voting-status-section">
          <div className="voting-status-header">
            <h5>VOTING STATUS</h5>
          </div>
          <div className="voting-status-badge">
            <span className={`status-indicator ${hasUserVoted ? 'voted' : 'not-voted'}`}>
              {hasUserVoted ? '✅ VOTED' : '⏳ NOT VOTED'}
            </span>
          </div>
        </div>
        <ul className="result__list">
            {electionCandidates.length > 0 ? (
              electionCandidates.map(candidate =>
                <CandidateRating
                  key={candidate._id || candidate.id}
                  {...candidate}
                  totalVotes={totalVotes}
                />
              )
            ) : (
              <li className="no-candidates">
                <p>No candidates available for this election yet.</p>
              </li>
            )}
          </ul>
          {totalVotes > 0 && (
            <div className="total-votes-info">
              <small>Total Votes Cast: {totalVotes}</small>
            </div>
          )}
          <Link to={`/elections/${electionId}/candidates`} className='btn primary full' style={{ textDecoration: 'none'}}>Enter Elections</Link>
      </article>
    </>
  );
};

export default ResultElection;

