// store/slices/workoutSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { workoutAPI } from '../../api/api';

export const getWorkouts = createAsyncThunk(
  'workouts/getWorkouts',
  async (params, { rejectWithValue }) => {
    try {
      const response = await workoutAPI.getWorkouts(params);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get workouts'
      );
    }
  }
);

export const getWorkoutById = createAsyncThunk(
  'workouts/getWorkoutById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await workoutAPI.getWorkoutById(id);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get workout'
      );
    }
  }
);

// Admin actions
export const createWorkout = createAsyncThunk(
  'workouts/createWorkout',
  async (data, { rejectWithValue }) => {
    try {
      const response = await workoutAPI.createWorkout(data);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create workout'
      );
    }
  }
);

const initialState = {
  workouts: [],
  currentWorkout: null,
  isLoading: false,
  error: null,
};

const workoutSlice = createSlice({
  name: 'workouts',
  initialState,
  reducers: {
    clearWorkoutError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getWorkouts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getWorkouts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.workouts = action.payload.workouts;
      })
      .addCase(getWorkouts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getWorkoutById.fulfilled, (state, action) => {
        state.currentWorkout = action.payload.workout;
      })
      .addCase(createWorkout.fulfilled, (state, action) => {
        state.workouts.push(action.payload.workout);
      });
  },
});

export const { clearWorkoutError } = workoutSlice.actions;
export default workoutSlice.reducer;