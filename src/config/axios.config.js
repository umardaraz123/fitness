import axios from 'axios';

// Base URL for API
export const API_BASE_URL = 'https://startuppakistan.himalayatool.com/api/v1';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // If sending FormData, let browser set Content-Type with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle different error status codes
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Unauthorized - Only redirect to login if NOT on public pages or admin pages
          const currentPath = window.location.pathname;
          const publicPaths = ['/', '/login', '/register', '/forgot-password', '/auth-code', '/confirm-password', '/products', '/product', '/meals', '/meal', '/fitness-programs', '/membership', '/cart', '/checkout'];
          
          // Check if current path is a public page
          const isPublicPage = publicPaths.some(path => 
            currentPath === path || 
            currentPath.startsWith(path + '/')
          );
          
          // Only redirect to login if NOT on public pages or admin pages
          if (!isPublicPage && !currentPath.startsWith('/admin')) {
            localStorage.removeItem('userToken');
            localStorage.removeItem('userData');
            window.location.href = '/login';
          }
          break;
        case 403:
          // Forbidden
          console.error('Access forbidden');
          break;
        case 404:
          // Not found
          console.error('Resource not found');
          break;
        case 500:
          // Server error
          console.error('Server error');
          break;
        default:
          console.error('An error occurred:', error.response.data.message || 'Unknown error');
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network error - no response received');
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
