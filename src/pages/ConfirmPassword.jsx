import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import Logo from '../assets/images/logo.svg';
import Icon from '../assets/images/icon.svg';
import { useToast } from '../context/ToastContext';
import { authAPI } from '../services/api.service';

const ConfirmPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showSuccess, showError } = useToast();
  const email = location.state?.email || '';
  const otp = location.state?.otp || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = async () => {
    setApiError('');
    
    if (!validateForm()) {
      return;
    }

    if (!email || !otp) {
      setApiError('Missing email or OTP. Please restart the process.');
      showError('Missing email or OTP. Please restart the process.');
      return;
    }

    setLoading(true);

    try {
      // Payload: { email, otp, password, password_confirmation }
      const payload = {
        email,
        otp,
        password,
        password_confirmation: confirmPassword
      };

      const response = await authAPI.resetPassword(payload);

      if (response.success) {
        showSuccess(response.message || 'Password reset successfully!');
        
        // Navigate to login page after successful reset
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      }
    } catch (err) {
      console.error('Reset password error:', err);
      
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
        showError('Please fix the errors in the form');
      } else if (err.response?.data?.message) {
        setApiError(err.response.data.message);
        showError(err.response.data.message);
      } else {
        setApiError('Failed to reset password. Please try again.');
        showError('Failed to reset password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors(prev => ({ ...prev, password: '' }));
    }
    if (apiError) setApiError('');
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (errors.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: '' }));
    }
    if (apiError) setApiError('');
  };

  return (
    <div className="forgot-container">
      <div className="logo">
        <img src={Logo} alt="Logo" />
      </div>
      <div className="content">
        <h2 className="title text-center">
            Confirm Password
        </h2>
        <div className="icon">
            <img src={Icon} alt="" />
        </div>
        
        {apiError && (
          <div style={{ 
            padding: '12px', 
            marginBottom: '16px', 
            backgroundColor: '#ff444420', 
            border: '1px solid #ff4444', 
            borderRadius: '8px',
            color: '#ff4444',
            fontSize: '14px'
          }}>
            {apiError}
          </div>
        )}
        
        <label htmlFor="password" className="label">Password</label>
        <div className="input-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            className={`input ${errors.password ? 'error' : ''}`}
            placeholder="Enter new password"
            value={password}
            onChange={handlePasswordChange}
            disabled={loading}
          />
          <div className="icon" onClick={togglePasswordVisibility} style={{ cursor: loading ? 'not-allowed' : 'pointer' }}>
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </div>
        </div>
        {errors.password && <span style={{ color: '#ff4444', fontSize: '12px', marginTop: '-12px', marginBottom: '12px', display: 'block' }}>{errors.password}</span>}
        
        <label htmlFor="confirmPassword" className="label">Confirm Password</label>
        <div className="input-wrapper">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            className={`input ${errors.confirmPassword ? 'error' : ''}`}
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            disabled={loading}
          />
          <div className="icon" onClick={toggleConfirmPasswordVisibility} style={{ cursor: loading ? 'not-allowed' : 'pointer' }}>
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </div>
        </div>
        {errors.confirmPassword && <span style={{ color: '#ff4444', fontSize: '12px', marginTop: '-12px', marginBottom: '12px', display: 'block' }}>{errors.confirmPassword}</span>}
        
        <button 
          className="button"
          onClick={handleContinue}
          disabled={loading}
        >
          {loading ? 'Resetting Password...' : 'Continue'}
        </button>
      </div>
    </div>
  );
};

export default ConfirmPassword;