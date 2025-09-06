import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { uiActions } from "../store/ui-slice";
import { useDispatch, useSelector } from "react-redux";
import { addCandidate } from "../store/thunks";
import { toast } from "react-toastify";

function AddCandidateModal() {
  const [fullName, setFullName] = useState("");
  const [motto, setMotto] = useState("");
  const [image, setImage] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(0); // For resetting file input

  const dispatch = useDispatch();
  const { loading, error, addCandidateElectionId } = useSelector(state => state.vote);

  const closeModal = () => {
    dispatch(uiActions.closeAddCandidateModal());
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Candidate form submission started with data:', {
      fullName,
      motto,
      image: image ? { name: image.name, size: image.size, type: image.type } : null,
      addCandidateElectionId
    });
    
    if (!fullName || !motto || !image) {
      toast.error('Please fill all fields and select a candidate image');
      return;
    }

    // Validate file type
    const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp', 'image/avif'];
    if (!allowedTypes.includes(image.type)) {
      toast.error('Please select a valid image file (PNG, JPG, JPEG, WebP, or AVIF)');
      return;
    }

    // Validate file size (1MB limit)
    if (image.size > 1000000) {
      toast.error('Image file must be less than 1MB');
      return;
    }

    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('motto', motto);
    formData.append('image', image);
    formData.append('currentElection', addCandidateElectionId);
    
    console.log('FormData prepared for candidate, contents:');
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      await dispatch(addCandidate(formData)).unwrap();
      toast.success('Candidate added successfully!');
      closeModal();
      // Reset form
      setFullName("");
      setMotto("");
      setImage(null);
      setFileInputKey(prev => prev + 1); // Reset file input
    } catch (err) {
      console.error('Failed to add candidate:', err);
      toast.error(`Failed to add candidate: ${err.message || 'Please try again'}`);
    }
  };
  return (
    <>
      <div className="section modal">
        <div className="modal__content">
          <header className="modal__header">
            <h4>Add Candidate</h4>
            <button className="modal__close-btn" onClick={closeModal}>
              <IoMdClose />
            </button>
          </header>
          <form onSubmit={handleSubmit}>
            <div>
              <h6>Candidate Name:</h6>
              <input
                type="text"
                name="fullname"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div>
              <h6>Candidate Motto:</h6>
              <input
                type="text"
                name="motto"
                value={motto}
                onChange={(e) => setMotto(e.target.value)}
              />
            </div>
            <div>
              <h6>Candidate Image:</h6>
              <input
                key={fileInputKey}
                type="file"
                name="image"
                accept="image/png,image/jpeg,image/jpg,image/webp,image/avif"
                onChange={(e) => setImage(e.target.files[0])}
                required
              />
              {image && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
                  Selected: {image.name} ({Math.round(image.size / 1024)}KB)
                </div>
              )}
              <small style={{ display: 'block', marginTop: '0.25rem', color: '#888' }}>
                Please select an image file (PNG, JPG, JPEG, WebP, AVIF) - Maximum 1MB
              </small>
            </div>
            <button type="submit" className="btn primary">Add Candidate</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddCandidateModal;
