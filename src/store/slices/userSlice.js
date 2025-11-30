// store/slices/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userAPI } from '../../api/api';

export const getProfile = createAsyncThunk(
  'user/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userAPI.getProfile();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get profile'
      );
    }
  }
);

export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await userAPI.updateProfile(userData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update profile'
      );
    }
  }
);

export const getOrders = createAsyncThunk(
  'user/getOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userAPI.getOrders();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get orders'
      );
    }
  }
);

export const getWorkoutPlans = createAsyncThunk(
  'user/getWorkoutPlans',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userAPI.getWorkoutPlans();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get workout plans'
      );
    }
  }
);

export const getMealPlans = createAsyncThunk(
  'user/getMealPlans',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userAPI.getMealPlans();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get meal plans'
      );
    }
  }
);

export const getMemberships = createAsyncThunk(
  'user/getMemberships',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userAPI.getMemberships();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get memberships'
      );
    }
  }
);

const initialState = {
  profile: null,
  orders: [],
  workoutPlans: [],
  mealPlans: [],
  memberships: [],
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Profile
      .addCase(getProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload.user;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload.user;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get Orders
      .addCase(getOrders.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
      })
      // Get Workout Plans
      .addCase(getWorkoutPlans.fulfilled, (state, action) => {
        state.workoutPlans = action.payload.workoutPlans;
      })
      // Get Meal Plans
      .addCase(getMealPlans.fulfilled, (state, action) => {
        state.mealPlans = action.payload.mealPlans;
      })
      // Get Memberships
      .addCase(getMemberships.fulfilled, (state, action) => {
        state.memberships = action.payload.memberships;
      });
  },
});

export const { clearUserError } = userSlice.actions;
export default userSlice.reducer;