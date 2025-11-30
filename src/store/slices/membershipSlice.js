import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { membershipAPI } from '../../api/api';

export const getPlans = createAsyncThunk(
  'memberships/getPlans',
  async (_, { rejectWithValue }) => {
    try {
      const response = await membershipAPI.getPlans();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get membership plans'
      );
    }
  }
);

export const subscribe = createAsyncThunk(
  'memberships/subscribe',
  async (planData, { rejectWithValue }) => {
    try {
      const response = await membershipAPI.subscribe(planData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to subscribe to membership'
      );
    }
  }
);

export const cancelMembership = createAsyncThunk(
  'memberships/cancelMembership',
  async (membershipId, { rejectWithValue }) => {
    try {
      const response = await membershipAPI.cancelMembership(membershipId);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to cancel membership'
      );
    }
  }
);

const initialState = {
  plans: [],
  userMembership: null,
  isLoading: false,
  error: null,
};

const membershipSlice = createSlice({
  name: 'memberships',
  initialState,
  reducers: {
    clearMembershipError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPlans.fulfilled, (state, action) => {
        state.plans = action.payload.data?.data || action.payload.data || action.payload || [];
      })
      .addCase(subscribe.fulfilled, (state, action) => {
        state.userMembership = action.payload.data;
      })
      .addCase(cancelMembership.fulfilled, (state) => {
        state.userMembership = null;
      });
  },
});

export const { clearMembershipError } = membershipSlice.actions;
export default membershipSlice.reducer;