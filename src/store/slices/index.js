// store/slices/index.js

// Auth exports
export {
  register,
  login,
  forgotPassword,
  verifyOtp,
  resetPassword,
  logout,
  getCurrentUser,
  clearAuthError,
  clearAuthMessage,
  setCredentials,
  resetOtpState,
} from './authSlice';

// User exports
export {
  getProfile,
  updateProfile,
  getOrders,
  getWorkoutPlans,
  getMealPlans,
  getMemberships,
  clearUserError,
} from './userSlice';

// Product exports
export {
  getProducts,
  getProductById,
  getProductsAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  clearProductError,
  clearCurrentProduct,
} from './productSlice';

// Workout exports
export {
  getWorkouts,
  getWorkoutById,
  createWorkout,
  clearWorkoutError,
} from './workoutSlice';

// Meal exports
export {
  getMeals,
  getMealById,
  createMeal,
  updateMeal,
  deleteMeal,
  clearMealError,
} from './mealSlice';

// Plan exports
export {
  getPlans,
  getPlanById,
  createPlan,
  updatePlan,
  deletePlan,
  clearPlanError,
} from './planSlice';

// Cart exports
export {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  clearCartError,
} from './cartSlice';

// Order exports
export {
  createOrder,
  getOrderById,
  getUserOrders,
  clearOrderError,
} from './orderSlice';

// Admin exports
export {
  getClients,
  getClientById,
  createWorkoutPlan,
  updateWorkoutPlan,
  getClientQuestionnaire,
  sendMessage,
  getMessages,
  clearAdminError,
} from './adminSlice';

// Membership exports
export {
  getPlans as getMembershipPlans,
  subscribe,
  cancelMembership,
  clearMembershipError,
} from './membershipSlice';

// Fitness Program exports
export {
  getPrograms,
  getProgramById,
  submitQuestionnaire,
  clearFitnessProgramError,
} from './fitnessProgramSlice';