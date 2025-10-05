import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Logo from '../assets/images/logo.svg';
import Icon from '../assets/images/icon.svg';

const ConfirmPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
        
        <label htmlFor="password" className="label">Password</label>
        <div className="input-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="icon" onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </div>
        </div>
        <label htmlFor="confirmPassword" className="label">Confirm Password</label>
        <div className="input-wrapper">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            className="input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <div className="icon" onClick={toggleConfirmPasswordVisibility} style={{ cursor: 'pointer' }}>
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </div>
        </div>
        <button className="button">
           Continue
        </button>
      </div>
    </div>
  );
};

export default ConfirmPassword;