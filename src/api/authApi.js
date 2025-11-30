// api/authApi.js
import axios from 'axios';

const API_BASE_URL = '/api/v1/auth';

const authApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (credentials) => authApi.post('/login', credentials),
  register: (userData) => authApi.post('/register', userData),
  forgotPassword: (email) => authApi.post('/forgot-password', { email }),
  verifyOtp: (otpData) => authApi.post('/verify-otp', otpData),
  resendOtp: (email) => authApi.post('/resend-otp', { email }),
  resetPassword: (resetData) => authApi.post('/reset-password', resetData),
};