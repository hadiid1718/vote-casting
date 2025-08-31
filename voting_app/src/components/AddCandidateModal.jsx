import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { uiActions } from "../store/ui-slice";
import { useDispatch, useSelector } from "react-redux";
import { addCandidate } from "../store/thunks";

function AddCandidateModal() {
  const [fullName, setFullName] = useState("");
  const [motto, setMotto] = useState("");
  const [image, setImage] = useState(null);

  const dispatch = useDispatch();
  const { loading, error, addCandidateElectionId } = useSelector(state => state.vote);

  const closeModal = () => {
    dispatch(uiActions.closeAddCandidateModal());
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !motto || !image) {
      alert('Please fill all fields and select an image');
      return;
    }

    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('motto', motto);
    formData.append('image', image);
    formData.append('currentElection', addCandidateElectionId);

    try {
      await dispatch(addCandidate(formData)).unwrap();
      closeModal();
      // Reset form
      setFullName("");
      setMotto("");
      setImage(null);
    } catch (err) {
      console.error('Failed to add candidate:', err);
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
                type="file"
                name="image"
                accept="png, jpg, jpeg, avif, webp"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>
            <button type="submit" className="btn primary">Add Candidate</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddCandidateModal;
