// hooks/reduxHooks.js
import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
  // Auth Actions
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
  
  // User Actions
  getProfile,
  updateProfile,
  getOrders,
  getWorkoutPlans,
  getMealPlans,
  getMemberships,
  clearUserError,
  
  // Product Actions
  getProducts,
  getProductById,
  getProductsAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  clearProductError,
  clearCurrentProduct,
  
  // Workout Actions
  getWorkouts,
  getWorkoutById,
  createWorkout,
  clearWorkoutError,
  
  // Meal Actions
  getMeals,
  getMealById,
  createMeal,
  updateMeal,
  deleteMeal,
  clearMealError,
  
  // Plan Actions
  getPlans,
  getPlanById,
  createPlan,
  updatePlan,
  deletePlan,
  clearPlanError,
  
  // Cart Actions
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  clearCartError,
  
  // Order Actions
  createOrder,
  getOrderById,
  getUserOrders,
  clearOrderError,
  
  // Admin Actions
  getClients,
  getClientById,
  createWorkoutPlan,
  updateWorkoutPlan,
  getClientQuestionnaire,
  sendMessage,
  getMessages,
  clearAdminError,
  
  // Membership Actions
  getPlans as getMembershipPlans,
  subscribe,
  cancelMembership,
  clearMembershipError,
  
  // Fitness Program Actions
  getPrograms,
  getProgramById,
  submitQuestionnaire,
  clearFitnessProgramError,
} from '../store/slices';

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

// Auth Hook
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  const handleLogin = useCallback((credentials) => {
    return dispatch(login(credentials));
  }, [dispatch]);

  const handleRegister = useCallback((userData) => {
    return dispatch(register(userData));
  }, [dispatch]);

  const handleLogout = useCallback(() => {
    return dispatch(logout());
  }, [dispatch]);

  const handleForgotPassword = useCallback((email) => {
    return dispatch(forgotPassword(email));
  }, [dispatch]);

  const handleVerifyOtp = useCallback((email, otp) => {
    return dispatch(verifyOtp({ email, otp }));
  }, [dispatch]);

  const handleResetPassword = useCallback((resetData) => {
    return dispatch(resetPassword(resetData));
  }, [dispatch]);

  const handleGetCurrentUser = useCallback(() => {
    return dispatch(getCurrentUser());
  }, [dispatch]);

  const handleClearAuthError = useCallback(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const handleClearAuthMessage = useCallback(() => {
    dispatch(clearAuthMessage());
  }, [dispatch]);

  const handleSetCredentials = useCallback((credentials) => {
    dispatch(setCredentials(credentials));
  }, [dispatch]);

  const handleResetOtpState = useCallback(() => {
    dispatch(resetOtpState());
  }, [dispatch]);

  return {
    ...auth,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    forgotPassword: handleForgotPassword,
    verifyOtp: handleVerifyOtp,
    resetPassword: handleResetPassword,
    getCurrentUser: handleGetCurrentUser,
    clearError: handleClearAuthError,
    clearMessage: handleClearAuthMessage,
    setCredentials: handleSetCredentials,
    resetOtpState: handleResetOtpState,
  };
};

// User Hook
export const useUser = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);

  const handleGetProfile = useCallback(() => {
    return dispatch(getProfile());
  }, [dispatch]);

  const handleUpdateProfile = useCallback((userData) => {
    return dispatch(updateProfile(userData));
  }, [dispatch]);

  const handleGetOrders = useCallback(() => {
    return dispatch(getOrders());
  }, [dispatch]);

  const handleGetWorkoutPlans = useCallback(() => {
    return dispatch(getWorkoutPlans());
  }, [dispatch]);

  const handleGetMealPlans = useCallback(() => {
    return dispatch(getMealPlans());
  }, [dispatch]);

  const handleGetMemberships = useCallback(() => {
    return dispatch(getMemberships());
  }, [dispatch]);

  const handleClearUserError = useCallback(() => {
    dispatch(clearUserError());
  }, [dispatch]);

  return {
    ...user,
    getProfile: handleGetProfile,
    updateProfile: handleUpdateProfile,
    getOrders: handleGetOrders,
    getWorkoutPlans: handleGetWorkoutPlans,
    getMealPlans: handleGetMealPlans,
    getMemberships: handleGetMemberships,
    clearError: handleClearUserError,
  };
};

// Product Hook
export const useProducts = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products);

  const handleGetProducts = useCallback((params = {}) => {
    return dispatch(getProducts(params));
  }, [dispatch]);

  const handleGetProductById = useCallback((id) => {
    return dispatch(getProductById(id));
  }, [dispatch]);

  const handleGetProductsAdmin = useCallback((params = {}) => {
    return dispatch(getProductsAdmin(params));
  }, [dispatch]);

  const handleCreateProduct = useCallback((data) => {
    return dispatch(createProduct(data));
  }, [dispatch]);

  const handleUpdateProduct = useCallback((id, data) => {
    return dispatch(updateProduct({ id, data }));
  }, [dispatch]);

  const handleDeleteProduct = useCallback((id) => {
    return dispatch(deleteProduct(id));
  }, [dispatch]);

  const handleGetCategories = useCallback((params = {}) => {
    return dispatch(getCategories(params));
  }, [dispatch]);

  const handleClearProductError = useCallback(() => {
    dispatch(clearProductError());
  }, [dispatch]);

  const handleClearCurrentProduct = useCallback(() => {
    dispatch(clearCurrentProduct());
  }, [dispatch]);

  return {
    ...products,
    getProducts: handleGetProducts,
    getProductById: handleGetProductById,
    getProductsAdmin: handleGetProductsAdmin,
    createProduct: handleCreateProduct,
    updateProduct: handleUpdateProduct,
    deleteProduct: handleDeleteProduct,
    getCategories: handleGetCategories,
    clearError: handleClearProductError,
    clearCurrentProduct: handleClearCurrentProduct,
  };
};

// Workout Hook
export const useWorkouts = () => {
  const dispatch = useAppDispatch();
  const workouts = useAppSelector((state) => state.workouts);

  const handleGetWorkouts = useCallback((params = {}) => {
    return dispatch(getWorkouts(params));
  }, [dispatch]);

  const handleGetWorkoutById = useCallback((id) => {
    return dispatch(getWorkoutById(id));
  }, [dispatch]);

  const handleCreateWorkout = useCallback((data) => {
    return dispatch(createWorkout(data));
  }, [dispatch]);

  const handleClearWorkoutError = useCallback(() => {
    dispatch(clearWorkoutError());
  }, [dispatch]);

  return {
    ...workouts,
    getWorkouts: handleGetWorkouts,
    getWorkoutById: handleGetWorkoutById,
    createWorkout: handleCreateWorkout,
    clearError: handleClearWorkoutError,
  };
};

// Meal Hook
export const useMeals = () => {
  const dispatch = useAppDispatch();
  const meals = useAppSelector((state) => state.meals);

  const handleGetMeals = useCallback((params = {}) => {
    return dispatch(getMeals(params));
  }, [dispatch]);

  const handleGetMealById = useCallback((id) => {
    return dispatch(getMealById(id));
  }, [dispatch]);

  const handleCreateMeal = useCallback((data) => {
    return dispatch(createMeal(data));
  }, [dispatch]);

  const handleUpdateMeal = useCallback((id, data) => {
    return dispatch(updateMeal({ id, data }));
  }, [dispatch]);

  const handleDeleteMeal = useCallback((id) => {
    return dispatch(deleteMeal(id));
  }, [dispatch]);

  const handleClearMealError = useCallback(() => {
    dispatch(clearMealError());
  }, [dispatch]);

  return {
    ...meals,
    getMeals: handleGetMeals,
    getMealById: handleGetMealById,
    createMeal: handleCreateMeal,
    updateMeal: handleUpdateMeal,
    deleteMeal: handleDeleteMeal,
    clearError: handleClearMealError,
  };
};

// Plan Hook
export const usePlans = () => {
  const dispatch = useAppDispatch();
  const plans = useAppSelector((state) => state.plans);

  const handleGetPlans = useCallback((params = {}) => {
    return dispatch(getPlans(params));
  }, [dispatch]);

  const handleGetPlanById = useCallback((id) => {
    return dispatch(getPlanById(id));
  }, [dispatch]);

  const handleCreatePlan = useCallback((data) => {
    return dispatch(createPlan(data));
  }, [dispatch]);

  const handleUpdatePlan = useCallback((id, data) => {
    return dispatch(updatePlan({ id, data }));
  }, [dispatch]);

  const handleDeletePlan = useCallback((id) => {
    return dispatch(deletePlan(id));
  }, [dispatch]);

  const handleClearPlanError = useCallback(() => {
    dispatch(clearPlanError());
  }, [dispatch]);

  return {
    ...plans,
    getPlans: handleGetPlans,
    getPlanById: handleGetPlanById,
    createPlan: handleCreatePlan,
    updatePlan: handleUpdatePlan,
    deletePlan: handleDeletePlan,
    clearError: handleClearPlanError,
  };
};

// Cart Hook
export const useCart = () => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart);

  const handleGetCart = useCallback(() => {
    return dispatch(getCart());
  }, [dispatch]);

  const handleAddToCart = useCallback((item) => {
    return dispatch(addToCart(item));
  }, [dispatch]);

  const handleUpdateCartItem = useCallback((itemId, quantity) => {
    return dispatch(updateCartItem({ itemId, quantity }));
  }, [dispatch]);

  const handleRemoveFromCart = useCallback((itemId) => {
    return dispatch(removeFromCart(itemId));
  }, [dispatch]);

  const handleClearCart = useCallback(() => {
    return dispatch(clearCart());
  }, [dispatch]);

  const handleClearCartError = useCallback(() => {
    dispatch(clearCartError());
  }, [dispatch]);

  return {
    ...cart,
    getCart: handleGetCart,
    addToCart: handleAddToCart,
    updateCartItem: handleUpdateCartItem,
    removeFromCart: handleRemoveFromCart,
    clearCart: handleClearCart,
    clearError: handleClearCartError,
  };
};

// Order Hook
export const useOrders = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.orders);

  const handleCreateOrder = useCallback((orderData) => {
    return dispatch(createOrder(orderData));
  }, [dispatch]);

  const handleGetOrderById = useCallback((orderId) => {
    return dispatch(getOrderById(orderId));
  }, [dispatch]);

  const handleGetUserOrders = useCallback(() => {
    return dispatch(getUserOrders());
  }, [dispatch]);

  const handleClearOrderError = useCallback(() => {
    dispatch(clearOrderError());
  }, [dispatch]);

  return {
    ...orders,
    createOrder: handleCreateOrder,
    getOrderById: handleGetOrderById,
    getUserOrders: handleGetUserOrders,
    clearError: handleClearOrderError,
  };
};

// Admin Hook
export const useAdmin = () => {
  const dispatch = useAppDispatch();
  const admin = useAppSelector((state) => state.admin);

  const handleGetClients = useCallback((params = {}) => {
    return dispatch(getClients(params));
  }, [dispatch]);

  const handleGetClientById = useCallback((id) => {
    return dispatch(getClientById(id));
  }, [dispatch]);

  const handleCreateWorkoutPlan = useCallback((planData) => {
    return dispatch(createWorkoutPlan(planData));
  }, [dispatch]);

  const handleUpdateWorkoutPlan = useCallback((planId, planData) => {
    return dispatch(updateWorkoutPlan({ planId, planData }));
  }, [dispatch]);

  const handleGetClientQuestionnaire = useCallback((clientId) => {
    return dispatch(getClientQuestionnaire(clientId));
  }, [dispatch]);

  const handleSendMessage = useCallback((clientId, message) => {
    return dispatch(sendMessage({ clientId, message }));
  }, [dispatch]);

  const handleGetMessages = useCallback((clientId) => {
    return dispatch(getMessages(clientId));
  }, [dispatch]);

  const handleClearAdminError = useCallback(() => {
    dispatch(clearAdminError());
  }, [dispatch]);

  return {
    ...admin,
    getClients: handleGetClients,
    getClientById: handleGetClientById,
    createWorkoutPlan: handleCreateWorkoutPlan,
    updateWorkoutPlan: handleUpdateWorkoutPlan,
    getClientQuestionnaire: handleGetClientQuestionnaire,
    sendMessage: handleSendMessage,
    getMessages: handleGetMessages,
    clearError: handleClearAdminError,
  };
};

// Membership Hook
export const useMemberships = () => {
  const dispatch = useAppDispatch();
  const memberships = useAppSelector((state) => state.memberships);

  const handleGetPlans = useCallback(() => {
    return dispatch(getMembershipPlans());
  }, [dispatch]);

  const handleSubscribe = useCallback((planData) => {
    return dispatch(subscribe(planData));
  }, [dispatch]);

  const handleCancelMembership = useCallback((membershipId) => {
    return dispatch(cancelMembership(membershipId));
  }, [dispatch]);

  const handleClearMembershipError = useCallback(() => {
    dispatch(clearMembershipError());
  }, [dispatch]);

  return {
    ...memberships,
    getPlans: handleGetPlans,
    subscribe: handleSubscribe,
    cancelMembership: handleCancelMembership,
    clearError: handleClearMembershipError,
  };
};

// Fitness Program Hook
export const useFitnessPrograms = () => {
  const dispatch = useAppDispatch();
  const fitnessPrograms = useAppSelector((state) => state.fitnessPrograms);

  const handleGetPrograms = useCallback((params = {}) => {
    return dispatch(getPrograms(params));
  }, [dispatch]);

  const handleGetProgramById = useCallback((id) => {
    return dispatch(getProgramById(id));
  }, [dispatch]);

  const handleSubmitQuestionnaire = useCallback((data) => {
    return dispatch(submitQuestionnaire(data));
  }, [dispatch]);

  const handleClearFitnessProgramError = useCallback(() => {
    dispatch(clearFitnessProgramError());
  }, [dispatch]);

  return {
    ...fitnessPrograms,
    getPrograms: handleGetPrograms,
    getProgramById: handleGetProgramById,
    submitQuestionnaire: handleSubmitQuestionnaire,
    clearError: handleClearFitnessProgramError,
  };
};

// Notification Hook (for existing notifications slice)
export const useNotifications = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector((state) => state.notifications);

  return {
    ...notifications,
    // Add notification actions here if needed
  };
};

// Chat Hook (for existing chat slice)
export const useChat = () => {
  const dispatch = useAppDispatch();
  const chat = useAppSelector((state) => state.chat);

  return {
    ...chat,
    // Add chat actions here if needed
  };
};

// Combined Hook for easy access to all state
export const useAppState = () => {
  const auth = useAuth();
  const user = useUser();
  const products = useProducts();
  const workouts = useWorkouts();
  const meals = useMeals();
  const plans = usePlans();
  const cart = useCart();
  const orders = useOrders();
  const admin = useAdmin();
  const memberships = useMemberships();
  const fitnessPrograms = useFitnessPrograms();
  const notifications = useNotifications();
  const chat = useChat();

  return {
    auth,
    user,
    products,
    workouts,
    meals,
    plans,
    cart,
    orders,
    admin,
    memberships,
    fitnessPrograms,
    notifications,
    chat,
  };
};