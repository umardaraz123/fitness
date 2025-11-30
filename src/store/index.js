// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './slices/chatSlice';
import notificationReducer from './slices/notificationSlice';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import productReducer from './slices/productSlice';
import workoutReducer from './slices/workoutSlice';
import mealReducer from './slices/mealSlice';
import planReducer from './slices/planSlice';
import cartReducer from './slices/cartSlice';
import orderReducer from './slices/orderSlice';
import adminReducer from './slices/adminSlice';
import membershipReducer from './slices/membershipSlice';
import fitnessProgramReducer from './slices/fitnessProgramSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    products: productReducer,
    workouts: workoutReducer,
    meals: mealReducer,
    plans: planReducer,
    cart: cartReducer,
    orders: orderReducer,
    admin: adminReducer,
    memberships: membershipReducer,
    fitnessPrograms: fitnessProgramReducer,
    chat: chatReducer,
    notifications: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['chat/setSocket'],
        ignoredPaths: ['chat.socket'],
      },
    }),
});

