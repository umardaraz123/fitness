import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { planAPI } from '../../api/api';

export const getPlans = createAsyncThunk(
  'plans/getPlans',
  async (params, { rejectWithValue }) => {
    try {
      const response = await planAPI.getPlans(params);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get plans'
      );
    }
  }
);

export const getPlanById = createAsyncThunk(
  'plans/getPlanById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await planAPI.getPlanById(id);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get plan'
      );
    }
  }
);

export const createPlan = createAsyncThunk(
  'plans/createPlan',
  async (data, { rejectWithValue }) => {
    try {
      const response = await planAPI.createPlan(data);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create plan'
      );
    }
  }
);

export const updatePlan = createAsyncThunk(
  'plans/updatePlan',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await planAPI.updatePlan(id, data);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update plan'
      );
    }
  }
);

export const deletePlan = createAsyncThunk(
  'plans/deletePlan',
  async (id, { rejectWithValue }) => {
    try {
      await planAPI.deletePlan(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete plan'
      );
    }
  }
);

const initialState = {
  plans: [],
  currentPlan: null,
  isLoading: false,
  error: null,
};

const planSlice = createSlice({
  name: 'plans',
  initialState,
  reducers: {
    clearPlanError: (state) => {
      state.error = null;
    },
    clearCurrentPlan: (state) => {
      state.currentPlan = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPlans.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPlans.fulfilled, (state, action) => {
        state.isLoading = false;
        state.plans = action.payload.data?.data || action.payload.data || action.payload || [];
      })
      .addCase(getPlans.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getPlanById.fulfilled, (state, action) => {
        state.currentPlan = action.payload.data;
      })
      .addCase(createPlan.fulfilled, (state, action) => {
        state.plans.push(action.payload.data);
      })
      .addCase(updatePlan.fulfilled, (state, action) => {
        const index = state.plans.findIndex(
          plan => plan.id === action.payload.data.id
        );
        if (index !== -1) {
          state.plans[index] = action.payload.data;
        }
      })
      .addCase(deletePlan.fulfilled, (state, action) => {
        state.plans = state.plans.filter(
          plan => plan.id !== action.payload
        );
      });
  },
});

export const { clearPlanError, clearCurrentPlan } = planSlice.actions;
export default planSlice.reducer;