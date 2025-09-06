import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiHeart, FiMessageCircle, FiEye, FiCalendar, FiUser, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';
import { toggleBlogLike, deleteBlog } from '../store/blog-slice';
import { toast } from 'react-toastify';

const BlogCard = ({ blog }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentVoter: user } = useSelector(state => state.vote);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user || !user.token) {
      toast.info('Please login to like blogs');
      navigate('/login');
      return;
    }

    try {
      await dispatch(toggleBlogLike(blog._id)).unwrap();
    } catch (error) {
      toast.error(error);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this blog? This action cannot be undone.'
    );

    if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      await dispatch(deleteBlog(blog._id)).unwrap();
      toast.success('Blog deleted successfully');
    } catch (error) {
      toast.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/blogs/${blog._id}/edit`);
  };

  const isLiked = user && blog.likes && blog.likes.includes(user._id);
  const canEdit = user && user.isAdmin;
  const canDelete = user && user.isAdmin;

  return (
    <div className="blog-card">
      <Link to={`/blogs/${blog._id}`} className="blog-card-link">
        {/* Featured Image */}
        {blog.featuredImage && (
          <div className="blog-card-image">
            <img 
              src={blog.featuredImage.url} 
              alt={blog.title}
              loading="lazy"
            />
            {blog.isWinnerAnnouncement && (
              <div className="blog-badge winner-badge">
                🏆 Winner Announcement
              </div>
            )}
          </div>
        )}
        
        {/* Content */}
        <div className="blog-card-content">
          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="blog-tags">
              {blog.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="blog-tag">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h3 className="blog-card-title">{blog.title}</h3>
          
          {/* Excerpt */}
          <p className="blog-card-excerpt">{blog.excerpt}</p>
          
          {/* Author and Date */}
          <div className="blog-card-meta">
            <div className="blog-author">
              <FiUser className="icon" />
              <span>
                {blog.author ? 
                  `${blog.author.firstName || ''} ${blog.author.lastName || ''}`.trim() : 
                  'Unknown Author'
                }
                {blog.author?.isAdmin && (
                  <span className="admin-badge">Admin</span>
                )}
              </span>
            </div>
            <div className="blog-date">
              <FiCalendar className="icon" />
              <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
            </div>
          </div>
          
          {/* Stats */}
          <div className="blog-card-stats">
            <button 
              className={`stat-item like-btn ${isLiked ? 'liked' : ''}`}
              onClick={handleLike}
              title={isLiked ? 'Unlike' : 'Like'}
            >
              <FiHeart className={`icon ${isLiked ? 'filled' : ''}`} />
              <span>{formatNumber(blog.likesCount || 0)}</span>
            </button>
            
            <div className="stat-item">
              <FiMessageCircle className="icon" />
              <span>{formatNumber(blog.commentsCount || 0)}</span>
            </div>
            
            <div className="stat-item">
              <FiEye className="icon" />
              <span>{formatNumber(blog.viewsCount || 0)}</span>
            </div>
          </div>
        </div>
      </Link>
      
      {/* Admin Action Buttons */}
      {(canEdit || canDelete) && (
        <div className="blog-card-admin-actions">
          {canEdit && (
            <button 
              className="admin-action-btn edit-btn"
              onClick={handleEdit}
              title="Edit blog"
            >
              <FiEdit2 className="icon" />
              <span>Edit</span>
            </button>
          )}
          
          {canDelete && (
            <button 
              className="admin-action-btn delete-btn"
              onClick={handleDelete}
              disabled={isDeleting}
              title={isDeleting ? 'Deleting...' : 'Delete blog'}
            >
              <FiTrash2 className="icon" />
              <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default BlogCard;
