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
  sendMessage as sendAdminMessage,
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

// Gallery Images exports
export {
  deleteGalleryImage,
  safeDeleteGalleryImage,
  bulkDeleteGalleryImages,
  setAsFeatured,
  updateImagePosition,
  reorderImages,
  uploadAndAttachImages,
  detachImage,
  restoreImage,
  clearDeleteError,
  clearBulkDeleteResults,
  clearFeatureError,
  clearPositionError,
  clearGalleryUploadError,
  clearOperationError,
  clearSuccessMessage,
  clearAllErrors,
  resetGalleryImageState,
} from './galleryImageSlice';

// Notification exports
export {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearNotificationError,
} from './notificationSlice';

// Chat exports
export {
  // Conversations
  getConversations,
  getConversationById,
  createConversation,
  updateConversation,
  deleteConversation,

  // Messages
  getConversationMessages,
  sendMessage,
  getMessageById,
  updateMessage,
  deleteMessage,

  // Message Reactions
  addReaction,
  removeReaction,

  // Message Status
  markAsRead as markMessageAsRead,
  markAsDelivered,

  // Groups
  createGroup,
  updateGroup,
  getGroupById,
  deleteGroup,

  // Group Members
  addGroupMember,
  removeGroupMember,
  updateGroupMember,
  getGroupMembers,
  leaveGroup,

  // Search
  searchUsers,
  searchMessages,
  searchGlobal,

  // Typing Indicators
  startTyping,
  stopTyping,

  // Presence
  updatePresence,
  getOnlineUsers,

  // Attachments
  uploadAttachment,
  getAttachment,
  deleteAttachment,

  // Message Forwarding
  forwardMessage,

  // Message Replies
  getMessageThread,

  // Pinned Messages
  pinMessage,
  unpinMessage,
  getPinnedMessages,

  // Archived Conversations
  getArchivedConversations,
  archiveConversation,
  unarchiveConversation,

  // Blocking
  blockUser,
  unblockUser,
  getBlockedUsers,

  // Chat Settings
  getChatSettings,
  updateChatSettings,

  // Statistics
  getChatStatistics,

  // Clear History
  clearConversationHistory,

  // Error Clearing
  clearChatError,
  resetChatState,
} from './chatSlice';

// Upload exports
export {
  uploadFile,
  uploadMultipleFiles,
  deleteFile,
  setSingleUploadProgress,
  setMultipleUploadProgress,
  clearUploadedFile,
  clearUploadedFiles,
  clearSingleUploadError,
  clearMultipleUploadError,
  clearFileDeleteError,
  clearUploadSuccessMessage,
  clearAllUploads,
  addToRecentUploads,
  removeFromRecentUploads,
  resetUploadState,
} from './uploadSlice';

// Export all slice reducers
export { default as authReducer } from './authSlice';
export { default as userReducer } from './userSlice';
export { default as productReducer } from './productSlice';
export { default as workoutReducer } from './workoutSlice';
export { default as mealReducer } from './mealSlice';
export { default as planReducer } from './planSlice';
export { default as cartReducer } from './cartSlice';
export { default as orderReducer } from './orderSlice';
export { default as adminReducer } from './adminSlice';
export { default as membershipReducer } from './membershipSlice';
export { default as fitnessProgramReducer } from './fitnessProgramSlice';
export { default as galleryImageReducer } from './galleryImageSlice';
export { default as notificationReducer } from './notificationSlice';
export { default as chatReducer } from './chatSlice';
export { default as uploadReducer } from './uploadSlice';

// Partner exports
export {
  getPartners,
  getPartnerById,
  getActivePartners,
  getPartnerWithGallery,
  createPartner,
  updatePartner,
  deletePartner,
  clearPartnerError,
  clearPartnerSuccess,
  clearCurrentPartner,
  resetPartnerState,
} from './partnerSlice';
export { default as partnerReducer } from './partnerSlice';