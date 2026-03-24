import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import BlogList from '../pages/BlogList';
import CreateBlog from '../pages/CreateBlog';
import Elections from '../pages/Elections';
import Result from '../pages/Result';
import StudentManagement from './StudentManagement';
import { blogService, electionService, voterService } from '../services';
import './AdminDashboard.css';

const DashboardOverview = ({ stats }) => (
  <section className="dashboard-section">
    <h2 className="section-title">Dashboard Overview</h2>
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon users-stat">
          <i className="fas fa-users"></i>
        </div>
        <div className="stat-info">
          <h3>Total Voters</h3>
          <p>Registered users in the system</p>
        </div>
        <div className="stat-number">
          {stats.loading ? '—' : stats.totalVoters}
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon elections-stat">
          <i className="fas fa-poll-h"></i>
        </div>
        <div className="stat-info">
          <h3>Active Elections</h3>
          <p>Currently running elections</p>
        </div>
        <div className="stat-number">
          {stats.loading ? '—' : stats.activeElections}
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon blogs-stat">
          <i className="fas fa-blog"></i>
        </div>
        <div className="stat-info">
          <h3>Blog Posts</h3>
          <p>Published announcements</p>
        </div>
        <div className="stat-number">
          {stats.loading ? '—' : stats.blogPosts}
        </div>
      </div>
    </div>

    {stats.error && (
      <p className="form__error-message" style={{ marginTop: '1rem' }}>
        {stats.error}
      </p>
    )}
  </section>
);

const AdminDashboard = () => {
  const { currentVoter } = useSelector(state => state.vote);
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState({
    totalVoters: 0,
    activeElections: 0,
    blogPosts: 0,
    loading: false,
    error: null,
  });

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

  const menuItems = useMemo(() => ([
    { id: 'overview', label: 'Dashboard', icon: 'fas fa-home', section: 'Main' },
    { id: 'create-blog', label: 'Create Blog', icon: 'fas fa-pen', section: 'Blogs' },
    { id: 'manage-blogs', label: 'Manage Blogs', icon: 'fas fa-blog', section: 'Blogs' },
    { id: 'manage-elections', label: 'Manage Elections', icon: 'fas fa-poll', section: 'Elections' },
    { id: 'view-results', label: 'View Results', icon: 'fas fa-chart-bar', section: 'Elections' },
    { id: 'manage-students', label: 'Manage Students', icon: 'fas fa-users', section: 'Users' },
  ]), []);

  const groupedItems = useMemo(() => (
    menuItems.reduce((acc, item) => {
      if (!acc[item.section]) acc[item.section] = [];
      acc[item.section].push(item);
      return acc;
    }, {})
  ), [menuItems]);

  const activeTitle = useMemo(() => {
    const found = menuItems.find(i => i.id === activeTab);
    return found?.label || 'Admin Dashboard';
  }, [activeTab, menuItems]);

  const loadStats = async () => {
    if (!currentVoter.isAdmin) return;

    setStats(prev => ({ ...prev, loading: true, error: null }));
    try {
      const [elections, students, blogsResponse] = await Promise.all([
        electionService.getElections(),
        voterService.getAllStudents(),
        // Fetch minimal blog payload but with total count
        blogService.getBlogs({ page: 1, limit: 1 }),
      ]);

      const electionsList = Array.isArray(elections) ? elections : [];
      const studentsList = Array.isArray(students) ? students : [];
      const activeElections = electionsList.filter(e => e?.status === 'active').length;

      const blogPosts =
        typeof blogsResponse?.total === 'number'
          ? blogsResponse.total
          : Array.isArray(blogsResponse?.blogs)
            ? blogsResponse.blogs.length
            : 0;

      setStats({
        totalVoters: studentsList.length,
        activeElections,
        blogPosts,
        loading: false,
        error: null,
      });
    } catch (err) {
      const message =
        typeof err === 'string'
          ? err
          : err?.message || 'Failed to load dashboard stats';

      setStats(prev => ({ ...prev, loading: false, error: message }));
    }
  };

  // Keep stats fresh while on the overview tab
  useEffect(() => {
    if (!currentVoter.isAdmin) return;
    if (activeTab !== 'overview') return;

    loadStats();

    const intervalId = setInterval(() => {
      loadStats();
    }, 15000);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, currentVoter.isAdmin]);

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardOverview stats={stats} />;
      case 'create-blog':
        return <CreateBlog />;
      case 'manage-blogs':
        return <BlogList />;
      case 'manage-elections':
        return <Elections />;
      case 'view-results':
        return <Result />;
      case 'manage-students':
        return <StudentManagement />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="admin-dashboard-container">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title="Toggle sidebar"
          >
            <i className={`fas fa-chevron-${sidebarOpen ? 'left' : 'right'}`}></i>
          </button>
        </div>

        {/* NOTE: use a div (not <nav>) because global CSS targets nav {} for the top Navbar */}
        <div className="sidebar-nav">
          {Object.entries(groupedItems).map(([section, items]) => (
            <div key={section} className="nav-section">
              <p className="nav-section-title">{section}</p>
              {items.map(item => (
                <button
                  key={item.id}
                  className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    // Close sidebar on mobile after selection
                    if (window.innerWidth < 768) {
                      setSidebarOpen(false);
                    }
                  }}
                >
                  <i className={item.icon}></i>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          ))}
        </div>

        <div className="sidebar-footer">
          <div className="admin-info">
            <i className="fas fa-user-circle"></i>
            <div className="admin-details">
              <p className="admin-name">{currentVoter.fullName || 'Admin'}</p>
              <p className="admin-role">Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main-content">
        <div className="content-header">
          <div className="header-left">
            <h1>{activeTitle}</h1>
            <p>Use the sidebar to manage the system</p>
          </div>
          <button 
            className="mobile-sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <i className="fas fa-bars"></i>
          </button>
        </div>

        <div className="dashboard-content">
          {renderContent()}
        </div>
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default AdminDashboard;
