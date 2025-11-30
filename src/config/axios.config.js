import axios from 'axios';

// Base URL for API
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Token storage keys
const TOKEN_STORAGE_KEY = 'authToken';
const REFRESH_TOKEN_STORAGE_KEY = 'refreshToken';
const USER_STORAGE_KEY = 'userData';

// Token refresh flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Enhanced error types for better error handling
export const ErrorTypes = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  RATE_LIMIT: 'RATE_LIMIT',
  SERVER_ERROR: 'SERVER_ERROR',
  BAD_GATEWAY: 'BAD_GATEWAY',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
};

// Custom error class for API errors
export class APIError extends Error {
  constructor(message, type, status, errors = null, originalError = null) {
    super(message);
    this.name = 'APIError';
    this.type = type;
    this.status = status;
    this.errors = errors;
    this.originalError = originalError;
    this.timestamp = new Date().toISOString();
    
    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, APIError);
    }
  }
}

// Create axios instance with enhanced configuration
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Enhanced configuration
  withCredentials: false, // Set to true if using cookies for auth
  maxRedirects: 5,
  validateStatus: function (status) {
    return status >= 200 && status < 300; // Default
  },
});

// Request interceptor - Add auth token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    
    // Add Authorization header if token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // If sending FormData, let browser set Content-Type with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    // Add timestamp to prevent caching for GET requests
    if (config.method === 'get' && config.params !== false) {
      config.params = {
        ...config.params,
        _t: Date.now(),
      };
    }
    
    // Add request ID for tracking
    config.headers['X-Request-ID'] = generateRequestId();
    
    // Enhanced logging with levels
    if (import.meta.env.DEV) {
      console.log(`🔄 API Call: ${config.method?.toUpperCase()} ${config.url}`, {
        headers: { ...config.headers, Authorization: config.headers.Authorization ? 'Bearer ***' : undefined },
        data: config.data,
        params: config.params,
      });
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request Interceptor Error:', error);
    return Promise.reject(new APIError(
      'Request configuration failed',
      ErrorTypes.UNKNOWN_ERROR,
      null,
      null,
      error
    ));
  }
);

// Response interceptor - Handle errors globally and token refresh
axiosInstance.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`✅ API Success: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
    }
    
    // You can add response transformation here if needed
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Enhanced error logging
    if (import.meta.env.DEV) {
      console.log(`❌ API Error: ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url}`, {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        config: error.config,
      });
    }

    // Handle request cancellation
    if (axios.isCancel(error)) {
      console.log('🚫 Request cancelled:', error.message);
      return Promise.reject(new APIError(
        'Request was cancelled',
        ErrorTypes.UNKNOWN_ERROR,
        null,
        null,
        error
      ));
    }

    // Handle network errors (no response)
    if (!error.response) {
      console.error('🌐 Network Error - No response received from server');
      
      // Check if browser is online
      if (!navigator.onLine) {
        console.error('📱 Device is offline');
        // Dispatch offline event
        window.dispatchEvent(new Event('app:offline'));
      }
      
      return Promise.reject(new APIError(
        'Network error. Please check your internet connection.',
        ErrorTypes.NETWORK_ERROR,
        null,
        null,
        error
      ));
    }

    const { status, data } = error.response;
    const currentPath = window.location.pathname;

    // Enhanced public paths configuration
    const publicPaths = [
      '/',
      '/login',
      '/register',
      '/forgot-password',
      '/reset-password',
      '/verify-otp',
      '/auth-code',
      '/confirm-password',
      '/products',
      '/product',
      '/meals',
      '/meal',
      '/plans',
      '/plan',
      '/fitness-programs',
      '/membership',
      '/cart',
      '/checkout',
      '/about',
      '/contact',
      '/privacy-policy',
      '/terms-of-service',
      '/email-verify',
      '/success',
      '/cancel',
    ];

    // Check if current path is public
    const isPublicPage = publicPaths.some(path => 
      currentPath === path || 
      currentPath.startsWith(path + '/') ||
      currentPath.includes('/public/')
    );

    // Handle specific HTTP status codes with enhanced error handling
    switch (status) {
      case 400:
        // Bad Request
        console.error('❌ Bad Request:', data.message || 'Invalid request');
        return Promise.reject(new APIError(
          data.message || 'Invalid request. Please check your input.',
          ErrorTypes.VALIDATION_ERROR,
          status,
          data.errors,
          error
        ));

      case 401:
        // Unauthorized - Token expired or invalid
        console.warn('🔐 Unauthorized access - Token may be expired');
        
        // If this is not a retry request and we have a refresh token
        if (!originalRequest._retry && localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY)) {
          if (isRefreshing) {
            // If already refreshing, add to queue
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            }).then(token => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return axiosInstance(originalRequest);
            }).catch(err => {
              return Promise.reject(err);
            });
          }

          originalRequest._retry = true;
          isRefreshing = true;

          try {
            const refreshToken = localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
            console.log('🔄 Attempting token refresh...');
            
            // Call refresh token endpoint with timeout
            const refreshConfig = {
              timeout: 10000, // 10 seconds for refresh token
              skipAuth: true, // Custom flag to skip auth for refresh requests
            };
            
            const response = await axios.post(
              `${API_BASE_URL}/auth/refresh`,
              { refresh_token: refreshToken },
              refreshConfig
            );

            const { token, refresh_token: newRefreshToken } = response.data.data;
            
            // Store new tokens
            localStorage.setItem(TOKEN_STORAGE_KEY, token);
            if (newRefreshToken) {
              localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, newRefreshToken);
            }

            // Update Authorization header
            originalRequest.headers.Authorization = `Bearer ${token}`;
            
            // Process queued requests
            processQueue(null, token);
            
            console.log('✅ Token refreshed successfully');
            
            // Retry original request
            return axiosInstance(originalRequest);
          } catch (refreshError) {
            console.error('❌ Token refresh failed:', refreshError);
            
            // Clear tokens and user data
            clearAuthData();
            
            // Process queue with error
            processQueue(refreshError, null);
            
            // Only redirect if not on public page
            if (!isPublicPage && !currentPath.startsWith('/admin')) {
              console.log('🔒 Redirecting to login due to authentication failure');
              // Dispatch auth failure event
              window.dispatchEvent(new CustomEvent('auth:failed', { 
                detail: { reason: 'token_refresh_failed' } 
              }));
              window.location.href = '/login?session_expired=true';
            }
            
            return Promise.reject(new APIError(
              'Session expired. Please login again.',
              ErrorTypes.AUTH_ERROR,
              status,
              null,
              error
            ));
          } finally {
            isRefreshing = false;
          }
        } else {
          // No refresh token available or max retries reached
          clearAuthData();
          
          if (!isPublicPage && !currentPath.startsWith('/admin')) {
            console.log('🔒 Redirecting to login - No valid tokens');
            window.dispatchEvent(new CustomEvent('auth:failed', { 
              detail: { reason: 'no_valid_tokens' } 
            }));
            window.location.href = '/login?session_expired=true';
          }
          
          return Promise.reject(new APIError(
            'Authentication required. Please login.',
            ErrorTypes.AUTH_ERROR,
            status,
            null,
            error
          ));
        }

      case 403:
        // Forbidden - User doesn't have permission
        console.error('🚫 Access forbidden:', data.message || 'Insufficient permissions');
        
        // If user tries to access admin area without admin privileges
        if (currentPath.startsWith('/admin')) {
          window.dispatchEvent(new CustomEvent('auth:forbidden', { 
            detail: { path: currentPath } 
          }));
          window.location.href = '/dashboard?error=access_denied';
        }
        
        return Promise.reject(new APIError(
          data.message || 'You do not have permission to access this resource.',
          ErrorTypes.FORBIDDEN,
          status,
          null,
          error
        ));

      case 404:
        // Not Found
        console.error('🔍 Resource not found:', originalRequest.url);
        return Promise.reject(new APIError(
          data.message || 'The requested resource was not found.',
          ErrorTypes.NOT_FOUND,
          status,
          null,
          error
        ));

      case 422:
        // Validation Error
        console.error('📝 Validation error:', data.errors);
        return Promise.reject(new APIError(
          data.message || 'Validation failed.',
          ErrorTypes.VALIDATION_ERROR,
          status,
          data.errors,
          error
        ));

      case 429:
        // Too Many Requests - Rate limiting
        console.error('🚦 Rate limit exceeded:', data.message);
        const retryAfter = error.response.headers['retry-after'];
        
        // Dispatch rate limit event
        window.dispatchEvent(new CustomEvent('rate:limited', { 
          detail: { retryAfter, endpoint: originalRequest.url } 
        }));
        
        return Promise.reject(new APIError(
          data.message || 'Too many requests. Please try again later.',
          ErrorTypes.RATE_LIMIT,
          status,
          null,
          error,
          retryAfter
        ));

      case 500:
        // Internal Server Error
        console.error('💥 Server error:', data.message || 'Internal server error');
        return Promise.reject(new APIError(
          'Server error. Please try again later.',
          ErrorTypes.SERVER_ERROR,
          status,
          null,
          error
        ));

      case 502:
        // Bad Gateway
        console.error('🌉 Bad gateway');
        return Promise.reject(new APIError(
          'Service temporarily unavailable. Please try again later.',
          ErrorTypes.BAD_GATEWAY,
          status,
          null,
          error
        ));

      case 503:
        // Service Unavailable
        console.error('🔧 Service unavailable');
        return Promise.reject(new APIError(
          'Service temporarily unavailable. Please try again later.',
          ErrorTypes.SERVICE_UNAVAILABLE,
          status,
          null,
          error
        ));

      default:
        // Other HTTP errors
        console.error(`❌ HTTP Error ${status}:`, data.message || 'Unknown error');
        return Promise.reject(new APIError(
          data.message || `An unexpected error occurred (${status})`,
          ErrorTypes.UNKNOWN_ERROR,
          status,
          null,
          error
        ));
    }
  }
);

// Utility functions for token management
export const tokenManager = {
  // Set tokens
  setTokens: (token, refreshToken = null, userData = null) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
    }
    if (userData) {
      this.setUser(userData);
    }
  },

  // Get tokens
  getTokens: () => ({
    token: localStorage.getItem(TOKEN_STORAGE_KEY),
    refreshToken: localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY),
  }),

  // Clear tokens and user data
  clearTokens: () => {
    clearAuthData();
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token) return false;

    // Optional: Check token expiration if JWT
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    } catch {
      return true; // If not JWT, assume valid
    }
  },

  // Get stored user data
  getUser: () => {
    try {
      const userData = localStorage.getItem(USER_STORAGE_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  // Set user data
  setUser: (userData) => {
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  },

  // Get token expiration time
  getTokenExpiration: () => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp ? new Date(payload.exp * 1000) : null;
    } catch {
      return null;
    }
  },
};

// Helper functions
function generateRequestId() {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function clearAuthData() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
}

// Enhanced request methods with better TypeScript support
export const apiClient = {
  get: (url, config = {}) => axiosInstance.get(url, config),
  post: (url, data = {}, config = {}) => axiosInstance.post(url, data, config),
  put: (url, data = {}, config = {}) => axiosInstance.put(url, data, config),
  patch: (url, data = {}, config = {}) => axiosInstance.patch(url, data, config),
  delete: (url, config = {}) => axiosInstance.delete(url, config),
  request: (config) => axiosInstance.request(config),
};

// Add global error handler for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason?.isAxiosError || event.reason instanceof APIError) {
    console.error('🚨 Unhandled API Error:', event.reason);
    
    // Dispatch global error event
    window.dispatchEvent(new CustomEvent('app:error', { 
      detail: { 
        error: event.reason,
        type: 'unhandled_api_error'
      } 
    }));
  }
});

// Online/offline event handlers
window.addEventListener('online', () => {
  console.log('🌐 App is back online');
  window.dispatchEvent(new Event('app:online'));
});

window.addEventListener('offline', () => {
  console.warn('📱 App is offline');
  window.dispatchEvent(new Event('app:offline'));
});

export default axiosInstance;