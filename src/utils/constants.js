/**
 * Application-wide constants
 */

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  TRAINER: 'trainer',
  USER: 'user',
  CLIENT: 'client'
};

// Order status
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded'
};

// Payment status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};

// Workout plan status
export const WORKOUT_PLAN_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  PAUSED: 'paused',
  CANCELLED: 'cancelled'
};

// Meal plan status
export const MEAL_PLAN_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Product categories
export const PRODUCT_CATEGORIES = {
  SUPPLEMENTS: 'supplements',
  EQUIPMENT: 'equipment',
  APPAREL: 'apparel',
  ACCESSORIES: 'accessories'
};

// Fitness program types
export const FITNESS_PROGRAM_TYPES = {
  DIET: 'diet',
  WORKOUT: 'workout',
  HYBRID: 'hybrid'
};

// Fitness goals
export const FITNESS_GOALS = {
  WEIGHT_LOSS: 'weight-loss',
  WEIGHT_GAIN: 'weight-gain',
  MUSCLE_GAIN: 'muscle-gain',
  STRENGTH: 'strength',
  ENDURANCE: 'endurance',
  BALANCED: 'balanced'
};

// Activity levels
export const ACTIVITY_LEVELS = {
  SEDENTARY: 'sedentary',
  LIGHTLY_ACTIVE: 'lightly-active',
  MODERATELY_ACTIVE: 'moderately-active',
  VERY_ACTIVE: 'very-active',
  EXTREMELY_ACTIVE: 'extremely-active'
};

// Membership plan types
export const MEMBERSHIP_TYPES = {
  GYM: 'gym',
  TRAINER: 'trainer',
  ULTIMATE: 'ultimate'
};

// Billing cycles
export const BILLING_CYCLES = {
  MONTHLY: 'monthly',
  YEARLY: 'yearly'
};

// Local storage keys
export const STORAGE_KEYS = {
  USER_TOKEN: 'userToken',
  USER_DATA: 'userData',
  CART_ITEMS: 'cartItems',
  THEME: 'theme',
  LANGUAGE: 'language'
};

export default {
  USER_ROLES,
  ORDER_STATUS,
  PAYMENT_STATUS,
  WORKOUT_PLAN_STATUS,
  MEAL_PLAN_STATUS,
  PRODUCT_CATEGORIES,
  FITNESS_PROGRAM_TYPES,
  FITNESS_GOALS,
  ACTIVITY_LEVELS,
  MEMBERSHIP_TYPES,
  BILLING_CYCLES,
  STORAGE_KEYS
};
