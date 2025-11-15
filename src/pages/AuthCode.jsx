import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from '../assets/images/logo.svg';
import Icon from '../assets/images/icon.svg';
import { useToast } from '../context/ToastContext';
import { authAPI } from '../services/api.service';

const AuthCode = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showSuccess, showError } = useToast();
  const email = location.state?.email || '';
  
  // Debug: Check if email is received
  React.useEffect(() => {
    console.log('AuthCode - Email received:', email);
    if (!email) {
      console.warn('No email found in navigation state');
      showError('No email found. Please start from forgot password.');
    }
  }, [email]);
  
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (error) setError('');

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const otp = code.join('');
    
    console.log('Handle Verify called - OTP:', otp, 'Email:', email);
    
    if (otp.length !== 6) {
      setError('Please enter complete 6-digit OTP');
      showError('Please enter complete 6-digit OTP');
      return;
    }

    if (!email) {
      setError('Email not found. Please restart the process.');
      showError('Email not found. Please restart the process.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Calling verifyOtp API with:', { email, otp });
      
      const response = await authAPI.verifyOtp(email, otp);

      console.log('Verify OTP Response:', response);

      if (response.success) {
        showSuccess(response.message || 'OTP verified successfully');
        navigate('/confirm-password', { state: { email, otp } });
      }
    } catch (err) {
      console.error('Verify OTP error:', err);
      
      if (err.response?.data?.message) {
        setError(err.response.data.message);
        showError(err.response.data.message);
      } else {
        setError('Invalid OTP. Please try again.');
        showError('Invalid OTP. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      showError('Email not found. Please restart the process.');
      return;
    }

    setResending(true);
    setError('');

    try {
      const response = await authAPI.forgotPassword(email);

      if (response.success) {
        showSuccess(response.message || 'OTP resent to your email');
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      console.error('Resend OTP error:', err);
      
      if (err.response?.data?.message) {
        showError(err.response.data.message);
      } else {
        showError('Failed to resend OTP. Please try again.');
      }
    } finally {
      setResending(false);
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
            We have just sent a 6 digit code to your email {email || 'Jhon@gmail.com'}. Please check and enter the OTP below.
        </p>
        <h2 className="title text-center">
            Enter Auth Code
        </h2>
        
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
                disabled={loading || resending}
              />
            </div>
          ))}
        </div>
         <p className="text px-5">
            Don&#39;t get the code?
        </p>
        <button 
          className="button max"
          onClick={handleResendCode}
          disabled={loading || resending}
        >
          {resending ? 'Resending...' : 'Resend Code'}
        </button>
        <button 
          className="button"
          onClick={handleVerify}
          disabled={loading || resending}
        >
          {loading ? 'Verifying...' : 'Verify'}
        </button>
      </div>
    </div>
  );
};

export default AuthCode;