import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IoMdTrash } from "react-icons/io";
import { removeCandidate } from '../store/thunks'
import { toast } from 'react-toastify'

const ElectionCandidate = ({ fullName, image, motto, id, _id}) => {
  const candidateId = _id || id;
  const dispatch = useDispatch()
  const { currentVoter } = useSelector(state => state.vote)
  
  const handleDeleteCandidate = async () => {
    if (window.confirm(`Are you sure you want to remove ${fullName} from this election? This action cannot be undone.`)) {
      try {
        await dispatch(removeCandidate(candidateId)).unwrap();
        toast.success(`${fullName} removed successfully!`);
      } catch (error) {
        toast.error(`Failed to remove candidate: ${error.message}`);
      }
    }
  };
  return (
    <>
        <li className="electionCandidate">
          <div className="electionCandidate__image">
            <img src={image} alt={fullName} />
          </div>
          <div >
            <h5>{fullName}</h5>
            <small>{motto}</small>
            {currentVoter.isAdmin && (
              <button 
                className="electionCandidate__btn danger" 
                onClick={handleDeleteCandidate}
                title="Remove Candidate"
              >
                <IoMdTrash/>
              </button>
            )}
            </div>
        </li>
    </>
  )
}

export default ElectionCandidate;
