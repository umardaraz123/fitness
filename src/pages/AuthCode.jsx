import React, { useState, useRef } from 'react';
import Logo from '../assets/images/logo.svg';
import Icon from '../assets/images/icon.svg';

const AuthCode = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    if (value.length > 1) return; // Only allow single digit

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <div className="forgot-container">
      <div className="logo">
        <img src={Logo} alt="Logo" />
      </div>
      <div className="content">
        <div className="icon">
            <img src={Icon} alt="" />
        </div>
        <p className="text text-center px-5">
            We have just sent a 6 digit code to your email Jhon@gmail.com. Please check and enter the OTP below.
        </p>
        <h2 className="title text-center">
            Enter Auth Code
        </h2>
        
       
        <div className="small-input-wrapper">
          {code.map((digit, index) => (
            <div key={index} >
              <input
                type="text"
                className="small-input"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                ref={(el) => (inputRefs.current[index] = el)}
                maxLength="1"
              />
            </div>
          ))}
        </div>
         <p className="text px-5">
            Don’t get the code?
        </p>
        <button className="button max">
              Resend Code
        </button>
        <button className="button">
           Verify
        </button>
      </div>
    </div>
  );
};

export default AuthCode;