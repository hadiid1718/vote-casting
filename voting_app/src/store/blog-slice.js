import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import blogService from '../services/blogService';

// Initial state
const initialState = {
  blogs: [],
  currentBlog: null,
  comments: [],
  loading: false,
  blogLoading: false,
  commentsLoading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    total: 0
  },
  commentsPagination: {
    currentPage: 1,
    totalPages: 1,
    total: 0
  },
  filters: {
    search: '',
    tags: [],
    author: null
  }
};

// Async thunks

// Fetch all blogs
export const fetchBlogs = createAsyncThunk(
  'blog/fetchBlogs',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await blogService.getBlogs(params);
      return response;
    } catch (error) {
      // Don't show auth errors for public routes
      if (error.response?.status === 401) {
        return rejectWithValue(null); // Silent failure for auth issues on public route
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch blogs');
    }
  }
);

// Fetch single blog
export const fetchBlog = createAsyncThunk(
  'blog/fetchBlog',
  async (blogId, { rejectWithValue }) => {
    try {
      const response = await blogService.getBlog(blogId);
      return response;
    } catch (error) {
      // Don't show auth errors for public routes
      if (error.response?.status === 401) {
        return rejectWithValue(null); // Silent failure for auth issues on public route
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch blog');
    }
  }
);

// Create blog
export const createBlog = createAsyncThunk(
  'blog/createBlog',
  async (blogData, { rejectWithValue }) => {
    try {
      const response = await blogService.createBlog(blogData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create blog');
    }
  }
);

// Update blog
export const updateBlog = createAsyncThunk(
  'blog/updateBlog',
  async ({ blogId, blogData }, { rejectWithValue }) => {
    try {
      const response = await blogService.updateBlog(blogId, blogData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update blog');
    }
  }
);

// Delete blog
export const deleteBlog = createAsyncThunk(
  'blog/deleteBlog',
  async (blogId, { rejectWithValue }) => {
    try {
      await blogService.deleteBlog(blogId);
      return blogId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete blog');
    }
  }
);

// Upload blog images
export const uploadBlogImages = createAsyncThunk(
  'blog/uploadImages',
  async (images, { rejectWithValue }) => {
    try {
      const response = await blogService.uploadBlogImages(images);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload images');
    }
  }
);

// Toggle blog like
export const toggleBlogLike = createAsyncThunk(
  'blog/toggleLike',
  async (blogId, { rejectWithValue }) => {
    try {
      const response = await blogService.toggleBlogLike(blogId);
      return { blogId, ...response };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle like');
    }
  }
);

// Fetch blog comments
export const fetchBlogComments = createAsyncThunk(
  'blog/fetchComments',
  async ({ blogId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await blogService.getBlogComments(blogId, params);
      return response;
    } catch (error) {
      // Don't show auth errors for public routes
      if (error.response?.status === 401) {
        return rejectWithValue(null); // Silent failure for auth issues on public route
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch comments');
    }
  }
);

// Create comment
export const createComment = createAsyncThunk(
  'blog/createComment',
  async ({ blogId, commentData }, { rejectWithValue }) => {
    try {
      const response = await blogService.createComment(blogId, commentData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create comment');
    }
  }
);

// Update comment
export const updateComment = createAsyncThunk(
  'blog/updateComment',
  async ({ commentId, content }, { rejectWithValue }) => {
    try {
      const response = await blogService.updateComment(commentId, content);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update comment');
    }
  }
);

// Delete comment
export const deleteComment = createAsyncThunk(
  'blog/deleteComment',
  async (commentId, { rejectWithValue }) => {
    try {
      await blogService.deleteComment(commentId);
      return commentId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete comment');
    }
  }
);

// Toggle comment like
export const toggleCommentLike = createAsyncThunk(
  'blog/toggleCommentLike',
  async (commentId, { rejectWithValue }) => {
    try {
      const response = await blogService.toggleCommentLike(commentId);
      return { commentId, ...response };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle comment like');
    }
  }
);

// Blog slice
const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    clearCurrentBlog: (state) => {
      state.currentBlog = null;
    },
    clearComments: (state) => {
      state.comments = [];
      state.commentsPagination = initialState.commentsPagination;
    },
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    resetBlogState: () => initialState
  },
  extraReducers: (builder) => {
    builder
      // Fetch blogs
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload.blogs;
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          total: action.payload.total
        };
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch single blog
      .addCase(fetchBlog.pending, (state) => {
        state.blogLoading = true;
        state.error = null;
      })
      .addCase(fetchBlog.fulfilled, (state, action) => {
        state.blogLoading = false;
        state.currentBlog = action.payload;
      })
      .addCase(fetchBlog.rejected, (state, action) => {
        state.blogLoading = false;
        state.error = action.payload;
      })

      // Create blog
      .addCase(createBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs.unshift(action.payload);
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update blog
      .addCase(updateBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.blogs.findIndex(blog => blog._id === action.payload._id);
        if (index !== -1) {
          state.blogs[index] = action.payload;
        }
        if (state.currentBlog && state.currentBlog._id === action.payload._id) {
          state.currentBlog = action.payload;
        }
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete blog
      .addCase(deleteBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = state.blogs.filter(blog => blog._id !== action.payload);
        if (state.currentBlog && state.currentBlog._id === action.payload) {
          state.currentBlog = null;
        }
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Upload images
      .addCase(uploadBlogImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadBlogImages.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(uploadBlogImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Toggle blog like
      .addCase(toggleBlogLike.fulfilled, (state, action) => {
        const { blogId, likesCount, isLiked } = action.payload;
        
        // Update in blogs list
        const blogIndex = state.blogs.findIndex(blog => blog._id === blogId);
        if (blogIndex !== -1) {
          state.blogs[blogIndex].likesCount = likesCount;
        }
        
        // Update current blog
        if (state.currentBlog && state.currentBlog._id === blogId) {
          state.currentBlog.likesCount = likesCount;
        }
      })

      // Fetch comments
      .addCase(fetchBlogComments.pending, (state) => {
        state.commentsLoading = true;
        state.error = null;
      })
      .addCase(fetchBlogComments.fulfilled, (state, action) => {
        state.commentsLoading = false;
        state.comments = action.payload.comments;
        state.commentsPagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          total: action.payload.total
        };
      })
      .addCase(fetchBlogComments.rejected, (state, action) => {
        state.commentsLoading = false;
        state.error = action.payload;
      })

      // Create comment
      .addCase(createComment.fulfilled, (state, action) => {
        state.comments.unshift(action.payload);
        // Update blog comment count
        if (state.currentBlog) {
          state.currentBlog.commentsCount += 1;
        }
      })

      // Update comment
      .addCase(updateComment.fulfilled, (state, action) => {
        const index = state.comments.findIndex(comment => comment._id === action.payload._id);
        if (index !== -1) {
          state.comments[index] = action.payload;
        }
      })

      // Delete comment
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter(comment => comment._id !== action.payload);
        // Update blog comment count
        if (state.currentBlog) {
          state.currentBlog.commentsCount -= 1;
        }
      })

      // Toggle comment like
      .addCase(toggleCommentLike.fulfilled, (state, action) => {
        const { commentId, likesCount } = action.payload;
        const commentIndex = state.comments.findIndex(comment => comment._id === commentId);
        if (commentIndex !== -1) {
          state.comments[commentIndex].likesCount = likesCount;
        }
      });
  }
});

// Actions
export const {
  clearCurrentBlog,
  clearComments,
  clearError,
  setFilters,
  clearFilters,
  resetBlogState
} = blogSlice.actions;

// Selectors
export const selectBlogs = (state) => state.blog.blogs;
export const selectCurrentBlog = (state) => state.blog.currentBlog;
export const selectComments = (state) => state.blog.comments;
export const selectBlogLoading = (state) => state.blog.loading;
export const selectBlogError = (state) => state.blog.error;
export const selectBlogPagination = (state) => state.blog.pagination;
export const selectCommentsPagination = (state) => state.blog.commentsPagination;
export const selectBlogFilters = (state) => state.blog.filters;

export default blogSlice.reducer;
