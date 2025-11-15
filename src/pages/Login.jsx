import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import AuthImage from '../assets/images/auth.svg'
import Logo from '../assets/images/logo.svg'
import { Link, useNavigate } from 'react-router-dom';
import OrImage from '../assets/images/or.svg'
import FbImage from '../assets/images/fb.svg'
import GoogleImage from '../assets/images/google.svg';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authAPI } from '../services/api.service';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showSuccess, showError } = useToast();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (apiError) {
      setApiError('');
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
    setApiError('');
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Exact payload structure as per API specification
      const payload = {
        email: formData.email,
        password: formData.password
      };
      
      const response = await authAPI.login(payload);
      
      // Response structure: { success, message, data: { user, token, token_type, expires_at } }
      if (response.success) {
        // Save user and token to context and localStorage
        login(response.data.user, response.data.token);
        
        // Show success message
        showSuccess(response.message || 'Login successful!');
        
        // Redirect based on user role after a short delay
        setTimeout(() => {
          // Check is_admin field (0 or 1) from the user object
          if (response.data.user.is_admin === "1" || response.data.user.is_admin === 1) {
            navigate('/admin');
          } else {
            navigate('/dashboard');
          }
        }, 500);
      }
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.response?.data?.errors) {
        // Handle validation errors from backend
        setErrors(error.response.data.errors);
        showError('Please fix the errors in the form');
      } else if (error.response?.data?.message) {
        setApiError(error.response.data.message);
        showError(error.response.data.message);
      } else {
        setApiError('Login failed. Please check your credentials and try again.');
        showError('Login failed. Please check your credentials and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className="login-wrapper">
      <div className="left">
 <div className="content">
    <div className="logo">
    <img src={Logo} alt="" />
 </div>
 <h2 className="title text-center">
    Sign in to your Account
 </h2>
 <p className="text text-center px-4">
    Your journey to a healthier, fitter, and more confident lifestyle starts with one simple step today.
 </p>
 
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
     disabled={loading}
   />
   {errors.email && <span style={{ color: '#ff4444', fontSize: '12px', marginTop: '-12px', marginBottom: '12px', display: 'block' }}>{errors.email}</span>}
   
   <label htmlFor="password" className="label">
     Password
   </label>
   <div className="input-wrapper">
      <div className="icon" onClick={togglePasswordVisibility} style={{ cursor: loading ? 'not-allowed' : 'pointer' }}>
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
        disabled={loading}
      />
   </div>
   {errors.password && <span style={{ color: '#ff4444', fontSize: '12px', marginTop: '-12px', marginBottom: '12px', display: 'block' }}>{errors.password}</span>}
   
   <button className="button" type="submit" disabled={loading}>
      {loading ? 'Logging in...' : 'Login'}
   </button>
   
   <div className="remember-me">
      <div className="leftt">
           <input 
             type="checkbox" 
             id="rememberMe" 
             name="rememberMe"
             checked={formData.rememberMe} 
             onChange={handleInputChange}
             disabled={loading}
           />
           <label htmlFor="rememberMe">Remember Me</label>
      </div>
      <Link to="/forgot-password" className="forgot-password">Forgot Password?</Link>
   </div>
 </form>
 <div className="or">
    <img src={OrImage} alt="" />
 </div>
 <button className="social-button">
   <img src={FbImage} alt="" />
  Continue with Facebook
 </button>
 <button className="social-button">
   <img src={GoogleImage} alt="" />
   Continue with Google
 </button>
 <div className="dont-have-account">
    Don't have an account? <Link to="/register" >Sign Up</Link>
 </div>
 </div>
      </div>
      <div className="right">
        <img src={AuthImage} alt="" className="img" />
      </div>
    </div>
  );
};

export default Login;