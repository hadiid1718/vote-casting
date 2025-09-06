import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../store/ui-slice";
import { createElection } from "../store/thunks";
import { toast } from 'react-toastify';

const AddElectionModal = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [votingStartTime, setVotingStartTime] = useState("");
  const [duration, setDuration] = useState(4);
  const [fileInputKey, setFileInputKey] = useState(0); // For resetting file input
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.vote);
  
  const closeElection = () => {
    dispatch(uiActions.closeElectionModal());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submission started with data:', {
      title,
      description,
      thumbnail: thumbnail ? { name: thumbnail.name, size: thumbnail.size, type: thumbnail.type } : null,
      votingStartTime,
      duration
    });
    
    if (!title || !description || !thumbnail) {
      toast.error('Please fill all fields and select a thumbnail image');
      return;
    }

    // Validate file type
    const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp', 'image/avif'];
    if (!allowedTypes.includes(thumbnail.type)) {
      toast.error('Please select a valid image file (PNG, JPG, JPEG, WebP, or AVIF)');
      return;
    }

    // Validate file size (1MB limit)
    if (thumbnail.size > 1000000) {
      toast.error('Image file must be less than 1MB');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('thumbnail', thumbnail);
    if (votingStartTime) {
      formData.append('votingStartTime', votingStartTime);
    }
    formData.append('duration', duration);
    
    console.log('FormData prepared, contents:');
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      await dispatch(createElection(formData)).unwrap();
      toast.success('Election created successfully!');
      closeElection();
      // Reset form
      setTitle("");
      setDescription("");
      setThumbnail(null);
      setVotingStartTime("");
      setDuration(4);
      setFileInputKey(prev => prev + 1); // Reset file input
    } catch (err) {
      console.error('Failed to create election:', err);
      toast.error(`Failed to create election: ${err.message || 'Please try again'}`);
    }
  };
  return (
    <>
      <section className="modal">
        <div className="modal__content">
          <header className="modal__header">
            <h4>Create New Election</h4>
            <button className="modal__close">
              <IoMdClose onClick={closeElection} />
            </button>
          </header>
          <form onSubmit={handleSubmit}>
            <div>
              <h6>Election Title: </h6>
              <input
                type="text"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <h6>Election Description: </h6>
              <input
                type="text"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <h6>Election Thumbnail: </h6>
              <input
                key={fileInputKey}
                type="file"
                name="thumbnail"
                accept="image/png,image/jpg,image/jpeg,image/webp,image/avif"
                onChange={(e) => setThumbnail(e.target.files[0])}
                required
              />
              {thumbnail && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
                  Selected: {thumbnail.name} ({Math.round(thumbnail.size / 1024)}KB)
                </div>
              )}
              <small style={{ display: 'block', marginTop: '0.25rem', color: '#888' }}>
                Please select an image file (PNG, JPG, JPEG, WebP, AVIF) - Maximum 1MB
              </small>
            </div>
            <div>
              <h6>Voting Start Time (optional): </h6>
              <input
                type="datetime-local"
                name="votingStartTime"
                value={votingStartTime}
                onChange={(e) => setVotingStartTime(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
              />
              <small>If not set, voting will start tomorrow at 9 AM</small>
            </div>
            <div>
              <h6>Voting Duration (hours): </h6>
              <input
                type="number"
                name="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                min="1"
                max="24"
                step="1"
              />
              <small>How long voting should remain open (1-24 hours)</small>
            </div>
            <button type="submit" className="btn primary">
              Add Election
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default AddElectionModal;
