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
  },

  // Resend OTP
  resendOtp: async (email) => {
    const response = await axiosInstance.post('/auth/resend-otp', { email });
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

  // Get product by GUID (Public)
  getProductByGuid: async (guid) => {
    const response = await axiosInstance.get(`/products/guid/${guid}`);
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

  // Get workout by GUID (Public)
  getWorkoutByGuid: async (guid) => {
    const response = await axiosInstance.get(`/workouts/guid/${guid}`);
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

  // Get program by GUID
  getProgramByGuid: async (guid) => {
    const response = await axiosInstance.get(`/fitness-programs/guid/${guid}`);
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

  // Get meal by GUID (Public)
  getMealByGuid: async (guid) => {
    const response = await axiosInstance.get(`/meals/guid/${guid}`);
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

  // Get plan by GUID (Public)
  getPlanByGuid: async (guid) => {
    const response = await axiosInstance.get(`/plans/guid/${guid}`);
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
  },

  // Get cart count
  getCartCount: async () => {
    const response = await axiosInstance.get('/cart/count');
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
  },

  // Get order by GUID
  getOrderByGuid: async (guid) => {
    const response = await axiosInstance.get(`/orders/guid/${guid}`);
    return response.data;
  },

  // Update order status
  updateOrderStatus: async (orderId, status) => {
    const response = await axiosInstance.put(`/orders/${orderId}/status`, { status });
    return response.data;
  },

  // Cancel order
  cancelOrder: async (orderId) => {
    const response = await axiosInstance.put(`/orders/${orderId}/cancel`);
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

  // Get client by GUID
  getClientByGuid: async (guid) => {
    const response = await axiosInstance.get(`/admin/clients/guid/${guid}`);
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
  },

  // Get dashboard stats
  getDashboardStats: async () => {
    const response = await axiosInstance.get('/admin/dashboard/stats');
    return response.data;
  },

  // Get recent orders
  getRecentOrders: async () => {
    const response = await axiosInstance.get('/admin/orders/recent');
    return response.data;
  },

  // Get all orders
  getAllOrders: async (params = {}) => {
    const response = await axiosInstance.get('/admin/orders', { params });
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

  // Get plan by ID
  getPlanById: async (id) => {
    const response = await axiosInstance.get(`/memberships/plans/${id}`);
    return response.data;
  },

  // Get plan by GUID
  getPlanByGuid: async (guid) => {
    const response = await axiosInstance.get(`/memberships/plans/guid/${guid}`);
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
  },

  // Get user membership
  getUserMembership: async () => {
    const response = await axiosInstance.get('/memberships/user');
    return response.data;
  },

  // Update membership
  updateMembership: async (membershipId, data) => {
    const response = await axiosInstance.put(`/memberships/${membershipId}`, data);
    return response.data;
  }
};

// Upload APIs
export const uploadAPI = {
  // Upload single file
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axiosInstance.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Upload multiple files
  uploadMultipleFiles: async (files) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files[]', file);
    });
    const response = await axiosInstance.post('/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete file
  deleteFile: async (filePath) => {
    const response = await axiosInstance.delete('/upload', {
      data: { file_path: filePath }
    });
    return response.data;
  }
};

// Notification APIs
export const notificationAPI = {
  // Get user notifications
  getNotifications: async () => {
    const response = await axiosInstance.get('/notifications');
    return response.data;
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    const response = await axiosInstance.put(`/notifications/${notificationId}/read`);
    return response.data;
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    const response = await axiosInstance.put('/notifications/read-all');
    return response.data;
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    const response = await axiosInstance.delete(`/notifications/${notificationId}`);
    return response.data;
  }
};

// Comprehensive Chat APIs
export const chatAPI = {
  // Conversations
  getConversations: async (params = {}) => {
    const response = await axiosInstance.get('/chat/conversations', { params });
    return response.data;
  },

  getConversationById: async (conversationId) => {
    const response = await axiosInstance.get(`/chat/conversations/${conversationId}`);
    return response.data;
  },

  createConversation: async (conversationData) => {
    const response = await axiosInstance.post('/chat/conversations', conversationData);
    return response.data;
  },

  updateConversation: async (conversationId, updateData) => {
    const response = await axiosInstance.put(`/chat/conversations/${conversationId}`, updateData);
    return response.data;
  },

  deleteConversation: async (conversationId) => {
    const response = await axiosInstance.delete(`/chat/conversations/${conversationId}`);
    return response.data;
  },

  // Messages
  getConversationMessages: async (conversationId, params = {}) => {
    const response = await axiosInstance.get(`/chat/conversations/${conversationId}/messages`, { params });
    return response.data;
  },

  sendMessage: async (messageData) => {
    const response = await axiosInstance.post('/chat/send-message', messageData);
    return response.data;
  },

  sendMessageWithAttachment: async (formData) => {
    const response = await axiosInstance.post('/chat/send-message', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  getMessageById: async (messageId) => {
    const response = await axiosInstance.get(`/chat/messages/${messageId}`);
    return response.data;
  },

  updateMessage: async (messageId, updateData) => {
    const response = await axiosInstance.put(`/chat/messages/${messageId}`, updateData);
    return response.data;
  },

  deleteMessage: async (messageId) => {
    const response = await axiosInstance.delete(`/chat/messages/${messageId}`);
    return response.data;
  },

  // Message Reactions
  addReaction: async (messageId, reaction) => {
    const response = await axiosInstance.post(`/chat/messages/${messageId}/reactions`, { reaction });
    return response.data;
  },

  removeReaction: async (messageId, reactionId) => {
    const response = await axiosInstance.delete(`/chat/messages/${messageId}/reactions/${reactionId}`);
    return response.data;
  },

  // Message Status
  markAsRead: async (conversationId) => {
    const response = await axiosInstance.post(`/chat/conversations/${conversationId}/read`);
    return response.data;
  },

  markAsDelivered: async (conversationId) => {
    const response = await axiosInstance.post(`/chat/conversations/${conversationId}/delivered`);
    return response.data;
  },

  // Groups
  createGroup: async (groupData) => {
    const response = await axiosInstance.post('/chat/create-group', groupData);
    return response.data;
  },

  updateGroup: async (groupId, groupData) => {
    const response = await axiosInstance.put(`/chat/groups/${groupId}`, groupData);
    return response.data;
  },

  getGroupById: async (groupId) => {
    const response = await axiosInstance.get(`/chat/groups/${groupId}`);
    return response.data;
  },

  deleteGroup: async (groupId) => {
    const response = await axiosInstance.delete(`/chat/groups/${groupId}`);
    return response.data;
  },

  // Group Members
  addGroupMember: async (groupId, userId) => {
    const response = await axiosInstance.post(`/chat/groups/${groupId}/members`, { user_id: userId });
    return response.data;
  },

  removeGroupMember: async (groupId, userId) => {
    const response = await axiosInstance.delete(`/chat/groups/${groupId}/members/${userId}`);
    return response.data;
  },

  updateGroupMember: async (groupId, userId, role) => {
    const response = await axiosInstance.put(`/chat/groups/${groupId}/members/${userId}`, { role });
    return response.data;
  },

  getGroupMembers: async (groupId) => {
    const response = await axiosInstance.get(`/chat/groups/${groupId}/members`);
    return response.data;
  },

  leaveGroup: async (groupId) => {
    const response = await axiosInstance.post(`/chat/groups/${groupId}/leave`);
    return response.data;
  },

  // Search
  searchUsers: async (searchTerm, params = {}) => {
    const response = await axiosInstance.get(`/chat/search-users?search=${searchTerm}`, { params });
    return response.data;
  },

  searchMessages: async (conversationId, searchTerm, params = {}) => {
    const response = await axiosInstance.get(`/chat/conversations/${conversationId}/search?q=${searchTerm}`, { params });
    return response.data;
  },

  searchGlobal: async (searchTerm, params = {}) => {
    const response = await axiosInstance.get(`/chat/search?q=${searchTerm}`, { params });
    return response.data;
  },

  // Typing Indicators
  startTyping: async (conversationId) => {
    const response = await axiosInstance.post(`/chat/conversations/${conversationId}/typing`);
    return response.data;
  },

  stopTyping: async (conversationId) => {
    const response = await axiosInstance.delete(`/chat/conversations/${conversationId}/typing`);
    return response.data;
  },

  // Presence
  updatePresence: async (status) => {
    const response = await axiosInstance.post('/chat/presence', { status });
    return response.data;
  },

  getOnlineUsers: async () => {
    const response = await axiosInstance.get('/chat/online-users');
    return response.data;
  },

  // Attachments
  uploadAttachment: async (file) => {
    const formData = new FormData();
    formData.append('attachment', file);
    const response = await axiosInstance.post('/chat/upload-attachment', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  getAttachment: async (attachmentId) => {
    const response = await axiosInstance.get(`/chat/attachments/${attachmentId}`);
    return response.data;
  },

  deleteAttachment: async (attachmentId) => {
    const response = await axiosInstance.delete(`/chat/attachments/${attachmentId}`);
    return response.data;
  },

  // Message Forwarding
  forwardMessage: async (messageId, conversationIds) => {
    const response = await axiosInstance.post(`/chat/messages/${messageId}/forward`, { conversation_ids: conversationIds });
    return response.data;
  },

  // Message Replies
  getMessageThread: async (messageId) => {
    const response = await axiosInstance.get(`/chat/messages/${messageId}/thread`);
    return response.data;
  },

  // Pinned Messages
  pinMessage: async (conversationId, messageId) => {
    const response = await axiosInstance.post(`/chat/conversations/${conversationId}/pin`, { message_id: messageId });
    return response.data;
  },

  unpinMessage: async (conversationId, messageId) => {
    const response = await axiosInstance.delete(`/chat/conversations/${conversationId}/pin/${messageId}`);
    return response.data;
  },

  getPinnedMessages: async (conversationId) => {
    const response = await axiosInstance.get(`/chat/conversations/${conversationId}/pinned-messages`);
    return response.data;
  },

  // Archived Conversations
  getArchivedConversations: async (params = {}) => {
    const response = await axiosInstance.get('/chat/conversations/archived', { params });
    return response.data;
  },

  archiveConversation: async (conversationId) => {
    const response = await axiosInstance.post(`/chat/conversations/${conversationId}/archive`);
    return response.data;
  },

  unarchiveConversation: async (conversationId) => {
    const response = await axiosInstance.post(`/chat/conversations/${conversationId}/unarchive`);
    return response.data;
  },

  // Blocking
  blockUser: async (userId) => {
    const response = await axiosInstance.post('/chat/block', { user_id: userId });
    return response.data;
  },

  unblockUser: async (userId) => {
    const response = await axiosInstance.delete(`/chat/block/${userId}`);
    return response.data;
  },

  getBlockedUsers: async () => {
    const response = await axiosInstance.get('/chat/blocked-users');
    return response.data;
  },

  // Chat Settings
  getChatSettings: async () => {
    const response = await axiosInstance.get('/chat/settings');
    return response.data;
  },

  updateChatSettings: async (settings) => {
    const response = await axiosInstance.put('/chat/settings', settings);
    return response.data;
  },

  // Statistics
  getChatStatistics: async (params = {}) => {
    const response = await axiosInstance.get('/chat/statistics', { params });
    return response.data;
  },

  // Clear History
  clearConversationHistory: async (conversationId) => {
    const response = await axiosInstance.delete(`/chat/conversations/${conversationId}/messages`);
    return response.data;
  }
};

// Export all APIs
export default {
  auth: authAPI,
  user: userAPI,
  product: productAPI,
  workout: workoutAPI,
  fitnessProgram: fitnessProgramAPI,
  meal: mealAPI,
  plan: planAPI,
  cart: cartAPI,
  order: orderAPI,
  admin: adminAPI,
  membership: membershipAPI,
  upload: uploadAPI,
  notification: notificationAPI,
  chat: chatAPI
};