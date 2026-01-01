import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice'; // Adjust import path

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      // Dispatch logout action
      await dispatch(logout()).unwrap();

      // Redirect to login page
      navigate('/login');

      // Optional: Show success message
      console.log('Logout successful');

    } catch (error) {
      console.error('Logout failed:', error);
      // Even if API call fails, we can still redirect to login
      navigate('/login');
    }
  };

  const confirmLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      handleLogout();
    }
  };

  return (
    <div className="admin-layout">
      {/* Left Sidebar */}
      <div className="admin-sidebar">
        {/* FitNation Logo */}
        <div className="sidebar-header">
          <h2 className="logo">FitNation</h2>
        </div>

        {/* User Profile */}
        <div className="sidebar-profile">
          <div className="profile-avatar">
            <img
              src={user?.avatar || "/src/assets/images/user1.jpg"}
              alt={user?.name || "Admin User"}
              onError={(e) => {
                e.target.src = "/default-avatar.png";
              }}
            />
          </div>
          <div className="profile-info">
            <span className="profile-label">
              {user?.role ? user.role.toUpperCase() : 'ADMIN'}
            </span>
            <span className="profile-name">
              {user?.name || 'Andrew Smith'}
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          <div className="nav-section">
            <span className="nav-label">MAIN</span>
            <ul className="nav-list">
              <li className="nav-item">
                <Link
                  to="/admin"
                  className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
                >
                  <span className="nav-icon">👥</span>
                  <span className="nav-text">Clients</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/admin/messages"
                  className={`nav-link ${location.pathname === '/admin/messages' ? 'active' : ''}`}
                >
                  <span className="nav-icon">💬</span>
                  <span className="nav-text">Messages</span>
                </Link>
              </li>
              {/* New Contacts/Chat Tab */}
              <li className="nav-item">
                <Link
                  to="/admin/contacts"
                  className={`nav-link ${location.pathname.startsWith('/admin/contacts') ? 'active' : ''}`}
                >
                  <span className="nav-icon">💬</span>
                  <span className="nav-text">Contacts & Chats</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="nav-section">
            <span className="nav-label">E-COMMERCE</span>
            <ul className="nav-list">
              <li className="nav-item">
                <Link
                  to="/admin/products"
                  className={`nav-link ${location.pathname === '/admin/products' ? 'active' : ''}`}
                >
                  <span className="nav-icon">📦</span>
                  <span className="nav-text">Products</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/admin/categories"
                  className={`nav-link ${location.pathname === '/admin/categories' ? 'active' : ''}`}
                >
                  <span className="nav-icon">📁</span>
                  <span className="nav-text">Categories</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/admin/workouts"
                  className={`nav-link ${location.pathname === '/admin/workouts' ? 'active' : ''}`}
                >
                  <span className="nav-icon">💪</span>
                  <span className="nav-text">Workouts</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/admin/meals"
                  className={`nav-link ${location.pathname === '/admin/meals' ? 'active' : ''}`}
                >
                  <span className="nav-icon">🍽️</span>
                  <span className="nav-text">Meals</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/admin/plans"
                  className={`nav-link ${location.pathname === '/admin/plans' ? 'active' : ''}`}
                >
                  <span className="nav-icon">📋</span>
                  <span className="nav-text">Plans</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/admin/partners"
                  className={`nav-link ${location.pathname === '/admin/partners' ? 'active' : ''}`}
                >
                  <span className="nav-icon">🏢</span>
                  <span className="nav-text">Partners</span>
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* Logout */}
        <div className="sidebar-footer">
          <button
            className="logout-btn"
            onClick={confirmLogout}
          >
            <span className="logout-icon">🚪</span>
            <span className="logout-text">Logout Account</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;