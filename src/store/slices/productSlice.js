// store/slices/productSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productAPI } from '../../api/api';

// Public actions
export const getProducts = createAsyncThunk(
  'products/getProducts',
  async (params, { rejectWithValue }) => {
    try {
      const response = await productAPI.getProducts(params);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get products'
      );
    }
  }
);

export const getProductById = createAsyncThunk(
  'products/getProductById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await productAPI.getProductById(id);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get product'
      );
    }
  }
);

// Admin actions
export const getProductsAdmin = createAsyncThunk(
  'products/getProductsAdmin',
  async (params, { rejectWithValue }) => {
    try {
      const response = await productAPI.getProductsAdmin(params);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get products'
      );
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (data, { rejectWithValue }) => {
    try {
      const response = await productAPI.createProduct(data);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create product'
      );
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await productAPI.updateProduct(id, data);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update product'
      );
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      await productAPI.deleteProduct(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete product'
      );
    }
  }
);

// Categories
export const getCategories = createAsyncThunk(
  'products/getCategories',
  async (params, { rejectWithValue }) => {
    try {
      const response = await productAPI.getCategories(params);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get categories'
      );
    }
  }
);

const initialState = {
  products: [],
  adminProducts: [],
  categories: [],
  currentProduct: null,
  isLoading: false,
  error: null,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProductError: (state) => {
      state.error = null;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Products
      .addCase(getProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        // API returns { success, message, data: [...] }
        state.products = action.payload.data || action.payload.products || [];
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get Product By ID
      .addCase(getProductById.fulfilled, (state, action) => {
        // API returns { success, message, data: {...} }
        state.currentProduct = action.payload.data || action.payload.product || null;
      })
      // Get Products Admin
      .addCase(getProductsAdmin.fulfilled, (state, action) => {
        // API returns { success, message, data: [...] }
        state.adminProducts = action.payload.data || action.payload.products || [];
      })
      // Create Product
      .addCase(createProduct.fulfilled, (state, action) => {
        const newProduct = action.payload.data || action.payload.product;
        if (newProduct) {
          state.adminProducts.push(newProduct);
        }
      })
      // Update Product
      .addCase(updateProduct.fulfilled, (state, action) => {
        const updatedProduct = action.payload.data || action.payload.product;
        if (updatedProduct) {
          const index = state.adminProducts.findIndex(
            product => product.id === updatedProduct.id
          );
          if (index !== -1) {
            state.adminProducts[index] = updatedProduct;
          }
        }
      })
      // Delete Product
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.adminProducts = state.adminProducts.filter(
          product => product.id !== action.payload
        );
      })
      // Get Categories
      .addCase(getCategories.fulfilled, (state, action) => {
        // API returns { success, message, data: [...] }
        state.categories = action.payload.data || action.payload.categories || [];
      });
  },
});

export const { clearProductError, clearCurrentProduct } = productSlice.actions;
export default productSlice.reducer;