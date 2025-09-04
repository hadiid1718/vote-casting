import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiSave, FiX, FiImage, FiTag, FiUpload } from 'react-icons/fi';
import { createBlog, uploadBlogImages } from '../store/blog-slice';
import { getElections } from '../services';
import { toast } from 'react-toastify';

const CreateBlog = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.blog);
  const { currentVoter: user } = useSelector(state => state.vote);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: [],
    isWinnerAnnouncement: false,
    relatedElection: ''
  });
  const [featuredImage, setFeaturedImage] = useState(null);
  const [featuredImagePreview, setFeaturedImagePreview] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [elections, setElections] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  // Redirect if not admin
  useEffect(() => {
    if (user && !user.isAdmin) {
      toast.error('Only admins can create blogs');
      navigate('/blogs');
    }
  }, [user, navigate]);

  // Load elections for winner announcements
  useEffect(() => {
    const loadElections = async () => {
      try {
        const response = await getElections();
        setElections(response.elections || response || []);
      } catch (error) {
        console.error('Error loading elections:', error);
      }
    };

    if (formData.isWinnerAnnouncement) {
      loadElections();
    }
  }, [formData.isWinnerAnnouncement]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFeaturedImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2000000) {
        toast.error('Featured image must be less than 2MB');
        return;
      }

      setFeaturedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setFeaturedImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const removeFeaturedImage = () => {
    setFeaturedImage(null);
    setFeaturedImagePreview('');
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    const tag = tagInput.trim();
    
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleContentImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;

    // Validate file sizes
    const oversizedFiles = files.filter(file => file.size > 2000000);
    if (oversizedFiles.length > 0) {
      toast.error('All images must be less than 2MB');
      return;
    }

    setUploadingImages(true);
    try {
      const response = await dispatch(uploadBlogImages(files)).unwrap();
      
      // Insert image URLs into content
      let imageHtml = '';
      response.images.forEach((image, index) => {
        imageHtml += `<img src="${image.url}" alt="Blog image ${index + 1}" style="max-width: 500px; width: 100%; height: auto; margin: 10px 0; border-radius: 8px; display: block;" />`;
      });

      setFormData(prev => ({
        ...prev,
        content: prev.content + imageHtml
      }));

      toast.success('Images uploaded successfully!');
    } catch (error) {
      toast.error(error);
    } finally {
      setUploadingImages(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    const blogData = {
      ...formData,
      featuredImage
    };

    try {
      const newBlog = await dispatch(createBlog(blogData)).unwrap();
      toast.success('Blog created successfully!');
      navigate(`/blogs/${newBlog._id}`);
    } catch (error) {
      toast.error(error);
    }
  };

  const handleCancel = () => {
    if (formData.title || formData.content || featuredImage) {
      const confirmLeave = window.confirm('Are you sure you want to leave? Your changes will be lost.');
      if (!confirmLeave) return;
    }
    navigate('/blogs');
  };

  return (
    <div className="create-blog-page">
      <div className="container">
        <div className="page-header">
          <h1>Create New Blog</h1>
          <p>Share updates, announcements, and insights with the community</p>
        </div>

        <form onSubmit={handleSubmit} className="blog-form">
          {/* Title */}
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Blog Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter blog title..."
              required
            />
          </div>

          {/* Featured Image */}
          <div className="form-group">
            <label className="form-label">
              Featured Image
            </label>
            <div className="image-upload-section">
              {featuredImagePreview ? (
                <div className="featured-image-preview">
                  <img src={featuredImagePreview} alt="Featured image preview" />
                  <button
                    type="button"
                    onClick={removeFeaturedImage}
                    className="remove-image-btn"
                  >
                    <FiX className="icon" />
                  </button>
                </div>
              ) : (
                <div className="image-upload-area">
                  <input
                    type="file"
                    id="featuredImage"
                    accept="image/*"
                    onChange={handleFeaturedImageChange}
                    className="file-input"
                  />
                  <label htmlFor="featuredImage" className="file-input-label">
                    <FiImage className="icon" />
                    <span>Upload Featured Image</span>
                    <small>Max 2MB (JPG, PNG, WEBP)</small>
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="form-group">
            <label className="form-label">
              Tags
            </label>
            <div className="tags-input-section">
              <div className="tag-input-wrapper">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add a tag..."
                  className="tag-input"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag(e)}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="add-tag-btn"
                >
                  <FiTag className="icon" />
                  Add
                </button>
              </div>
              
              {formData.tags.length > 0 && (
                <div className="tags-list">
                  {formData.tags.map((tag, index) => (
                    <span key={index} className="tag-item">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="remove-tag-btn"
                      >
                        <FiX className="icon" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Winner Announcement Toggle */}
          <div className="form-group">
            <div className="checkbox-wrapper">
              <input
                type="checkbox"
                id="isWinnerAnnouncement"
                name="isWinnerAnnouncement"
                checked={formData.isWinnerAnnouncement}
                onChange={handleInputChange}
                className="checkbox-input"
              />
              <label htmlFor="isWinnerAnnouncement" className="checkbox-label">
                🏆 This is a winner announcement
              </label>
            </div>
          </div>

          {/* Related Election (if winner announcement) */}
          {formData.isWinnerAnnouncement && (
            <div className="form-group">
              <label htmlFor="relatedElection" className="form-label">
                Related Election
              </label>
              <select
                id="relatedElection"
                name="relatedElection"
                value={formData.relatedElection}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="">Select an election...</option>
                {elections.map((election) => (
                  <option key={election._id} value={election._id}>
                    {election.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Content Editor */}
          <div className="form-group">
            <div className="content-header">
              <label htmlFor="content" className="form-label">
                Blog Content *
              </label>
              <div className="content-tools">
                <input
                  type="file"
                  id="contentImages"
                  accept="image/*"
                  multiple
                  onChange={handleContentImageUpload}
                  className="file-input"
                />
                <label
                  htmlFor="contentImages"
                  className={`upload-images-btn ${uploadingImages ? 'uploading' : ''}`}
                >
                  <FiUpload className="icon" />
                  {uploadingImages ? 'Uploading...' : 'Add Images'}
                </label>
              </div>
            </div>
            
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              className="content-textarea"
              rows="15"
              placeholder="Write your blog content here... You can use HTML tags for formatting."
              required
            />
            <small className="form-hint">
              Tip: You can use HTML tags for formatting (e.g., &lt;h3&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, etc.)
            </small>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="cancel-btn"
              disabled={loading}
            >
              Cancel
            </button>
            
            <button
              type="submit"
              className="submit-btn"
              disabled={loading || !formData.title.trim() || !formData.content.trim()}
            >
              <FiSave className="icon" />
              {loading ? 'Creating...' : 'Create Blog'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;
