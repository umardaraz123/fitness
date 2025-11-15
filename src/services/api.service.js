import axiosInstance from '../config/axios.config';

// Authentication APIs
export const authAPI = {
  // User registration
  register: async (userData) => {
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
  },

  // User login
  login: async (credentials) => {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await axiosInstance.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Verify OTP
  verifyOtp: async (email, otp) => {
    const response = await axiosInstance.post('/auth/verify-otp', { email, otp });
    return response.data;
  },

  // Reset password
  resetPassword: async (data) => {
    const response = await axiosInstance.post('/auth/reset-password', data);
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await axiosInstance.post('/auth/logout');
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  }
};

// User APIs
export const userAPI = {
  // Get user profile
  getProfile: async () => {
    const response = await axiosInstance.get('/auth/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await axiosInstance.post('/auth/profile/update', userData);
    return response.data;
  },

  // Get user orders
  getOrders: async () => {
    const response = await axiosInstance.get('/user/orders');
    return response.data;
  },

  // Get user workout plans
  getWorkoutPlans: async () => {
    const response = await axiosInstance.get('/user/workout-plans');
    return response.data;
  },

  // Get user meal plans
  getMealPlans: async () => {
    const response = await axiosInstance.get('/user/meal-plans');
    return response.data;
  },

  // Get user memberships
  getMemberships: async () => {
    const response = await axiosInstance.get('/user/memberships');
    return response.data;
  }
};

// Product APIs
export const productAPI = {
  // Get all products with filters (Public)
  getProducts: async (params = {}) => {
    const response = await axiosInstance.get('/products', { params });
    return response.data;
  },

  // Get product by ID (Public)
  getProductById: async (id) => {
    const response = await axiosInstance.get(`/products/${id}`);
    return response.data;
  },

  // Get all products for admin (Admin - uses auth endpoint)
  getProductsAdmin: async (params = {}) => {
    const response = await axiosInstance.get('/auth/products', { params });
    return response.data;
  },

  // Get product by ID for admin (Admin - uses auth endpoint)
  getProductByIdAdmin: async (id) => {
    const response = await axiosInstance.get(`/auth/products/${id}`);
    return response.data;
  },

  // Create product (Admin)
  createProduct: async (data) => {
    const response = await axiosInstance.post('/auth/products', data);
    return response.data;
  },

  // Update product (Admin)
  updateProduct: async (id, data) => {
    const response = await axiosInstance.put(`/auth/products/${id}`, data);
    return response.data;
  },

  // Delete product (Admin)
  deleteProduct: async (id) => {
    const response = await axiosInstance.delete(`/auth/products/${id}`);
    return response.data;
  },

  // Get product categories (Public)
  getCategories: async (params = {}) => {
    const response = await axiosInstance.get('/categories', { params });
    return response.data;
  },

  // Get category by ID (Public)
  getCategoryById: async (id) => {
    const response = await axiosInstance.get(`/categories/${id}`);
    return response.data;
  },

  // Get categories for admin (Admin - uses auth endpoint)
  getCategoriesAdmin: async (params = {}) => {
    const response = await axiosInstance.get('/auth/categories', { params });
    return response.data;
  },

  // Get category by ID for admin (Admin - uses auth endpoint)
  getCategoryByIdAdmin: async (id) => {
    const response = await axiosInstance.get(`/auth/categories/${id}`);
    return response.data;
  },

  // Create category (Admin)
  createCategory: async (data) => {
    const response = await axiosInstance.post('/auth/categories', data);
    return response.data;
  },

  // Update category (Admin)
  updateCategory: async (id, data) => {
    const response = await axiosInstance.put(`/auth/categories/${id}`, data);
    return response.data;
  },

  // Delete category (Admin)
  deleteCategory: async (id) => {
    const response = await axiosInstance.delete(`/auth/categories/${id}`);
    return response.data;
  }
};

// Workout APIs
export const workoutAPI = {
  // Get all workouts (Public)
  getWorkouts: async (params = {}) => {
    const response = await axiosInstance.get('/workouts', { params });
    return response.data;
  },

  // Get workout by ID (Public)
  getWorkoutById: async (id) => {
    const response = await axiosInstance.get(`/workouts/${id}`);
    return response.data;
  },

  // Get all workouts for admin (Admin - uses auth endpoint)
  getWorkoutsAdmin: async (params = {}) => {
    const response = await axiosInstance.get('/auth/workouts', { params });
    return response.data;
  },

  // Get workout by ID for admin (Admin - uses auth endpoint)
  getWorkoutByIdAdmin: async (id) => {
    const response = await axiosInstance.get(`/auth/workouts/${id}`);
    return response.data;
  },

  // Create workout (Admin)
  createWorkout: async (data) => {
    const response = await axiosInstance.post('/auth/workouts', data);
    return response.data;
  },

  // Update workout (Admin)
  updateWorkout: async (id, data) => {
    const response = await axiosInstance.put(`/auth/workouts/${id}`, data);
    return response.data;
  },

  // Delete workout (Admin)
  deleteWorkout: async (id) => {
    const response = await axiosInstance.delete(`/auth/workouts/${id}`);
    return response.data;
  }
};

// Fitness Programs APIs
export const fitnessProgramAPI = {
  // Get all fitness programs
  getPrograms: async (params = {}) => {
    const response = await axiosInstance.get('/fitness-programs', { params });
    return response.data;
  },

  // Get program by ID
  getProgramById: async (id) => {
    const response = await axiosInstance.get(`/fitness-programs/${id}`);
    return response.data;
  },

  // Submit questionnaire
  submitQuestionnaire: async (data) => {
    const response = await axiosInstance.post('/fitness-programs/questionnaire', data);
    return response.data;
  }
};

// Meals APIs
export const mealAPI = {
  // Get all meals (Public)
  getMeals: async (params = {}) => {
    const response = await axiosInstance.get('/meals', { params });
    return response.data;
  },

  // Get meal by ID (Public)
  getMealById: async (id) => {
    const response = await axiosInstance.get(`/meals/${id}`);
    return response.data;
  },

  // Get all meals for admin (Admin - uses auth endpoint)
  getMealsAdmin: async (params = {}) => {
    const response = await axiosInstance.get('/auth/meals', { params });
    return response.data;
  },

  // Get meal by ID for admin (Admin - uses auth endpoint)
  getMealByIdAdmin: async (id) => {
    const response = await axiosInstance.get(`/auth/meals/${id}`);
    return response.data;
  },

  // Create meal (Admin)
  createMeal: async (data) => {
    const response = await axiosInstance.post('/auth/meals', data);
    return response.data;
  },

  // Update meal (Admin)
  updateMeal: async (id, data) => {
    const response = await axiosInstance.put(`/auth/meals/${id}`, data);
    return response.data;
  },

  // Delete meal (Admin)
  deleteMeal: async (id) => {
    const response = await axiosInstance.delete(`/auth/meals/${id}`);
    return response.data;
  }
};

// Plans APIs
export const planAPI = {
  // Get all plans (Public)
  getPlans: async (params = {}) => {
    const response = await axiosInstance.get('/plans', { params });
    return response.data;
  },

  // Get plan by ID (Public)
  getPlanById: async (id) => {
    const response = await axiosInstance.get(`/plans/${id}`);
    return response.data;
  },

  // Get all plans for admin (Admin - uses auth endpoint)
  getPlansAdmin: async (params = {}) => {
    const response = await axiosInstance.get('/auth/plans', { params });
    return response.data;
  },

  // Get plan by ID for admin (Admin - uses auth endpoint)
  getPlanByIdAdmin: async (id) => {
    const response = await axiosInstance.get(`/auth/plans/${id}`);
    return response.data;
  },

  // Create plan (Admin)
  createPlan: async (data) => {
    const response = await axiosInstance.post('/auth/plans', data);
    return response.data;
  },

  // Update plan (Admin)
  updatePlan: async (id, data) => {
    const response = await axiosInstance.put(`/auth/plans/${id}`, data);
    return response.data;
  },

  // Delete plan (Admin)
  deletePlan: async (id) => {
    const response = await axiosInstance.delete(`/auth/plans/${id}`);
    return response.data;
  }
};

// Cart APIs
export const cartAPI = {
  // Get cart
  getCart: async () => {
    const response = await axiosInstance.get('/cart');
    return response.data;
  },

  // Add to cart
  addToCart: async (item) => {
    const response = await axiosInstance.post('/cart/add', item);
    return response.data;
  },

  // Update cart item
  updateCartItem: async (itemId, quantity) => {
    const response = await axiosInstance.put(`/cart/items/${itemId}`, { quantity });
    return response.data;
  },

  // Remove from cart
  removeFromCart: async (itemId) => {
    const response = await axiosInstance.delete(`/cart/items/${itemId}`);
    return response.data;
  },

  // Clear cart
  clearCart: async () => {
    const response = await axiosInstance.delete('/cart');
    return response.data;
  }
};

// Order APIs
export const orderAPI = {
  // Create order
  createOrder: async (orderData) => {
    const response = await axiosInstance.post('/orders', orderData);
    return response.data;
  },

  // Get order by ID
  getOrderById: async (orderId) => {
    const response = await axiosInstance.get(`/orders/${orderId}`);
    return response.data;
  },

  // Get user orders
  getUserOrders: async () => {
    const response = await axiosInstance.get('/orders');
    return response.data;
  }
};

// Admin APIs
export const adminAPI = {
  // Get all clients
  getClients: async (params = {}) => {
    const response = await axiosInstance.get('/admin/clients', { params });
    return response.data;
  },

  // Get client by ID
  getClientById: async (id) => {
    const response = await axiosInstance.get(`/admin/clients/${id}`);
    return response.data;
  },

  // Create workout plan
  createWorkoutPlan: async (planData) => {
    const response = await axiosInstance.post('/admin/workout-plans', planData);
    return response.data;
  },

  // Update workout plan
  updateWorkoutPlan: async (planId, planData) => {
    const response = await axiosInstance.put(`/admin/workout-plans/${planId}`, planData);
    return response.data;
  },

  // Get client questionnaire
  getClientQuestionnaire: async (clientId) => {
    const response = await axiosInstance.get(`/admin/clients/${clientId}/questionnaire`);
    return response.data;
  },

  // Send message to client
  sendMessage: async (clientId, message) => {
    const response = await axiosInstance.post(`/admin/clients/${clientId}/messages`, message);
    return response.data;
  },

  // Get messages
  getMessages: async (clientId) => {
    const response = await axiosInstance.get(`/admin/clients/${clientId}/messages`);
    return response.data;
  }
};

// Membership APIs
export const membershipAPI = {
  // Get all membership plans
  getPlans: async () => {
    const response = await axiosInstance.get('/memberships/plans');
    return response.data;
  },

  // Subscribe to membership
  subscribe: async (planData) => {
    const response = await axiosInstance.post('/memberships/subscribe', planData);
    return response.data;
  },

  // Cancel membership
  cancelMembership: async (membershipId) => {
    const response = await axiosInstance.delete(`/memberships/${membershipId}`);
    return response.data;
  }
};

export default {
  auth: authAPI,
  user: userAPI,
  product: productAPI,
  fitnessProgram: fitnessProgramAPI,
  meal: mealAPI,
  cart: cartAPI,
  order: orderAPI,
  admin: adminAPI,
  membership: membershipAPI
};
