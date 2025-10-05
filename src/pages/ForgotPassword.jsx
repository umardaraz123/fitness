import React from 'react';
import Logo from '../assets/images/logo.svg';
import Icon from '../assets/images/icon.svg';
const ForgotPassword = () => {
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
        <label htmlFor="email" className="label">Email</label>
        <input type="text" className="input" />
        <button className="button">
           Continue
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;