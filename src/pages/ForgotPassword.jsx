import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/images/logo.svg';
import Icon from '../assets/images/icon.svg';
import { useToast } from '../context/ToastContext';
import { authAPI } from '../services/api.service';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = () => {
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleContinue = async () => {
    setError('');
    
    if (!validateEmail()) {
      return;
    }

    setLoading(true);

    try {
      // API call with email parameter only
      const response = await authAPI.forgotPassword(email);

      console.log('Forgot Password Response:', response);

      // Response: { success: true, message: "OTP sent to your email", data: [] }
      if (response.success) {
        showSuccess(response.message || 'OTP sent to your email');
        
        console.log('Navigating to /auth-code with email:', email);
        
        // Navigate to auth-code page with email
        navigate('/auth-code', { state: { email } });
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      
      if (err.response?.data?.message) {
        setError(err.response.data.message);
        showError(err.response.data.message);
      } else {
        setError('Failed to send OTP. Please try again.');
        showError('Failed to send OTP. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) {
      setError('');
    }
  };

  return (
    <div className="forgot-container">
      <div className="logo">
        <img src={Logo} alt="Logo" />
      </div>
      <div className="content">
        <h2 className="title text-center">
            Forgot Password
        </h2>
        <div className="icon">
            <img src={Icon} alt="" />
        </div>
        <p className="text px-5">
            Please enter your email and we will send an OTP code in the next step to reset your password
        </p>
        
        {error && (
          <div style={{ 
            padding: '12px', 
            marginBottom: '16px', 
            backgroundColor: '#ff444420', 
            border: '1px solid #ff4444', 
            borderRadius: '8px',
            color: '#ff4444',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}
        
        <label htmlFor="email" className="label">Email</label>
        <input 
          type="email" 
          id="email"
          className={`input ${error ? 'error' : ''}`}
          placeholder="john@example.com"
          value={email}
          onChange={handleEmailChange}
          disabled={loading}
        />
        
        <button 
          className="button" 
          onClick={handleContinue}
          disabled={loading}
        >
           {loading ? 'Sending...' : 'Continue'}
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;