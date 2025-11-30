import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { mealAPI } from '../../api/api';

export const getMeals = createAsyncThunk(
  'meals/getMeals',
  async (params, { rejectWithValue }) => {
    try {
      const response = await mealAPI.getMeals(params);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get meals'
      );
    }
  }
);

export const getMealById = createAsyncThunk(
  'meals/getMealById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await mealAPI.getMealById(id);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get meal'
      );
    }
  }
);

export const createMeal = createAsyncThunk(
  'meals/createMeal',
  async (data, { rejectWithValue }) => {
    try {
      const response = await mealAPI.createMeal(data);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create meal'
      );
    }
  }
);

export const updateMeal = createAsyncThunk(
  'meals/updateMeal',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await mealAPI.updateMeal(id, data);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update meal'
      );
    }
  }
);

export const deleteMeal = createAsyncThunk(
  'meals/deleteMeal',
  async (id, { rejectWithValue }) => {
    try {
      await mealAPI.deleteMeal(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete meal'
      );
    }
  }
);

const initialState = {
  meals: [],
  currentMeal: null,
  isLoading: false,
  error: null,
};

const mealSlice = createSlice({
  name: 'meals',
  initialState,
  reducers: {
    clearMealError: (state) => {
      state.error = null;
    },
    clearCurrentMeal: (state) => {
      state.currentMeal = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMeals.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMeals.fulfilled, (state, action) => {
        state.isLoading = false;
        state.meals = action.payload.data?.data || action.payload.data || action.payload || [];
      })
      .addCase(getMeals.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getMealById.fulfilled, (state, action) => {
        state.currentMeal = action.payload.data;
      })
      .addCase(createMeal.fulfilled, (state, action) => {
        state.meals.push(action.payload.data);
      })
      .addCase(updateMeal.fulfilled, (state, action) => {
        const index = state.meals.findIndex(
          meal => meal.id === action.payload.data.id
        );
        if (index !== -1) {
          state.meals[index] = action.payload.data;
        }
      })
      .addCase(deleteMeal.fulfilled, (state, action) => {
        state.meals = state.meals.filter(
          meal => meal.id !== action.payload
        );
      });
  },
});

export const { clearMealError, clearCurrentMeal } = mealSlice.actions;
export default mealSlice.reducer;