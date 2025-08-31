import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { uiActions } from '../store/ui-slice'
import { updateElectionStatus, startVoting, deleteElection } from '../store/thunks'
import ElectionStatus from './ElectionStatus'
import { toast } from 'react-toastify'
import { IoMdTrash } from 'react-icons/io'

const Election = ({ _id, id, title, description, thumbnail, votingStartTime, votingEndTime, status, duration }) => {
  // Use _id from MongoDB if available, fallback to id
  const electionId = _id || id;
  const dispatch = useDispatch()
  const { currentVoter } = useSelector(state => state.vote)
  
  const election = {
    _id: electionId,
    title,
    description,
    thumbnail,
    votingStartTime,
    votingEndTime,
    status,
    duration
  };
  
  const openModal = () => {
    // Set the election ID to update and open modal
    dispatch(uiActions.openUpdateElectionModal())
    // Also set which election is being updated
    dispatch(uiActions.setElectionToUpdate(election))
  }
  
  const handleStatusChange = async (electionId, newStatus) => {
    try {
      await dispatch(updateElectionStatus({ electionId, status: newStatus })).unwrap();
      toast.success(`Election status updated to ${newStatus}`);
    } catch (error) {
      toast.error(`Failed to update status: ${error.message}`);
    }
  };
  
  const handleStartVoting = async (electionId) => {
    try {
      await dispatch(startVoting(electionId)).unwrap();
      toast.success('Voting started successfully!');
    } catch (error) {
      toast.error(`Failed to start voting: ${error.message}`);
    }
  };
  
  const handleDeleteElection = async (electionId) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      try {
        await dispatch(deleteElection(electionId)).unwrap();
        toast.success('Election deleted successfully!');
      } catch (error) {
        toast.error(`Failed to delete election: ${error.message}`);
      }
    }
  };
  
  // Check if voting is currently allowed
  const isVotingAllowed = () => {
    const now = new Date();
    const startTime = new Date(votingStartTime);
    const endTime = new Date(votingEndTime);
    return now >= startTime && now <= endTime && status === 'active';
  };
  return (
    <>
       <article className="election">
        <div className="election__image">
          <img  src={thumbnail} alt={title} />
        </div>
        <div className="election__info">
            <Link to={`/elections/${electionId}`}><h4>{title}</h4></Link>
          <p>{description?.length > 255 ? description.substring(0,255)+ ' ....' : description}</p>
          
          <ElectionStatus 
            election={election}
            showControls={currentVoter.isAdmin}
            onStatusChange={handleStatusChange}
            onStartVoting={handleStartVoting}
          />
          
          <div className="election__cta">
            <Link to={`/elections/${electionId}`} className="btn sm">View</Link>
            {currentVoter.isAdmin ? (
              <button className="btn sm" disabled title="Admin users cannot vote">
                Admin - No Voting
              </button>
            ) : isVotingAllowed() ? (
              <Link to={`/elections/${electionId}/candidates`} className="btn sm success">Vote Now</Link>
            ) : (
              <button className="btn sm" disabled title="Voting not currently available">
                {status === 'scheduled' ? 'Voting Not Started' : 
                 status === 'completed' ? 'Voting Ended' : 'Voting Closed'}
              </button>
            )}
            {currentVoter.isAdmin && (
              <>
                <button className="btn sm primary" onClick={openModal}>Edit</button>
                <button 
                  className="btn sm danger" 
                  onClick={() => handleDeleteElection(electionId)}
                  title="Delete Election"
                >
                  <IoMdTrash />
                </button>
              </>
            )}
          </div>
        </div>
       </article>
    </>
  )
}

export default Election
