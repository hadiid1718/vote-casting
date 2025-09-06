import api from './api';

// Blog CRUD operations
export const blogService = {
  // Get all blogs with optional filters
  getBlogs: async (params = {}) => {
    try {
      const response = await api.get('/blogs', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get single blog by ID
  getBlog: async (blogId) => {
    try {
      const response = await api.get(`/blogs/${blogId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new blog (admin only)
  createBlog: async (blogData) => {
    try {
      const formData = new FormData();
      
      // Append basic fields
      formData.append('title', blogData.title);
      formData.append('content', blogData.content);
      
      // Handle tags
      if (blogData.tags && blogData.tags.length > 0) {
        if (Array.isArray(blogData.tags)) {
          formData.append('tags', blogData.tags.join(','));
        } else {
          formData.append('tags', blogData.tags);
        }
      }
      
      // Handle optional fields
      if (blogData.isWinnerAnnouncement !== undefined) {
        formData.append('isWinnerAnnouncement', blogData.isWinnerAnnouncement);
      }
      
      if (blogData.relatedElection) {
        formData.append('relatedElection', blogData.relatedElection);
      }
      
      // Handle featured image
      if (blogData.featuredImage && blogData.featuredImage instanceof File) {
        formData.append('featuredImage', blogData.featuredImage);
      }

      const response = await api.post('/blogs', formData, {
        headers: {
          // Don't set Content-Type - let browser set it with boundary
        },
      });
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update blog (admin only)
  updateBlog: async (blogId, blogData) => {
    try {
      const formData = new FormData();
      
      // Append fields that are being updated
      if (blogData.title) formData.append('title', blogData.title);
      if (blogData.content) formData.append('content', blogData.content);
      
      if (blogData.tags !== undefined) {
        if (Array.isArray(blogData.tags)) {
          formData.append('tags', blogData.tags.join(','));
        } else {
          formData.append('tags', blogData.tags);
        }
      }
      
      if (blogData.isWinnerAnnouncement !== undefined) {
        formData.append('isWinnerAnnouncement', blogData.isWinnerAnnouncement);
      }
      
      if (blogData.relatedElection !== undefined) {
        formData.append('relatedElection', blogData.relatedElection || '');
      }
      
      // Handle featured image update
      if (blogData.featuredImage instanceof File) {
        formData.append('featuredImage', blogData.featuredImage);
      }

      const response = await api.patch(`/blogs/${blogId}`, formData, {
        headers: {
          // Don't set Content-Type - let browser set it with boundary
        },
      });
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete blog (admin only)
  deleteBlog: async (blogId) => {
    try {
      const response = await api.delete(`/blogs/${blogId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Upload images for blog content (admin only)
  uploadBlogImages: async (images) => {
    try {
      const formData = new FormData();
      
      if (Array.isArray(images)) {
        images.forEach((image) => {
          formData.append('images', image);
        });
      } else {
        formData.append('images', images);
      }

      const response = await api.post('/blogs/upload-images', formData, {
        headers: {
          // Don't set Content-Type - let browser set it with boundary
        },
      });
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Like/Unlike blog
  toggleBlogLike: async (blogId) => {
    try {
      const response = await api.patch(`/blogs/${blogId}/like`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get blog comments
  getBlogComments: async (blogId, params = {}) => {
    try {
      const response = await api.get(`/blogs/${blogId}/comments`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create comment
  createComment: async (blogId, commentData) => {
    try {
      const response = await api.post(`/blogs/${blogId}/comments`, commentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update comment
  updateComment: async (commentId, content) => {
    try {
      const response = await api.patch(`/comments/${commentId}`, { content });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete comment
  deleteComment: async (commentId) => {
    try {
      const response = await api.delete(`/comments/${commentId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Like/Unlike comment
  toggleCommentLike: async (commentId) => {
    try {
      const response = await api.patch(`/comments/${commentId}/like`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Pin/Unpin comment (admin only)
  toggleCommentPin: async (commentId) => {
    try {
      const response = await api.patch(`/comments/${commentId}/pin`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default blogService;
