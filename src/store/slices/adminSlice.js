import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminAPI } from '../../api/api';

export const getClients = createAsyncThunk(
  'admin/getClients',
  async (params, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getClients(params);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get clients'
      );
    }
  }
);

export const getClientById = createAsyncThunk(
  'admin/getClientById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getClientById(id);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get client'
      );
    }
  }
);

export const createWorkoutPlan = createAsyncThunk(
  'admin/createWorkoutPlan',
  async (planData, { rejectWithValue }) => {
    try {
      const response = await adminAPI.createWorkoutPlan(planData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create workout plan'
      );
    }
  }
);

export const updateWorkoutPlan = createAsyncThunk(
  'admin/updateWorkoutPlan',
  async ({ planId, planData }, { rejectWithValue }) => {
    try {
      const response = await adminAPI.updateWorkoutPlan(planId, planData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update workout plan'
      );
    }
  }
);

export const getClientQuestionnaire = createAsyncThunk(
  'admin/getClientQuestionnaire',
  async (clientId, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getClientQuestionnaire(clientId);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get client questionnaire'
      );
    }
  }
);

export const sendMessage = createAsyncThunk(
  'admin/sendMessage',
  async ({ clientId, message }, { rejectWithValue }) => {
    try {
      const response = await adminAPI.sendMessage(clientId, message);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to send message'
      );
    }
  }
);

export const getMessages = createAsyncThunk(
  'admin/getMessages',
  async (clientId, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getMessages(clientId);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get messages'
      );
    }
  }
);

const initialState = {
  clients: [],
  currentClient: null,
  messages: [],
  isLoading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    },
    clearCurrentClient: (state) => {
      state.currentClient = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getClients.fulfilled, (state, action) => {
        state.clients = action.payload.data?.data || action.payload.data || action.payload || [];
      })
      .addCase(getClientById.fulfilled, (state, action) => {
        state.currentClient = action.payload.data;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.messages = action.payload.data?.data || action.payload.data || action.payload || [];
      });
  },
});

export const { clearAdminError, clearCurrentClient } = adminSlice.actions;
export default adminSlice.reducer;