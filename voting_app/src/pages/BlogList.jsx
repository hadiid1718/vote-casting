import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiPlus, FiSearch, FiFilter } from 'react-icons/fi';
import { fetchBlogs, setFilters, clearFilters } from '../store/blog-slice';
import BlogCard from '../components/BlogCard';
import { toast } from 'react-toastify';

const BlogList = () => {
  const dispatch = useDispatch();
  const { 
    blogs, 
    loading, 
    pagination, 
    filters, 
    error 
  } = useSelector(state => state.blog);
  const { currentVoter: user } = useSelector(state => state.vote);

  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [selectedTag, setSelectedTag] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Get all unique tags from blogs
  const allTags = [...new Set(blogs.flatMap(blog => blog.tags || []))];

  useEffect(() => {
    // Load blogs on component mount
    loadBlogs();
  }, [dispatch]);

  useEffect(() => {
    // Show error toast if there's an error (but not null errors from auth issues)
    if (error && error !== null) {
      toast.error(error);
    }
  }, [error]);

  const loadBlogs = (params = {}) => {
    const searchParams = {
      page: 1,
      limit: 12,
      ...filters,
      ...params
    };

    // Remove empty values
    Object.keys(searchParams).forEach(key => {
      if (!searchParams[key] || (Array.isArray(searchParams[key]) && searchParams[key].length === 0)) {
        delete searchParams[key];
      }
    });

    dispatch(fetchBlogs(searchParams));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const newFilters = { ...filters, search: searchTerm.trim() };
    dispatch(setFilters(newFilters));
    loadBlogs({ search: searchTerm.trim(), page: 1 });
  };

  const handleTagFilter = (tag) => {
    const newFilters = { ...filters, tags: tag ? [tag] : [] };
    dispatch(setFilters(newFilters));
    setSelectedTag(tag);
    loadBlogs({ tags: tag || undefined, page: 1 });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedTag('');
    dispatch(clearFilters());
    loadBlogs({});
  };

  const loadMoreBlogs = () => {
    if (pagination.currentPage < pagination.totalPages) {
      const nextPage = pagination.currentPage + 1;
      const searchParams = {
        ...filters,
        page: nextPage,
        limit: 12
      };

      // Remove empty values
      Object.keys(searchParams).forEach(key => {
        if (!searchParams[key] || (Array.isArray(searchParams[key]) && searchParams[key].length === 0)) {
          delete searchParams[key];
        }
      });

      dispatch(fetchBlogs(searchParams)).then((action) => {
        if (action.type === 'blog/fetchBlogs/fulfilled') {
          // Append new blogs to existing ones (for pagination)
          // This is handled in the reducer already
        }
      });
    }
  };

  const hasActiveFilters = filters.search || (filters.tags && filters.tags.length > 0);

  return (
    <div className="blog-list-page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <div className="header-content">
            <h1 className="page-title">Latest Blogs & Announcements</h1>
            <p className="page-subtitle">
              Stay updated with the latest election results, announcements, and insights
            </p>
          </div>
          
          {user?.isAdmin && (
            <Link to="/blogs/create" className="create-blog-btn">
              <FiPlus className="icon" />
              Create New Blog
            </Link>
          )}
        </div>

        {/* Search and Filters */}
        <div className="blog-filters">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-wrapper">
              <FiSearch className="search-icon" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search blogs..."
                className="search-input"
              />
              <button type="submit" className="search-btn">
                Search
              </button>
            </div>
          </form>

          <div className="filter-controls">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`filter-toggle-btn ${showFilters ? 'active' : ''}`}
            >
              <FiFilter className="icon" />
              Filters
            </button>

            {hasActiveFilters && (
              <button onClick={handleClearFilters} className="clear-filters-btn">
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="filter-section">
            <div className="tag-filters">
              <label className="filter-label">Filter by Tag:</label>
              <div className="tag-buttons">
                <button
                  onClick={() => handleTagFilter('')}
                  className={`tag-button ${!selectedTag ? 'active' : ''}`}
                >
                  All
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagFilter(tag)}
                    className={`tag-button ${selectedTag === tag ? 'active' : ''}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results Info */}
        {!loading && (
          <div className="results-info">
            <p>
              {hasActiveFilters ? (
                <>Showing {pagination.total} results for your search</>
              ) : (
                <>Showing {pagination.total} blogs</>
              )}
            </p>
          </div>
        )}

        {/* Blogs Grid */}
        <div className="blogs-grid">
          {loading && blogs.length === 0 ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading blogs...</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h3>No blogs found</h3>
              <p>
                {hasActiveFilters 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No blogs have been published yet.'
                }
              </p>
              {hasActiveFilters && (
                <button onClick={handleClearFilters} className="clear-filters-btn">
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <>
              {blogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </>
          )}
        </div>

        {/* Load More Button */}
        {!loading && pagination.currentPage < pagination.totalPages && (
          <div className="load-more-section">
            <button
              onClick={loadMoreBlogs}
              className="load-more-btn"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Load More Blogs'}
            </button>
          </div>
        )}

        {/* Pagination Info */}
        {pagination.totalPages > 1 && (
          <div className="pagination-info">
            <p>
              Page {pagination.currentPage} of {pagination.totalPages}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogList;
