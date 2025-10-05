import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import AuthImage from '../assets/images/register.svg'
import Logo from '../assets/images/logo.svg'
import { Link } from 'react-router-dom';
import OrImage from '../assets/images/or.svg'
import FbImage from '../assets/images/fb.svg'
import GoogleImage from '../assets/images/google.svg';
const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
 <label htmlFor="" className="label">
    Name
 </label>
 <input type="text" className="input" placeholder='John Doe' value={name} onChange={(e) => setName(e.target.value)} />
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
 <label htmlFor="" className="label">
   Confirm Password
 </label>
 <div className="input-wrapper">
    <div className="icon" onClick={toggleConfirmPasswordVisibility} style={{ cursor: 'pointer' }}>
      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
    </div>
    <input type={showConfirmPassword ? 'text' : 'password'} className="input" placeholder='Confirm your password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
 </div>
 <button className="button">
    Register
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
 
 <div className="dont-have-account">
    Already have an account?  <Link to="/login" >Sign In</Link>
 </div>
 </div>
      </div>
     
    </div>
  );
};

export default Register;