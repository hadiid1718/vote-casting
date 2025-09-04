import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiHeart, FiMessageCircle, FiEye, FiCalendar, FiUser, FiEdit2, FiTrash2, FiArrowLeft, FiShare2 } from 'react-icons/fi';
import { fetchBlog, toggleBlogLike, deleteBlog, clearCurrentBlog } from '../store/blog-slice';
import CommentModal from '../components/CommentModal';
import '../components/BlogContent.css';
import { toast } from 'react-toastify';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentBlog: blog, blogLoading, error } = useSelector(state => state.blog);
  const { currentVoter: user } = useSelector(state => state.vote);
  
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchBlog(id));
    }

    // Cleanup on unmount
    return () => {
      dispatch(clearCurrentBlog());
    };
  }, [dispatch, id]);

  useEffect(() => {
    // Show error toast if there's an error (but not null errors from auth issues)
    if (error && error !== null) {
      toast.error(error);
    }
  }, [error]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const handleLike = async () => {
    if (!user || !user.token) {
      toast.info('Please login to like blogs');
      navigate('/login');
      return;
    }

    if (isLiking) return;

    setIsLiking(true);
    try {
      await dispatch(toggleBlogLike(blog._id)).unwrap();
    } catch (error) {
      toast.error(error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this blog? This action cannot be undone.'
    );

    if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      await dispatch(deleteBlog(blog._id)).unwrap();
      toast.success('Blog deleted successfully');
      navigate('/blogs');
    } catch (error) {
      toast.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShare = async () => {
    if (!user || !user.token) {
      toast.info('Please login to share blogs');
      navigate('/login');
      return;
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.excerpt,
          url: window.location.href
        });
      } catch (error) {
        // User cancelled sharing or error occurred
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      toast.success('Link copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy link');
    });
  };

  if (blogLoading && !blog) {
    return (
      <div className="blog-detail-page">
        <div className="container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading blog...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!blog && !blogLoading) {
    return (
      <div className="blog-detail-page">
        <div className="container">
          <div className="error-state">
            <h3>Blog not found</h3>
            <p>The blog you're looking for doesn't exist or may have been removed.</p>
            <Link to="/blogs" className="back-link">
              <FiArrowLeft className="icon" />
              Back to Blogs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isLiked = user && blog.likes && blog.likes.includes(user._id);
  const canEdit = user && user.isAdmin;
  const canDelete = user && user.isAdmin;

  // Parse content for images (simple approach)
  const renderContent = (content) => {
    // In a real app, you'd want to use a proper rich text renderer
    // For now, we'll use dangerouslySetInnerHTML with proper sanitization
    return { __html: content };
  };

  return (
    <div className="blog-detail-page">
      <div className="container">
        {/* Back Navigation */}
        <div className="back-navigation">
          <Link to="/blogs" className="back-link">
            <FiArrowLeft className="icon" />
            Back to Blogs
          </Link>
        </div>

        <article className="blog-article">
          {/* Featured Image */}
          {blog.featuredImage && (
            <div className="blog-featured-image">
              <img 
                src={blog.featuredImage.url} 
                alt={blog.title}
              />
              {blog.isWinnerAnnouncement && (
                <div className="blog-badge winner-badge">
                  🏆 Winner Announcement
                </div>
              )}
            </div>
          )}

          {/* Blog Header */}
          <header className="blog-header">
            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="blog-tags">
                {blog.tags.map((tag, index) => (
                  <span key={index} className="blog-tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="blog-title">{blog.title}</h1>

            {/* Meta Information */}
            <div className="blog-meta">
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

            {/* Stats and Actions */}
            <div className="blog-actions">
              <div className="blog-stats">
                <button 
                  className={`stat-button like-btn ${isLiked ? 'liked' : ''}`}
                  onClick={handleLike}
                  disabled={isLiking}
                  title={isLiked ? 'Unlike' : 'Like'}
                >
                  <FiHeart className={`icon ${isLiked ? 'filled' : ''}`} />
                  <span>{formatNumber(blog.likesCount || 0)} Likes</span>
                </button>
                
                <button 
                  className="stat-button comment-btn"
                  onClick={() => setShowCommentsModal(true)}
                  title="View Comments"
                >
                  <FiMessageCircle className="icon" />
                  <span>{formatNumber(blog.commentsCount || 0)} Comments</span>
                </button>
                
                <div className="stat-item">
                  <FiEye className="icon" />
                  <span>{formatNumber(blog.viewsCount || 0)} Views</span>
                </div>
              </div>

              <div className="action-buttons">
                <button onClick={handleShare} className="share-btn" title="Share">
                  <FiShare2 className="icon" />
                  Share
                </button>

                {canEdit && (
                  <Link 
                    to={`/blogs/${blog._id}/edit`} 
                    className="edit-btn"
                    title="Edit blog"
                  >
                    <FiEdit2 className="icon" />
                    Edit
                  </Link>
                )}

                {canDelete && (
                  <button 
                    onClick={handleDelete} 
                    className="delete-btn"
                    disabled={isDeleting}
                    title="Delete blog"
                  >
                    <FiTrash2 className="icon" />
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                )}
              </div>
            </div>
          </header>

          {/* Blog Content */}
          <div className="blog-content">
            {/* Election Info (if this is a winner announcement) */}
            {blog.isWinnerAnnouncement && blog.relatedElection && (
              <div className="election-info">
                <h3>🏆 Election Results</h3>
                <p>Results for: <strong>{blog.relatedElection.title}</strong></p>
              </div>
            )}

            {/* Main Content */}
            <div 
              className="blog-text"
              dangerouslySetInnerHTML={renderContent(blog.content)}
            />

            {/* Additional Images */}
            {blog.images && blog.images.length > 0 && (
              <div className="blog-images">
                <h4>Gallery</h4>
                <div className="images-grid">
                  {blog.images.map((image, index) => (
                    <div key={index} className="blog-image-item">
                      <img src={image.url} alt={image.caption || `Blog image ${index + 1}`} />
                      {image.caption && <p className="image-caption">{image.caption}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>

        {/* Comment Modal */}
        <CommentModal
          isOpen={showCommentsModal}
          onClose={() => setShowCommentsModal(false)}
          blogId={blog._id}
          blogTitle={blog.title}
        />
      </div>
    </div>
  );
};

export default BlogDetail;
