import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminDashboard = () => {
  const { currentVoter } = useSelector(state => state.vote);

  if (!currentVoter.isAdmin) {
    return (
      <div className="admin-dashboard">
        <div className="container">
          <div className="access-denied">
            <h2>Access Denied</h2>
            <p>You need administrator privileges to access this dashboard.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <p>Manage your voting system and voter registrations</p>
        </div>

        <div className="admin-features-grid">
          <div className="admin-feature-card">
            <div className="feature-icon">
              <i className="fas fa-pen"></i>
            </div>
            <h3>Create Blog</h3>
            <p>Write and publish blog posts for announcements and updates.</p>
            <Link to="/blogs/create" className="feature-link">
              <i className="fas fa-plus"></i>
              Create Blog
            </Link>
          </div>

          <div className="admin-feature-card">
            <div className="feature-icon">
              <i className="fas fa-poll"></i>
            </div>
            <h3>Manage Elections</h3>
            <p>Create, update, and monitor election processes and results.</p>
            <Link to="/elections" className="feature-link">
              <i className="fas fa-cog"></i>
              Manage Elections
            </Link>
          </div>

          <div className="admin-feature-card">
            <div className="feature-icon">
              <i className="fas fa-chart-bar"></i>
            </div>
            <h3>View Results</h3>
            <p>Monitor election results and voting statistics in real-time.</p>
            <Link to="/results" className="feature-link">
              <i className="fas fa-eye"></i>
              View Results
            </Link>
          </div>

          <div className="admin-feature-card">
            <div className="feature-icon">
              <i className="fas fa-users"></i>
            </div>
            <h3>Manage Students</h3>
            <p>Add, edit, and manage student accounts with departments and student IDs.</p>
            <Link to="/students" className="feature-link">
              <i className="fas fa-user-plus"></i>
              Manage Students
            </Link>
          </div>
        </div>

        <div className="dashboard-stats">
          <h2>Quick Stats</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-users"></i>
              </div>
              <div className="stat-info">
                <h3>Total Voters</h3>
                <p>Registered users in the system</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-poll-h"></i>
              </div>
              <div className="stat-info">
                <h3>Active Elections</h3>
                <p>Currently running elections</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-blog"></i>
              </div>
              <div className="stat-info">
                <h3>Blog Posts</h3>
                <p>Published announcements</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
