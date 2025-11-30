// store/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../api/api';

// Helper function to safely handle localStorage
const storage = {
  get: (key) => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return null;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Error setting localStorage:', error);
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }
};

// Get initial state from localStorage
const getInitialState = () => {
  const token = storage.get('authToken');
  const user = storage.get('authUser');
  
  return {
    user: user ? JSON.parse(user) : null,
    token: token,
    isAuthenticated: !!token,
    isLoading: false,
    error: null,
    message: null,
    otpVerified: false,
    emailForOtp: null,
  };
};

// Async Thunks
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(userData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Registration failed'
      );
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Login failed'
      );
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const response = await authAPI.forgotPassword(email);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Password reset request failed'
      );
    }
  }
);

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await authAPI.verifyOtp(email, otp);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'OTP verification failed'
      );
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (data, { rejectWithValue }) => {
    try {
      const response = await authAPI.resetPassword(data);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Password reset failed'
      );
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.logout();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Logout failed'
      );
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.getCurrentUser();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get user data'
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    clearAuthMessage: (state) => {
      state.message = null;
    },
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      
      // Save to localStorage
      storage.set('authToken', token);
      storage.set('authUser', JSON.stringify(user));
    },
    resetOtpState: (state) => {
      state.otpVerified = false;
      state.emailForOtp = null;
    },
    // New action to initialize auth from localStorage
    initializeAuth: (state) => {
      const token = storage.get('authToken');
      const user = storage.get('authUser');
      
      if (token && user) {
        state.token = token;
        state.user = JSON.parse(user);
        state.isAuthenticated = true;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
        if (action.payload.data?.token) {
          state.token = action.payload.data.token;
          state.user = action.payload.data.user;
          state.isAuthenticated = true;
          storage.set('authToken', action.payload.data.token);
          storage.set('authUser', JSON.stringify(action.payload.data.user));
        }
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.data.user;
        state.token = action.payload.data.token;
        state.isAuthenticated = true;
        state.error = null;
        
        // Save to localStorage
        storage.set('authToken', action.payload.data.token);
        storage.set('authUser', JSON.stringify(action.payload.data.user));
        
        console.log('Login successful - Token saved:', {
          token: action.payload.data.token,
          user: action.payload.data.user
        });
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        
        // Clear localStorage on login failure
        storage.remove('authToken');
        storage.remove('authUser');
      })
      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
        state.emailForOtp = action.payload.email;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Verify OTP
      .addCase(verifyOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.otpVerified = true;
        state.message = action.payload.message;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.otpVerified = false;
      })
      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
        state.otpVerified = false;
        state.emailForOtp = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.otpVerified = false;
        state.emailForOtp = null;
        
        // Clear localStorage
        storage.remove('authToken');
        storage.remove('authUser');
      })
      .addCase(logout.rejected, (state) => {
        // Even if API call fails, clear local state
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.otpVerified = false;
        state.emailForOtp = null;
        
        // Clear localStorage
        storage.remove('authToken');
        storage.remove('authUser');
      })
      // Get Current User
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload.data.user;
        // Update localStorage with fresh user data
        storage.set('authUser', JSON.stringify(action.payload.data.user));
      });
  },
});

export const {
  clearAuthError,
  clearAuthMessage,
  setCredentials,
  resetOtpState,
  initializeAuth,
} = authSlice.actions;

export default authSlice.reducer;