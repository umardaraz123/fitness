import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const AdminLayout = () => {
  const location = useLocation();

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
            <img src="/src/assets/images/user1.jpg" alt="Andrew Smith" />
          </div>
          <div className="profile-info">
            <span className="profile-label">WORKOUT PLAN TRAINER</span>
            <span className="profile-name">Andrew Smith</span>
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
            </ul>
          </div>
        </nav>

        {/* Logout */}
        <div className="sidebar-footer">
          <button className="logout-btn">
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