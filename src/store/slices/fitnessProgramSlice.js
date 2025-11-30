import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fitnessProgramAPI } from '../../api/api';

export const getPrograms = createAsyncThunk(
  'fitnessPrograms/getPrograms',
  async (params, { rejectWithValue }) => {
    try {
      const response = await fitnessProgramAPI.getPrograms(params);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get fitness programs'
      );
    }
  }
);

export const getProgramById = createAsyncThunk(
  'fitnessPrograms/getProgramById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fitnessProgramAPI.getProgramById(id);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get fitness program'
      );
    }
  }
);

export const submitQuestionnaire = createAsyncThunk(
  'fitnessPrograms/submitQuestionnaire',
  async (data, { rejectWithValue }) => {
    try {
      const response = await fitnessProgramAPI.submitQuestionnaire(data);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to submit questionnaire'
      );
    }
  }
);

const initialState = {
  programs: [],
  currentProgram: null,
  isLoading: false,
  error: null,
};

const fitnessProgramSlice = createSlice({
  name: 'fitnessPrograms',
  initialState,
  reducers: {
    clearFitnessProgramError: (state) => {
      state.error = null;
    },
    clearCurrentProgram: (state) => {
      state.currentProgram = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPrograms.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPrograms.fulfilled, (state, action) => {
        state.isLoading = false;
        state.programs = action.payload.data?.data || action.payload.data || action.payload || [];
      })
      .addCase(getPrograms.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getProgramById.fulfilled, (state, action) => {
        state.currentProgram = action.payload.data;
      });
  },
});

export const { clearFitnessProgramError, clearCurrentProgram } = fitnessProgramSlice.actions;
export default fitnessProgramSlice.reducer;