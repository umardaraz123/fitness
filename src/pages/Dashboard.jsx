import React, { useState } from 'react';
import { useLocation, Link, Outlet, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Mock user data
  const userData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: '/src/assets/images/user1.jpg',
    joinDate: 'Member since Jan 2024'
  };

  const notifications = [
    { id: 1, text: 'Your workout plan has been updated', time: '2 hours ago', type: 'info' },
    { id: 2, text: 'New meal plan available', time: '1 day ago', type: 'success' },
    { id: 3, text: 'Membership expires in 30 days', time: '3 days ago', type: 'warning' }
  ];
  
  const tabs = [
    { id: 'my-orders', label: 'My Orders', path: '/dashboard/my-orders' },
    { id: 'meal-plans', label: 'Meal Plans', path: '/dashboard/meal-plans' },
    { id: 'workout-plans', label: 'Workout Plans', path: '/dashboard/workout-plans' },
    { id: 'payment-details', label: 'Payment Details', path: '/dashboard/payment-details' },
    { id: 'edit-profile', label: 'Edit Profile', path: '/dashboard/edit-profile' },
    { id: 'logout', label: 'Logout', path: '/dashboard/logout' }
  ];

  const getActiveTab = () => {
    const currentPath = location.pathname;
    if (currentPath.includes('/my-orders') || currentPath === '/dashboard' || currentPath === '/dashboard/') return 'my-orders';
    if (currentPath.includes('/meal-plans')) return 'meal-plans';
    if (currentPath.includes('/workout-plans')) return 'workout-plans';
    if (currentPath.includes('/my-memberships')) return 'my-memberships';
    if (currentPath.includes('/edit-profile')) return 'edit-profile';
    if (currentPath.includes('/logout')) return 'logout';
    return 'my-orders'; // default
  };

  const getPageTitle = () => {
    const activeTab = getActiveTab();
    const tab = tabs.find(t => t.id === activeTab);
    return tab ? tab.label : 'Dashboard';
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    navigate('/');
  };

  return (
    <div className="user-dashboard-container">
      {/* Modern Topbar */}
      <div className="dashboard-topbar mt-4">
        <div className="topbar-left">
          <div className="welcome-section">
            <h1 className="dashboard-main-title">Welcome back, {userData.name.split(' ')[0]}! 👋</h1>
            <p className="dashboard-subtitle">Manage your fitness journey from your personal dashboard</p>
          </div>
        </div>
        
        <div className="topbar-right">
          {/* Notifications */}
          {/* <div className="notification-wrapper">
            <button 
              className="notification-btn"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              <span className="notification-badge">{notifications.length}</span>
            </button>
            
            {showNotifications && (
              <div className="notification-dropdown">
                <div className="notification-header">
                  <h4>Notifications</h4>
                  <span className="notification-count">{notifications.length} new</span>
                </div>
                <div className="notification-list">
                  {notifications.map(notification => (
                    <div key={notification.id} className={`notification-item ${notification.type}`}>
                      <div className="notification-text">{notification.text}</div>
                      <div className="notification-time">{notification.time}</div>
                    </div>
                  ))}
                </div>
                <div className="notification-footer">
                  <button className="view-all-btn">View all notifications</button>
                </div>
              </div>
            )}
          </div> */}

          {/* User Profile Quick Info */}
          <div className="user-quick-info">
            <div className="user-details">
              <div className="user-name">{userData.name}</div>
              <div className="user-status">{userData.joinDate}</div>
            </div>
            <div className="user-avatar">
              <img src={userData.avatar} alt={userData.name} />
              <div className="online-indicator"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Page Header */}
      <div className="dashboard-header">
        <h2 className="page-title">{getPageTitle()}</h2>
        <div className="page-breadcrumb">
          <span>Dashboard</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9,18 15,12 9,6"></polyline>
          </svg>
          <span>{getPageTitle()}</span>
        </div>
      </div>

      {/* Dashboard Tabs */}
      <div className="dashboard-tabs">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            to={tab.path}
            className={`dashboard-tab ${getActiveTab() === tab.id ? 'active' : ''}`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Tab Content */}
      <div className="dashboard-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;