// store/slices/notificationSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { notificationAPI } from '../../api/api';

// Async thunks for notification operations
export const getNotifications = createAsyncThunk(
  'notifications/getAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await notificationAPI.getNotifications(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const markAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId, { rejectWithValue }) => {
    try {
      const response = await notificationAPI.markAsRead(notificationId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const markAllAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificationAPI.markAllAsRead();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteNotification = createAsyncThunk(
  'notifications/delete',
  async (notificationId, { rejectWithValue }) => {
    try {
      const response = await notificationAPI.deleteNotification(notificationId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    // Notification items
    items: [],
    unreadCount: 0,
    
    // Loading states
    loading: false,
    markAsReadLoading: false,
    markAllAsReadLoading: false,
    deleteLoading: false,
    
    // Error states
    error: null,
    markAsReadError: null,
    markAllAsReadError: null,
    deleteError: null,
    
    // Pagination
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      hasNext: false,
      hasPrev: false
    },
    
    // Filters
    filters: {
      readStatus: 'all', // 'all', 'read', 'unread'
      type: 'all' // 'all', 'system', 'order', 'message', etc.
    }
  },
  reducers: {
    // Local notification management
    addNotification: (state, action) => {
      state.items.unshift(action.payload);
      state.unreadCount += 1;
    },
    
    removeNotification: (state, action) => {
      const notification = state.items.find(item => item.id === action.payload);
      if (notification && !notification.read) {
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
      state.items = state.items.filter(
        notification => notification.id !== action.payload
      );
    },
    
    clearNotifications: (state) => {
      state.items = [];
      state.unreadCount = 0;
    },
    
    // Local mark as read
    markNotificationAsRead: (state, action) => {
      const notification = state.items.find(item => item.id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        notification.read_at = new Date().toISOString();
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    
    markAllNotificationsAsRead: (state) => {
      state.items.forEach(notification => {
        if (!notification.read) {
          notification.read = true;
          notification.read_at = new Date().toISOString();
        }
      });
      state.unreadCount = 0;
    },
    
    // Filter management
    setNotificationFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    clearNotificationFilters: (state) => {
      state.filters = {
        readStatus: 'all',
        type: 'all'
      };
    },
    
    // Error clearing
    clearNotificationError: (state) => {
      state.error = null;
      state.markAsReadError = null;
      state.markAllAsReadError = null;
      state.deleteError = null;
    },
    
    clearAllErrors: (state) => {
      state.error = null;
      state.markAsReadError = null;
      state.markAllAsReadError = null;
      state.deleteError = null;
    },
    
    // Reset state
    resetNotificationState: (state) => {
      state.items = [];
      state.unreadCount = 0;
      state.loading = false;
      state.markAsReadLoading = false;
      state.markAllAsReadLoading = false;
      state.deleteLoading = false;
      state.error = null;
      state.markAsReadError = null;
      state.markAllAsReadError = null;
      state.deleteError = null;
      state.pagination = {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        hasNext: false,
        hasPrev: false
      };
      state.filters = {
        readStatus: 'all',
        type: 'all'
      };
    }
  },
  extraReducers: (builder) => {
    builder
      // Get notifications
      .addCase(getNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data || [];
        state.unreadCount = action.payload.unread_count || 0;
        state.pagination = {
          currentPage: action.payload.current_page || 1,
          totalPages: action.payload.last_page || 1,
          totalItems: action.payload.total || 0,
          hasNext: !!action.payload.next_page_url,
          hasPrev: !!action.payload.prev_page_url
        };
        state.error = null;
      })
      .addCase(getNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Mark as read
      .addCase(markAsRead.pending, (state) => {
        state.markAsReadLoading = true;
        state.markAsReadError = null;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        state.markAsReadLoading = false;
        
        // Update local state
        const notification = state.items.find(item => item.id === action.meta.arg);
        if (notification) {
          notification.read = true;
          notification.read_at = new Date().toISOString();
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        
        state.markAsReadError = null;
      })
      .addCase(markAsRead.rejected, (state, action) => {
        state.markAsReadLoading = false;
        state.markAsReadError = action.payload;
      })
      
      // Mark all as read
      .addCase(markAllAsRead.pending, (state) => {
        state.markAllAsReadLoading = true;
        state.markAllAsReadError = null;
      })
      .addCase(markAllAsRead.fulfilled, (state, action) => {
        state.markAllAsReadLoading = false;
        
        // Update all notifications as read
        state.items.forEach(notification => {
          if (!notification.read) {
            notification.read = true;
            notification.read_at = new Date().toISOString();
          }
        });
        state.unreadCount = 0;
        
        state.markAllAsReadError = null;
      })
      .addCase(markAllAsRead.rejected, (state, action) => {
        state.markAllAsReadLoading = false;
        state.markAllAsReadError = action.payload;
      })
      
      // Delete notification
      .addCase(deleteNotification.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.deleteLoading = false;
        
        // Remove from local state
        const notification = state.items.find(item => item.id === action.meta.arg);
        if (notification && !notification.read) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.items = state.items.filter(
          notification => notification.id !== action.meta.arg
        );
        
        state.deleteError = null;
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload;
      });
  }
});

export const {
  addNotification,
  removeNotification,
  clearNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  setNotificationFilters,
  clearNotificationFilters,
  clearNotificationError,
  clearAllErrors,
  resetNotificationState,
} = notificationSlice.actions;

export default notificationSlice.reducer;