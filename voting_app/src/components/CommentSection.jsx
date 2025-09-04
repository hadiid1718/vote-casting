import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { FiHeart, FiEdit2, FiTrash2, FiSend, FiUser } from 'react-icons/fi';
import { 
  fetchBlogComments, 
  createComment, 
  updateComment, 
  deleteComment, 
  toggleCommentLike 
} from '../store/blog-slice';
import { toast } from 'react-toastify';

const CommentItem = ({ comment, blogId, currentUser, onEdit, onDelete, onLike }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleEdit = async () => {
    if (editContent.trim() === '') {
      toast.error('Comment cannot be empty');
      return;
    }

    try {
      await onEdit(comment._id, editContent);
      setIsEditing(false);
      toast.success('Comment updated successfully');
    } catch (error) {
      toast.error('Failed to update comment');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await onDelete(comment._id);
        toast.success('Comment deleted successfully');
      } catch (error) {
        toast.error('Failed to delete comment');
      }
    }
  };

  const isLiked = currentUser && comment.likes && comment.likes.includes(currentUser._id);
  const canModify = currentUser && (comment.author._id === currentUser._id || currentUser.isAdmin);

  return (
    <div className="comment-item">
      <div className="comment-header">
        <div className="comment-author">
          <FiUser className="icon" />
          <span className="author-name">
            {comment.author ? 
              `${comment.author.firstName || ''} ${comment.author.lastName || ''}`.trim() : 
              'Unknown User'
            }
            {comment.author?.isAdmin && (
              <span className="admin-badge">Admin</span>
            )}
          </span>
        </div>
        <div className="comment-date">
          {formatDate(comment.createdAt)}
          {comment.isEdited && <span className="edited-badge">• edited</span>}
        </div>
      </div>

      <div className="comment-content">
        {isEditing ? (
          <div className="comment-edit">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="comment-edit-input"
              rows="3"
              placeholder="Edit your comment..."
            />
            <div className="comment-edit-actions">
              <button 
                onClick={handleEdit}
                className="btn-save"
              >
                Save
              </button>
              <button 
                onClick={() => {
                  setIsEditing(false);
                  setEditContent(comment.content);
                }}
                className="btn-cancel"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="comment-text">{comment.content}</p>
        )}
      </div>

      <div className="comment-actions">
        <button 
          className={`action-btn like-btn ${isLiked ? 'liked' : ''}`}
          onClick={() => onLike(comment._id)}
          title={isLiked ? 'Unlike' : 'Like'}
        >
          <FiHeart className={`icon ${isLiked ? 'filled' : ''}`} />
          <span>{comment.likesCount || 0}</span>
        </button>

        {canModify && (
          <div className="comment-modify-actions">
            <button 
              className="action-btn edit-btn"
              onClick={() => setIsEditing(true)}
              title="Edit comment"
            >
              <FiEdit2 className="icon" />
            </button>
            <button 
              className="action-btn delete-btn"
              onClick={handleDelete}
              title="Delete comment"
            >
              <FiTrash2 className="icon" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const CommentSection = ({ blogId, isModal = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { comments, commentsLoading, commentsPagination } = useSelector(state => state.blog);
  const { currentVoter: user } = useSelector(state => state.vote);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (blogId) {
      dispatch(fetchBlogComments({ blogId }));
    }
  }, [dispatch, blogId]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!user || !user.token) {
      toast.info('Please login to comment');
      navigate('/login');
      return;
    }

    if (newComment.trim() === '') {
      toast.error('Comment cannot be empty');
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(createComment({ 
        blogId, 
        commentData: { content: newComment.trim() } 
      })).unwrap();
      
      setNewComment('');
      toast.success('Comment posted successfully');
    } catch (error) {
      toast.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditComment = async (commentId, content) => {
    await dispatch(updateComment({ commentId, content })).unwrap();
  };

  const handleDeleteComment = async (commentId) => {
    await dispatch(deleteComment(commentId)).unwrap();
  };

  const handleLikeComment = async (commentId) => {
    if (!user || !user.token) {
      toast.info('Please login to like comments');
      navigate('/login');
      return;
    }

    try {
      await dispatch(toggleCommentLike(commentId)).unwrap();
    } catch (error) {
      toast.error('Failed to toggle like');
    }
  };

  const loadMoreComments = () => {
    if (commentsPagination.currentPage < commentsPagination.totalPages) {
      dispatch(fetchBlogComments({ 
        blogId, 
        params: { page: commentsPagination.currentPage + 1 } 
      }));
    }
  };

  return (
    <div className={`comment-section ${isModal ? 'modal-mode' : ''}`}>
      <h3 className="comments-title">
        Comments ({commentsPagination.total || 0})
      </h3>

      {/* Add Comment Form */}
      {user ? (
        <form onSubmit={handleSubmitComment} className="comment-form">
          <div className="comment-input-wrapper">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="comment-input"
              rows="3"
              disabled={isSubmitting}
            />
            <button 
              type="submit" 
              className="comment-submit-btn"
              disabled={isSubmitting || newComment.trim() === ''}
            >
              {isSubmitting ? (
                <span>Posting...</span>
              ) : (
                <>
                  <FiSend className="icon" />
                  Post Comment
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="login-prompt">
          <p>Please <Link to="/login" className="login-link">login</Link> to post a comment.</p>
        </div>
      )}

      {/* Comments List */}
      <div className="comments-list">
        {commentsLoading && comments.length === 0 ? (
          <div className="loading-state">Loading comments...</div>
        ) : comments.length === 0 ? (
          <div className="empty-state">
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          <>
            {comments.map((comment) => (
              <CommentItem
                key={comment._id}
                comment={comment}
                blogId={blogId}
                currentUser={user}
                onEdit={handleEditComment}
                onDelete={handleDeleteComment}
                onLike={handleLikeComment}
              />
            ))}

            {/* Load More Button */}
            {commentsPagination.currentPage < commentsPagination.totalPages && (
              <div className="load-more-wrapper">
                <button 
                  onClick={loadMoreComments}
                  className="load-more-btn"
                  disabled={commentsLoading}
                >
                  {commentsLoading ? 'Loading...' : 'Load More Comments'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
