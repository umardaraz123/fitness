import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <nav className="col-md-3 col-lg-2 d-md-block bg-light sidebar">
          <div className="position-sticky">
            <ul className="nav flex-column">
              <li className="nav-item">
                <Link className="nav-link" to="/admin">Dashboard</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/page">Page</Link>
              </li>
              {/* Add more admin links here */}
            </ul>
          </div>
        </nav>
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;