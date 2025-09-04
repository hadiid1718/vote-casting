import React, { useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import CommentSection from './CommentSection';
import './CommentModal.css'; // We'll need to create this CSS file

const CommentModal = ({ isOpen, onClose, blogId, blogTitle }) => {
  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent background scrolling
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="comment-modal-overlay" onClick={handleBackdropClick}>
      <div className="comment-modal">
        {/* Modal Header */}
        <div className="comment-modal-header">
          <h3 className="comment-modal-title">
            Comments: {blogTitle}
          </h3>
          <button 
            className="comment-modal-close" 
            onClick={onClose}
            aria-label="Close comments"
          >
            <FiX className="icon" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="comment-modal-body">
          <CommentSection blogId={blogId} isModal={true} />
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
