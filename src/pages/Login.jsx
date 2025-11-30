import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import AuthImage from '../assets/images/auth.svg'
import Logo from '../assets/images/logo.svg'
import { Link, useNavigate } from 'react-router-dom';
import OrImage from '../assets/images/or.svg'
import FbImage from '../assets/images/fb.svg'
import GoogleImage from '../assets/images/google.svg';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearAuthError } from '../store/slices/authSlice';
import { useToast } from '../context/ToastContext';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showSuccess, showError } = useToast();
  
  // Get auth state from Redux
  const { user, isAuthenticated, isLoading, error } = useSelector(state => state.auth);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('User authenticated, redirecting...', { user, isAuthenticated });
      const timer = setTimeout(() => {
        if (user.is_admin === 1 || user.is_admin === "1") {
          navigate('/admin', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      }, 500); // Increased delay to ensure state is fully updated
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user, navigate]);

  // Handle API errors
  useEffect(() => {
    if (error) {
      showError(error);
      // Clear error after showing
      dispatch(clearAuthError());
    }
  }, [error, showError, dispatch]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear local errors when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    dispatch(clearAuthError());
    setErrors({});
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const result = await dispatch(login({
        email: formData.email,
        password: formData.password
      }));

      if (login.fulfilled.match(result)) {
        showSuccess('Login successful! Redirecting...');
        console.log('Login result:', result.payload);
        
        // Check if token was saved
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('authUser');
        
        if (token && userData) {
          console.log('Token and user data saved successfully in localStorage');
        } else {
          console.error('Failed to save auth data to localStorage');
        }
        
      } else if (login.rejected.match(result)) {
        console.error('Login failed:', result.payload);
        // Error is automatically handled by Redux and useEffect
      }
    } catch (error) {
      console.error('Unexpected login error:', error);
      showError('An unexpected error occurred');
    }
  };

  const togglePasswordVisibility = () => {
    if (!isLoading) {
      setShowPassword(!showPassword);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="left">
        <div className="content">
          <div className="logo">
            <img src={Logo} alt="Logo" />
          </div>
          <h2 className="title text-center">
            Sign in to your Account
          </h2>
          <p className="text text-center px-4">
            Your journey to a healthier, fitter, and more confident lifestyle starts with one simple step today.
          </p>
          
          <form onSubmit={handleLogin}>
            <label htmlFor="email" className="label">
              Email
            </label>
            <input 
              type="email" 
              id="email"
              name="email"
              className={`input ${errors.email ? 'error' : ''}`}
              placeholder='john123@gmail.com' 
              value={formData.email} 
              onChange={handleInputChange}
              disabled={isLoading}
            />
            {errors.email && <span style={{ color: '#ff4444', fontSize: '12px', marginTop: '-12px', marginBottom: '12px', display: 'block' }}>{errors.email}</span>}
            
            <label htmlFor="password" className="label">
              Password
            </label>
            <div className="input-wrapper">
              <div 
                className="icon" 
                onClick={togglePasswordVisibility}
                style={{ cursor: isLoading ? 'not-allowed' : 'pointer' }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
              <input 
                type={showPassword ? 'text' : 'password'} 
                id="password"
                name="password"
                className={`input ${errors.password ? 'error' : ''}`}
                placeholder='Enter your password' 
                value={formData.password} 
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>
            {errors.password && <span style={{ color: '#ff4444', fontSize: '12px', marginTop: '-12px', marginBottom: '12px', display: 'block' }}>{errors.password}</span>}
            
            <button 
              className="button" 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
            
            <div className="remember-me">
              <div className="leftt">
                <input 
                  type="checkbox" 
                  id="rememberMe" 
                  name="rememberMe"
                  checked={formData.rememberMe} 
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                <label htmlFor="rememberMe">Remember Me</label>
              </div>
              <Link to="/forgot-password" className="forgot-password">
                Forgot Password?
              </Link>
            </div>
          </form>
          
          <div className="or">
            <img src={OrImage} alt="Or" />
          </div>
          
          <button className="social-button" disabled={isLoading}>
            <img src={FbImage} alt="Facebook" />
            Continue with Facebook
          </button>
          
          <button className="social-button" disabled={isLoading}>
            <img src={GoogleImage} alt="Google" />
            Continue with Google
          </button>
          
          <div className="dont-have-account">
            Don't have an account? <Link to="/register">Sign Up</Link>
          </div>
        </div>
      </div>
      
      <div className="right">
        <img src={AuthImage} alt="Authentication" className="img" />
      </div>
    </div>
  );
};

export default Login;