import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import AuthImage from '../assets/images/auth.svg'
import Logo from '../assets/images/logo.svg'
import { Link } from 'react-router-dom';
import OrImage from '../assets/images/or.svg'
import FbImage from '../assets/images/fb.svg'
import GoogleImage from '../assets/images/google.svg';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
 <label htmlFor="" className="label">
    Email
 </label>
 <input type="email" className="input" placeholder='Jhon123@gmail.com' value={email} onChange={(e) => setEmail(e.target.value)} />
 <label htmlFor="" className="label">
   Password
 </label>
 <div className="input-wrapper">
    <div className="icon" onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
    </div>
    <input type={showPassword ? 'text' : 'password'} className="input" placeholder='Enter your password' value={password} onChange={(e) => setPassword(e.target.value)} />
 </div>
 <button className="button">
    Login
 </button>
 <div className="remember-me">
    <div className="leftt">
         <input type="checkbox" id="remember" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
         <label htmlFor="remember">Remember Me</label>
    </div>
    <Link to="/forgot-password" className="forgot-password">Forgot Password?</Link>
 </div>
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