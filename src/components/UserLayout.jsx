import React from 'react';
import { Outlet } from 'react-router-dom';

const UserLayout = () => {
  return (
    <div className="user-layout dark-bg top-100">
      <div className="container">
        <Outlet />
      </div>
    </div>
  );
};

export default UserLayout;