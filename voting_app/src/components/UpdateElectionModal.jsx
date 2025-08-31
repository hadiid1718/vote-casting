import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../store/ui-slice";
import { updateElection } from "../store/thunks";
import { toast } from 'react-toastify';

const UpdateElectionModal = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const dispatch = useDispatch();
  const { electionToUpdate } = useSelector(state => state.ui);
  const { loading, error } = useSelector(state => state.vote);
  
  // Populate form with current election data
  useEffect(() => {
    if (electionToUpdate) {
      setTitle(electionToUpdate.title || "");
      setDescription(electionToUpdate.description || "");
    }
  }, [electionToUpdate]);
  
  const closeModal = () => {
    dispatch(uiActions.closeUpdateElectionModal());
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!electionToUpdate || !electionToUpdate._id) {
      console.error('No election selected for update');
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      
      if (thumbnail) {
        formData.append('thumbnail', thumbnail);
      }
      
      await dispatch(updateElection({
        electionId: electionToUpdate._id,
        electionData: formData
      })).unwrap();
      
      toast.success('Election updated successfully!');
      // Close modal on success
      closeModal();
    } catch (error) {
      console.error('Update failed:', error);
      toast.error(`Update failed: ${error.message || 'Please try again'}`);
    }
  };
  return (
    <>
      <section className="modal">
        <div className="modal__content">
          <header className="modal__header">
            <h4>Update Election</h4>
            <button className="modal__close">
              <IoMdClose onClick={closeModal} />
            </button>
          </header>
          <form onSubmit={handleSubmit}>
            {error && <p className="form__error-message">{JSON.stringify(error)}</p>}
            <div>
              <h6>Election Title: </h6>
              <input
                type="text"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <h6>Election Description: </h6>
              <textarea
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
                required
              />
            </div>
            <div>
              <h6>Election Thumbnail (optional): </h6>
              <input
                type="file"
                name="thumbnail"
                accept=".png,.jpg,.jpeg,.webp,.avif"
                onChange={(e) => setThumbnail(e.target.files[0])}
              />
            </div>
            <button type="submit" className="btn primary" disabled={loading}>
              {loading ? "Updating..." : "Update Election"}
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default UpdateElectionModal;
