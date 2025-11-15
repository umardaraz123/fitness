import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import AuthImage from '../assets/images/register.svg'
import Logo from '../assets/images/logo.svg'
import { Link, useNavigate } from 'react-router-dom';
import OrImage from '../assets/images/or.svg'
import FbImage from '../assets/images/fb.svg'
import GoogleImage from '../assets/images/google.svg';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authAPI } from '../services/api.service';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showSuccess, showError } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    terms_accepted: false
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!formData.password_confirmation) {
      newErrors.password_confirmation = 'Please confirm your password';
    } else if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Passwords do not match';
    }
    
    if (!formData.terms_accepted) {
      newErrors.terms_accepted = 'You must accept the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setApiError('');
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
        terms_accepted: formData.terms_accepted ? 1 : 0
      };
      
      const response = await authAPI.register(payload);
      
      if (response.success) {
        // Save user and token to context and localStorage
        login(response.data.user, response.data.token);
        
        // Show success message
        showSuccess(response.message || 'Registration successful!');
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 500);
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.response?.data?.errors) {
        // Handle validation errors from backend
        setErrors(error.response.data.errors);
        showError('Please fix the errors in the form');
      } else if (error.response?.data?.message) {
        setApiError(error.response.data.message);
        showError(error.response.data.message);
      } else {
        setApiError('Registration failed. Please try again.');
        showError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  return (
    <div className="login-wrapper">
       <div className="right">
        <img src={AuthImage} alt="" className="img" />
      </div>
      <div className="left">
 <div className="content">
    <div className="logo">
    <img src={Logo} alt="" />
 </div>
 <h2 className="title text-center">
    Sign Up your Account
 </h2>
 <p className="text text-center px-4">
    Provide Your Info to Start your  account setup
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
 
 <form onSubmit={handleRegister}>
   <label htmlFor="name" className="label">
      Name
   </label>
   <input 
     type="text" 
     id="name"
     name="name"
     className={`input ${errors.name ? 'error' : ''}`}
     placeholder='John Doe' 
     value={formData.name} 
     onChange={handleInputChange}
     disabled={loading}
   />
   {errors.name && <span style={{ color: '#ff4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.name}</span>}
   
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
   {errors.email && <span style={{ color: '#ff4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.email}</span>}
   
   <label htmlFor="password" className="label">
     Password
   </label>
   <div className="input-wrapper">
      <div className="icon" onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
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
   {errors.password && <span style={{ color: '#ff4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.password}</span>}
   
   <label htmlFor="password_confirmation" className="label">
     Confirm Password
   </label>
   <div className="input-wrapper">
      <div className="icon" onClick={toggleConfirmPasswordVisibility} style={{ cursor: 'pointer' }}>
        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </div>
      <input 
        type={showConfirmPassword ? 'text' : 'password'} 
        id="password_confirmation"
        name="password_confirmation"
        className={`input ${errors.password_confirmation ? 'error' : ''}`}
        placeholder='Confirm your password' 
        value={formData.password_confirmation} 
        onChange={handleInputChange}
        disabled={loading}
      />
   </div>
   {errors.password_confirmation && <span style={{ color: '#ff4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.password_confirmation}</span>}
   
   <div className="remember-me" style={{ marginBottom: '16px', marginTop: '16px' }}>
      <div className="leftt">
           <input 
             type="checkbox" 
             id="terms_accepted" 
             name="terms_accepted"
             checked={formData.terms_accepted} 
             onChange={handleInputChange}
             disabled={loading}
           />
           <label htmlFor="terms_accepted">I accept the Terms & Conditions</label>
      </div>
   </div>
   {errors.terms_accepted && <span style={{ color: '#ff4444', fontSize: '12px', marginTop: '-12px', marginBottom: '12px', display: 'block' }}>{errors.terms_accepted}</span>}
   
   <button className="button" type="submit" disabled={loading}>
      {loading ? 'Registering...' : 'Register'}
   </button>
 </form>
 
 <div className="remember-me">
    <div className="leftt"></div>
    <Link to="/forgot-password" className="forgot-password">Forgot Password?</Link>
 </div>
 <div className="or">
    <img src={OrImage} alt="" />
 </div>
 
 <div className="dont-have-account">
    Already have an account?  <Link to="/login" >Sign In</Link>
 </div>
 </div>
      </div>
     
    </div>
  );
};

export default Register;