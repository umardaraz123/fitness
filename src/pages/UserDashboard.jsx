import React, { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';

const UserDashboard = () => {
  const location = useLocation();
  
  const tabs = [
    { id: 'my-orders', label: 'My Orders', path: '/user/dashboard/my-orders' },
    { id: 'wishlist', label: 'Wishlist', path: '/user/dashboard/wishlist' },
    { id: 'profile', label: 'Profile', path: '/user/dashboard/profile' },
    { id: 'settings', label: 'Settings', path: '/user/dashboard/settings' }
  ];

  const getActiveTab = () => {
    const currentPath = location.pathname;
    if (currentPath.includes('/my-orders')) return 'my-orders';
    if (currentPath.includes('/wishlist')) return 'wishlist';
    if (currentPath.includes('/profile')) return 'profile';
    if (currentPath.includes('/settings')) return 'settings';
    return 'my-orders'; // default
  };

  return (
    <div className="user-dashboard-container dark-bg top-100">
      <div className="container">
        <div className="dashboard-header mb-32">
          <h1 className="dashboard-title">Profile</h1>
        </div>

        {/* Dashboard Tabs */}
        <div className="dashboard-tabs mb-40">
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
    </div>
  );
};

export default UserDashboard;