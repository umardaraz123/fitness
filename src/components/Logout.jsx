import React from 'react';

const Logout = () => {
  const handleLogout = () => {
    // Clear user session/token
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    
    // Redirect to login page
    window.location.href = '/';
    
    console.log('User logged out');
  };

  const handleCancel = () => {
    // Navigate back to My Orders tab
    window.location.href = '/dashboard/my-orders';
  };

  return (
    <div className="my-orders-section">
      <h2 className="orders-title">Logout</h2>
      
      <div className="order-group">
        <div className="order-header">
          <div className="order-info">
            <div className="order-id">Confirm Logout</div>
            <div className="order-details">
              <span className="buy-again-text">Are you sure you want to logout from your account?</span>
            </div>
          </div>
        </div>
        
        <div className="order-items">
          <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            <div style={{ marginBottom: '32px' }}>
              <svg 
                width="64" 
                height="64" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                style={{ color: '#999', margin: '0 auto 16px' }}
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16,17 21,12 16,7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              
              <h3 style={{ color: '#fff', fontSize: '20px', marginBottom: '8px' }}>
                Logout from FitLife
              </h3>
              <p style={{ color: '#999', fontSize: '14px', lineHeight: '1.5' }}>
                You will be signed out from your account and redirected to the home page. 
                Your progress and data will be saved and available when you log back in.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <button 
                onClick={handleCancel}
                style={{
                  padding: '12px 24px',
                  background: '#333',
                  color: '#fff',
                  border: '1px solid #555',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => e.target.style.background = '#444'}
                onMouseOut={(e) => e.target.style.background = '#333'}
              >
                Cancel
              </button>
              <button 
                onClick={handleLogout}
                className="logout-btn"
                style={{
                  padding: '12px 24px',
                  background: '#dc2626',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => e.target.style.background = '#b91c1c'}
                onMouseOut={(e) => e.target.style.background = '#dc2626'}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logout;