import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderAPI } from '../../api/api';

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await orderAPI.createOrder(orderData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create order'
      );
    }
  }
);

export const getOrderById = createAsyncThunk(
  'orders/getOrderById',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await orderAPI.getOrderById(orderId);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get order'
      );
    }
  }
);

export const getUserOrders = createAsyncThunk(
  'orders/getUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await orderAPI.getUserOrders();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get user orders'
      );
    }
  }
);

const initialState = {
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders.push(action.payload.data);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.currentOrder = action.payload.data;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.orders = action.payload.data?.data || action.payload.data || action.payload || [];
      });
  },
});

export const { clearOrderError, clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;