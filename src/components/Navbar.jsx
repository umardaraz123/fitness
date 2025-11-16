import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// import { Search, ShoppingCart, User } from 'lucide-react';
import Logo from '../assets/images/logo.svg';
import User from '../assets/images/user.svg';
import Search from '../assets/images/search.svg';
import Cart from '../assets/images/cart.svg';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Check if user is on dashboard pages
  const isDashboard = location.pathname.startsWith('/dashboard');
  
  // Get initials from name
  const getInitials = (name) => {
    if (!name) return 'U';
    const names = name.trim().split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    // Clear user session
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    
    // Redirect to home page
    navigate('/');
    setShowUserDropdown(false);
  };

  const handleProfileClick = () => {
    navigate('/dashboard/edit-profile');
    setShowUserDropdown(false);
  };

  const handleDashboardClick = () => {
    navigate('/dashboard/my-orders');
    setShowUserDropdown(false);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-transparent">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img src={Logo} alt="Logo"  />
        </Link>
        
        {/* Mobile Menu Toggle */}
        <button 
          className="navbar-toggler" 
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{
            border: 'none',
            background: 'transparent',
            padding: '8px',
            cursor: 'pointer',
            display: 'none'
          }}
        >
          <span style={{ fontSize: '24px', color: '#fff' }}>☰</span>
        </button>

        <div className={`navbar-nav mx-auto ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
          <Link className="nav-link" to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <Link className="nav-link" to="/products" onClick={() => setIsMobileMenuOpen(false)}>Shop</Link>
          <Link className="nav-link" to="/plans" onClick={() => setIsMobileMenuOpen(false)}>Fitness Programs</Link>
          <Link className="nav-link" to="/meals" onClick={() => setIsMobileMenuOpen(false)}>Meals</Link>
          <Link className="nav-link" to="/membership" onClick={() => setIsMobileMenuOpen(false)}>Membership</Link>
        </div>
        <div className="d-flex align-items-center navbar-actions">
          <button className="btn btn-link text-dark me-3" style={{ border: 'none', background: 'transparent' }}>
            <img src={Search} alt="Search" />
          </button>
          <Link to="/cart" className="btn btn-link text-dark me-3" style={{ border: 'none', background: 'transparent' }}>
            <img src={Cart} alt="Cart" />
          </Link>
          
          {isDashboard ? (
            // User Avatar Dropdown for Dashboard
            <div className="user-avatar-dropdown" ref={dropdownRef}>
              <button 
                className={`avatar-button ${showUserDropdown ? 'active' : ''}`}
                onClick={() => setShowUserDropdown(!showUserDropdown)}
              >
                {user?.profile_image ? (
                  <img 
                    src={user.profile_image} 
                    alt={user?.name || 'User'}
                    className="avatar-image"
                  />
                ) : (
                  <div className="avatar-initials">
                    {getInitials(user?.name || 'User')}
                  </div>
                )}
                <span className="avatar-name">
                  {user?.name || 'User'}
                </span>
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  className="avatar-arrow"
                >
                  <polyline points="6,9 12,15 18,9"></polyline>
                </svg>
              </button>
              
              {showUserDropdown && (
                <div className="dropdown-menu">
                  <div className="user-info">
                    <div className="user-name">{user?.name || 'User'}</div>
                    <div className="user-email">{user?.email || ''}</div>
                  </div>
                  
                  <button onClick={handleDashboardClick} className="dropdown-item">
                    📊 Dashboard
                  </button>
                  
                  <button onClick={handleProfileClick} className="dropdown-item">
                    ⚙️ Edit Profile
                  </button>
                  
                  <Link to="/" className="dropdown-item" onClick={() => setShowUserDropdown(false)}>
                    🏠 Home
                  </Link>
                  
                  <button onClick={handleLogout} className="dropdown-item logout">
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Regular user icon for non-dashboard pages
            <>
              <button className="btn btn-link text-dark me-3" style={{ border: 'none', background: 'transparent' }}>
                <img src={User} alt="User" />
              </button>
              <Link to="/register" className="button">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;