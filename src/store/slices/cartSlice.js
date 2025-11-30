// store/slices/cartSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartAPI } from '../../api/api';

export const getCart = createAsyncThunk(
  'cart/getCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartAPI.getCart();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get cart'
      );
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (item, { rejectWithValue }) => {
    try {
      const response = await cartAPI.addToCart(item);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add item to cart'
      );
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
      const response = await cartAPI.updateCartItem(itemId, quantity);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update cart item'
      );
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (itemId, { rejectWithValue }) => {
    try {
      await cartAPI.removeFromCart(itemId);
      return itemId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to remove item from cart'
      );
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      await cartAPI.clearCart();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to clear cart'
      );
    }
  }
);

const initialState = {
  items: [],
  total: 0,
  isLoading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCartError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.total = action.payload.total;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.total = action.payload.total;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.total = action.payload.total;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
        // Recalculate total
        state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.total = 0;
      });
  },
});

export const { clearCartError } = cartSlice.actions;
export default cartSlice.reducer;