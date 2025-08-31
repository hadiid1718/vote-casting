import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { uiActions } from '../store/ui-slice'
import { voterActions } from '../store/vote-slice'


const Candidate = ({ _id, id, image, fullName, motto, votingAllowed = true}) => {
  // Use _id from MongoDB if available, fallback to id
  const candidateId = _id || id;
  const dispatch = useDispatch()
  const { currentVoter } = useSelector(state => state.vote)
  
  const openCandidateModel = () => {
      if (!votingAllowed || currentVoter.isAdmin) {
        return; // Don't open modal if voting is not allowed or user is admin
      }
      dispatch(uiActions.openVoteCandidateModal())
      dispatch(voterActions.changeSelectedVoteCandidate(candidateId))
  }
  return (
    <>
      <article className="candidate">
        <div className="candidate__image">
          <img src={image} alt={fullName} />
        </div>
        <h5>{fullName?.length > 20 ?  fullName.substring(0,20) + "...": fullName}</h5>
        <small>{motto?.length > 25 ?  motto.substring(0,25) + "...": motto}</small>
        <button 
          className={`btn ${currentVoter.isAdmin ? 'disabled' : votingAllowed ? 'primary' : 'disabled'}`} 
          onClick={openCandidateModel}
          disabled={!votingAllowed || currentVoter.isAdmin}
          title={
            currentVoter.isAdmin 
              ? 'Admin users cannot vote' 
              : votingAllowed 
                ? 'Click to vote' 
                : 'Voting is not currently available'
          }
        >
          {currentVoter.isAdmin ? 'Admin - No Vote' : votingAllowed ? 'Vote' : 'Voting Closed'}
        </button>
      </article>
    </>
  )
}

export default Candidate
