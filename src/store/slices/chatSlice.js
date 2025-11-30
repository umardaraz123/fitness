// store/slices/chatSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { io } from 'socket.io-client';
import { chatAPI } from '../../api/api';

// Async Thunks
export const loadConversations = createAsyncThunk(
  'chat/loadConversations',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await chatAPI.getConversations(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to load conversations'
      );
    }
  }
);

export const getConversationById = createAsyncThunk(
  'chat/getConversationById',
  async (conversationId, { rejectWithValue }) => {
    try {
      const response = await chatAPI.getConversationById(conversationId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to load conversation'
      );
    }
  }
);

export const createConversation = createAsyncThunk(
  'chat/createConversation',
  async (conversationData, { rejectWithValue }) => {
    try {
      const response = await chatAPI.createConversation(conversationData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create conversation'
      );
    }
  }
);

export const updateConversation = createAsyncThunk(
  'chat/updateConversation',
  async ({ conversationId, updateData }, { rejectWithValue }) => {
    try {
      const response = await chatAPI.updateConversation(conversationId, updateData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update conversation'
      );
    }
  }
);

export const deleteConversation = createAsyncThunk(
  'chat/deleteConversation',
  async (conversationId, { rejectWithValue }) => {
    try {
      const response = await chatAPI.deleteConversation(conversationId);
      return { conversationId, data: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete conversation'
      );
    }
  }
);

export const selectConversation = createAsyncThunk(
  'chat/selectConversation',
  async (conversation, { rejectWithValue }) => {
    try {
      const response = await chatAPI.getConversationMessages(conversation.id);
      return {
        conversation,
        messages: response.data.messages?.data || []
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to load messages'
      );
    }
  }
);

export const getConversationMessages = createAsyncThunk(
  'chat/getConversationMessages',
  async ({ conversationId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await chatAPI.getConversationMessages(conversationId, params);
      return {
        conversationId,
        messages: response.data.messages?.data || [],
        pagination: response.data.messages?.pagination
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to load messages'
      );
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ message, attachment = null, replyTo = null, conversation }, { rejectWithValue }) => {
    try {
      let response;
      
      if (attachment) {
        const formData = new FormData();
        if (conversation?.id) {
          formData.append('conversation_id', conversation.id);
        }
        formData.append('message', message);
        formData.append('type', 'file');
        formData.append('attachment', attachment);
        if (replyTo) {
          formData.append('reply_to', replyTo);
        }
        response = await chatAPI.sendMessageWithAttachment(formData);
      } else {
        const messageData = {
          conversation_id: conversation?.id,
          message,
          type: 'text',
          reply_to: replyTo
        };
        response = await chatAPI.sendMessage(messageData);
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to send message'
      );
    }
  }
);

export const getMessageById = createAsyncThunk(
  'chat/getMessageById',
  async (messageId, { rejectWithValue }) => {
    try {
      const response = await chatAPI.getMessageById(messageId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to load message'
      );
    }
  }
);

// Renamed to avoid conflict with reducer action
export const updateMessageAsync = createAsyncThunk(
  'chat/updateMessageAsync',
  async ({ messageId, updateData }, { rejectWithValue }) => {
    try {
      const response = await chatAPI.updateMessage(messageId, updateData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update message'
      );
    }
  }
);

export const deleteMessage = createAsyncThunk(
  'chat/deleteMessage',
  async (messageId, { rejectWithValue }) => {
    try {
      const response = await chatAPI.deleteMessage(messageId);
      return { messageId, data: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete message'
      );
    }
  }
);

export const markAsRead = createAsyncThunk(
  'chat/markAsRead',
  async (conversationId, { rejectWithValue }) => {
    try {
      const response = await chatAPI.markAsRead(conversationId);
      return { conversationId, data: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to mark as read'
      );
    }
  }
);

export const markAsDelivered = createAsyncThunk(
  'chat/markAsDelivered',
  async (conversationId, { rejectWithValue }) => {
    try {
      const response = await chatAPI.markAsDelivered(conversationId);
      return { conversationId, data: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to mark as delivered'
      );
    }
  }
);

// NEW: Async thunk for marking messages as read
export const markMessagesAsRead = createAsyncThunk(
  'chat/markMessagesAsRead',
  async ({ conversationId, messageIds }, { rejectWithValue }) => {
    try {
      const response = await chatAPI.markMessagesAsRead(conversationId, messageIds);
      return { conversationId, messageIds, data: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to mark messages as read'
      );
    }
  }
);

export const createGroup = createAsyncThunk(
  'chat/createGroup',
  async (groupData, { rejectWithValue }) => {
    try {
      const response = await chatAPI.createGroup(groupData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create group'
      );
    }
  }
);

export const updateGroup = createAsyncThunk(
  'chat/updateGroup',
  async ({ groupId, groupData }, { rejectWithValue }) => {
    try {
      const response = await chatAPI.updateGroup(groupId, groupData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update group'
      );
    }
  }
);

export const getGroupById = createAsyncThunk(
  'chat/getGroupById',
  async (groupId, { rejectWithValue }) => {
    try {
      const response = await chatAPI.getGroupById(groupId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to load group'
      );
    }
  }
);

export const deleteGroup = createAsyncThunk(
  'chat/deleteGroup',
  async (groupId, { rejectWithValue }) => {
    try {
      const response = await chatAPI.deleteGroup(groupId);
      return { groupId, data: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete group'
      );
    }
  }
);

export const addGroupMember = createAsyncThunk(
  'chat/addGroupMember',
  async ({ groupId, userId }, { rejectWithValue }) => {
    try {
      const response = await chatAPI.addGroupMember(groupId, userId);
      return { groupId, userId, data: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add group member'
      );
    }
  }
);

export const removeGroupMember = createAsyncThunk(
  'chat/removeGroupMember',
  async ({ groupId, userId }, { rejectWithValue }) => {
    try {
      const response = await chatAPI.removeGroupMember(groupId, userId);
      return { groupId, userId, data: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to remove group member'
      );
    }
  }
);

export const updateGroupMember = createAsyncThunk(
  'chat/updateGroupMember',
  async ({ groupId, userId, role }, { rejectWithValue }) => {
    try {
      const response = await chatAPI.updateGroupMember(groupId, userId, role);
      return { groupId, userId, role, data: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update group member'
      );
    }
  }
);

export const getGroupMembers = createAsyncThunk(
  'chat/getGroupMembers',
  async (groupId, { rejectWithValue }) => {
    try {
      const response = await chatAPI.getGroupMembers(groupId);
      return { groupId, members: response.data.members || [] };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to load group members'
      );
    }
  }
);

export const leaveGroup = createAsyncThunk(
  'chat/leaveGroup',
  async (groupId, { rejectWithValue }) => {
    try {
      const response = await chatAPI.leaveGroup(groupId);
      return { groupId, data: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to leave group'
      );
    }
  }
);

export const searchUsers = createAsyncThunk(
  'chat/searchUsers',
  async ({ searchTerm, params = {} }, { rejectWithValue }) => {
    try {
      const response = await chatAPI.searchUsers(searchTerm, params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to search users'
      );
    }
  }
);

export const searchMessages = createAsyncThunk(
  'chat/searchMessages',
  async ({ conversationId, searchTerm, params = {} }, { rejectWithValue }) => {
    try {
      const response = await chatAPI.searchMessages(conversationId, searchTerm, params);
      return { conversationId, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to search messages'
      );
    }
  }
);

export const searchGlobal = createAsyncThunk(
  'chat/searchGlobal',
  async ({ searchTerm, params = {} }, { rejectWithValue }) => {
    try {
      const response = await chatAPI.searchGlobal(searchTerm, params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to search'
      );
    }
  }
);

export const addReaction = createAsyncThunk(
  'chat/addReaction',
  async ({ messageId, reaction }, { rejectWithValue }) => {
    try {
      const response = await chatAPI.addReaction(messageId, reaction);
      return { messageId, reaction, data: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add reaction'
      );
    }
  }
);

export const removeReaction = createAsyncThunk(
  'chat/removeReaction',
  async ({ messageId, reactionId }, { rejectWithValue }) => {
    try {
      const response = await chatAPI.removeReaction(messageId, reactionId);
      return { messageId, reactionId, data: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to remove reaction'
      );
    }
  }
);

export const startTyping = createAsyncThunk(
  'chat/startTyping',
  async (conversationId, { rejectWithValue }) => {
    try {
      const response = await chatAPI.startTyping(conversationId);
      return { conversationId, data: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to start typing'
      );
    }
  }
);

export const stopTyping = createAsyncThunk(
  'chat/stopTyping',
  async (conversationId, { rejectWithValue }) => {
    try {
      const response = await chatAPI.stopTyping(conversationId);
      return { conversationId, data: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to stop typing'
      );
    }
  }
);

export const updatePresence = createAsyncThunk(
  'chat/updatePresence',
  async (status, { rejectWithValue }) => {
    try {
      const response = await chatAPI.updatePresence(status);
      return { status, data: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update presence'
      );
    }
  }
);

export const getOnlineUsers = createAsyncThunk(
  'chat/getOnlineUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await chatAPI.getOnlineUsers();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get online users'
      );
    }
  }
);

export const uploadAttachment = createAsyncThunk(
  'chat/uploadAttachment',
  async (file, { rejectWithValue }) => {
    try {
      const response = await chatAPI.uploadAttachment(file);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to upload attachment'
      );
    }
  }
);

export const forwardMessage = createAsyncThunk(
  'chat/forwardMessage',
  async ({ messageId, conversationIds }, { rejectWithValue }) => {
    try {
      const response = await chatAPI.forwardMessage(messageId, conversationIds);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to forward message'
      );
    }
  }
);

export const getMessageThread = createAsyncThunk(
  'chat/getMessageThread',
  async (messageId, { rejectWithValue }) => {
    try {
      const response = await chatAPI.getMessageThread(messageId);
      return { messageId, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to load message thread'
      );
    }
  }
);

export const pinMessage = createAsyncThunk(
  'chat/pinMessage',
  async ({ conversationId, messageId }, { rejectWithValue }) => {
    try {
      const response = await chatAPI.pinMessage(conversationId, messageId);
      return { conversationId, messageId, data: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to pin message'
      );
    }
  }
);

export const unpinMessage = createAsyncThunk(
  'chat/unpinMessage',
  async ({ conversationId, messageId }, { rejectWithValue }) => {
    try {
      const response = await chatAPI.unpinMessage(conversationId, messageId);
      return { conversationId, messageId, data: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to unpin message'
      );
    }
  }
);

export const getPinnedMessages = createAsyncThunk(
  'chat/getPinnedMessages',
  async (conversationId, { rejectWithValue }) => {
    try {
      const response = await chatAPI.getPinnedMessages(conversationId);
      return { conversationId, pinnedMessages: response.data.pinned_messages || [] };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to load pinned messages'
      );
    }
  }
);

export const getArchivedConversations = createAsyncThunk(
  'chat/getArchivedConversations',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await chatAPI.getArchivedConversations(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to load archived conversations'
      );
    }
  }
);

export const archiveConversation = createAsyncThunk(
  'chat/archiveConversation',
  async (conversationId, { rejectWithValue }) => {
    try {
      const response = await chatAPI.archiveConversation(conversationId);
      return { conversationId, data: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to archive conversation'
      );
    }
  }
);

export const unarchiveConversation = createAsyncThunk(
  'chat/unarchiveConversation',
  async (conversationId, { rejectWithValue }) => {
    try {
      const response = await chatAPI.unarchiveConversation(conversationId);
      return { conversationId, data: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to unarchive conversation'
      );
    }
  }
);

export const blockUser = createAsyncThunk(
  'chat/blockUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await chatAPI.blockUser(userId);
      return { userId, data: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to block user'
      );
    }
  }
);

export const unblockUser = createAsyncThunk(
  'chat/unblockUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await chatAPI.unblockUser(userId);
      return { userId, data: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to unblock user'
      );
    }
  }
);

export const getBlockedUsers = createAsyncThunk(
  'chat/getBlockedUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await chatAPI.getBlockedUsers();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to load blocked users'
      );
    }
  }
);

export const getChatSettings = createAsyncThunk(
  'chat/getChatSettings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await chatAPI.getChatSettings();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to load chat settings'
      );
    }
  }
);

export const updateChatSettings = createAsyncThunk(
  'chat/updateChatSettings',
  async (settings, { rejectWithValue }) => {
    try {
      const response = await chatAPI.updateChatSettings(settings);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update chat settings'
      );
    }
  }
);

export const getChatStatistics = createAsyncThunk(
  'chat/getChatStatistics',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await chatAPI.getChatStatistics(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to load chat statistics'
      );
    }
  }
);

export const clearConversationHistory = createAsyncThunk(
  'chat/clearConversationHistory',
  async (conversationId, { rejectWithValue }) => {
    try {
      const response = await chatAPI.clearConversationHistory(conversationId);
      return { conversationId, data: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to clear conversation history'
      );
    }
  }
);

// Initial State
const initialState = {
  conversations: [],
  archivedConversations: [],
  selectedConversation: null,
  messages: [],
  searchedUsers: [],
  searchResults: {
    users: [],
    messages: [],
    global: []
  },
  groupMembers: {},
  pinnedMessages: {},
  blockedUsers: [],
  onlineUsers: [],
  chatSettings: null,
  chatStatistics: null,
  socket: null,
  typingUsers: {},
  loading: {
    conversations: false,
    archivedConversations: false,
    messages: false,
    sending: false,
    creatingGroup: false,
    searching: false,
    deletingMessage: false,
    updatingGroup: false,
    leavingGroup: false,
    markingRead: false,
    uploading: false,
    reactions: false,
    presence: false,
    settings: false,
    statistics: false
  },
  error: {
    conversations: null,
    archivedConversations: null,
    messages: null,
    sending: null,
    creatingGroup: null,
    searching: null,
    deletingMessage: null,
    updatingGroup: null,
    leavingGroup: null,
    markingRead: null,
    uploading: null,
    reactions: null,
    presence: null,
    settings: null,
    statistics: null
  },
  success: {
    messageSent: false,
    groupCreated: false,
    messageDeleted: false,
    groupUpdated: false,
    leftGroup: false,
    conversationArchived: false,
    userBlocked: false,
    settingsUpdated: false
  }
};

// Slice
const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    clearErrors: (state) => {
      state.error = initialState.error;
    },
    clearSuccess: (state) => {
      state.success = initialState.success;
    },
    clearSearchResults: (state) => {
      state.searchedUsers = [];
      state.searchResults = initialState.searchResults;
    },
    setSelectedConversation: (state, action) => {
      state.selectedConversation = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.unshift(action.payload);
    },
    // Keep this as updateMessage (reducer action)
    updateMessage: (state, action) => {
      const { messageId, updates } = action.payload;
      const messageIndex = state.messages.findIndex(msg => msg.id === messageId);
      if (messageIndex !== -1) {
        state.messages[messageIndex] = { ...state.messages[messageIndex], ...updates };
      }
    },
    removeMessage: (state, action) => {
      state.messages = state.messages.filter(msg => msg.id !== action.payload);
    },
    
    // NEW: Mark conversation as read (reducer action)
    markConversationAsRead: (state, action) => {
      const conversationId = action.payload;
      
      // Update conversation in list
      state.conversations = state.conversations.map(conv => 
        conv.id === conversationId 
          ? { ...conv, unread_count: 0 }
          : conv
      );
      
      // Update selected conversation if it's the same
      if (state.selectedConversation && state.selectedConversation.id === conversationId) {
        state.selectedConversation = { ...state.selectedConversation, unread_count: 0 };
      }
    },
    
    // NEW: Mark specific messages as read (reducer action)
    markMessagesAsReadReducer: (state, action) => {
      const messageIds = action.payload;
      
      state.messages = state.messages.map(message => 
        messageIds.includes(message.id) 
          ? { ...message, is_read: true, read_at: new Date().toISOString() }
          : message
      );
    },
    
    handleNewMessage: (state, action) => {
      const { message, conversation } = action.payload;
      
      // Add message to current conversation if selected
      if (state.selectedConversation && conversation.id === state.selectedConversation.id) {
        state.messages.unshift(message);
      }
      
      // Update conversation in list
      const existingConvIndex = state.conversations.findIndex(conv => conv.id === conversation.id);
      if (existingConvIndex !== -1) {
        state.conversations[existingConvIndex] = conversation;
      } else {
        state.conversations.unshift(conversation);
      }
    },
    handleMessageRead: (state, action) => {
      const { conversation_id } = action.payload;
      
      state.conversations = state.conversations.map(conv => 
        conv.id === conversation_id 
          ? { ...conv, unread_count: 0 }
          : conv
      );
      
      if (state.selectedConversation && conversation_id === state.selectedConversation.id) {
        state.selectedConversation = { ...state.selectedConversation, unread_count: 0 };
      }
    },
    handleConversationUpdate: (state, action) => {
      const { conversation } = action.payload;
      
      const existingIndex = state.conversations.findIndex(conv => conv.id === conversation.id);
      
      if (existingIndex !== -1) {
        state.conversations[existingIndex] = conversation;
      } else {
        state.conversations.unshift(conversation);
      }
      
      if (state.selectedConversation && conversation.id === state.selectedConversation.id) {
        state.selectedConversation = conversation;
      }
    },
    handleTypingStart: (state, action) => {
      const { conversationId, userId } = action.payload;
      if (!state.typingUsers[conversationId]) {
        state.typingUsers[conversationId] = [];
      }
      if (!state.typingUsers[conversationId].includes(userId)) {
        state.typingUsers[conversationId].push(userId);
      }
    },
    handleTypingStop: (state, action) => {
      const { conversationId, userId } = action.payload;
      if (state.typingUsers[conversationId]) {
        state.typingUsers[conversationId] = state.typingUsers[conversationId].filter(id => id !== userId);
      }
    },
    handleUserOnline: (state, action) => {
      const { userId } = action.payload;
      if (!state.onlineUsers.includes(userId)) {
        state.onlineUsers.push(userId);
      }
    },
    handleUserOffline: (state, action) => {
      const { userId } = action.payload;
      state.onlineUsers = state.onlineUsers.filter(id => id !== userId);
    },
    resetChatState: () => initialState
  },
  extraReducers: (builder) => {
    builder
      // Load Conversations
      .addCase(loadConversations.pending, (state) => {
        state.loading.conversations = true;
        state.error.conversations = null;
      })
      .addCase(loadConversations.fulfilled, (state, action) => {
        state.loading.conversations = false;
        state.conversations = action.payload?.conversations?.data || [];
        state.error.conversations = null;
      })
      .addCase(loadConversations.rejected, (state, action) => {
        state.loading.conversations = false;
        state.error.conversations = action.payload;
        state.conversations = [];
      })
      
      // Select Conversation
      .addCase(selectConversation.pending, (state) => {
        state.loading.messages = true;
        state.error.messages = null;
      })
      .addCase(selectConversation.fulfilled, (state, action) => {
        state.loading.messages = false;
        state.selectedConversation = action.payload.conversation;
        state.messages = action.payload.messages;
        state.error.messages = null;
      })
      .addCase(selectConversation.rejected, (state, action) => {
        state.loading.messages = false;
        state.error.messages = action.payload;
        state.selectedConversation = null;
        state.messages = [];
      })
      
      // Send Message
      .addCase(sendMessage.pending, (state) => {
        state.loading.sending = true;
        state.error.sending = null;
        state.success.messageSent = false;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading.sending = false;
        state.error.sending = null;
        state.success.messageSent = true;
        
        // Update conversation last message
        if (state.selectedConversation && action.payload.message) {
          const updatedConversation = {
            ...state.selectedConversation,
            last_message: action.payload.message,
            last_message_at: new Date().toISOString()
          };
          
          state.selectedConversation = updatedConversation;
          
          // Update in conversations list
          state.conversations = state.conversations.map(conv =>
            conv.id === updatedConversation.id ? updatedConversation : conv
          );
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading.sending = false;
        state.error.sending = action.payload;
        state.success.messageSent = false;
      })
      
      // Update Message Async (the async thunk)
      .addCase(updateMessageAsync.fulfilled, (state, action) => {
        const updatedMessage = action.payload.message;
        if (updatedMessage) {
          const messageIndex = state.messages.findIndex(msg => msg.id === updatedMessage.id);
          if (messageIndex !== -1) {
            state.messages[messageIndex] = updatedMessage;
          }
        }
      })
      
      // Mark as Read
      .addCase(markAsRead.pending, (state) => {
        state.loading.markingRead = true;
        state.error.markingRead = null;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        state.loading.markingRead = false;
        const conversationId = action.payload.conversationId;
        
        state.conversations = state.conversations.map(conv => 
          conv.id === conversationId 
            ? { ...conv, unread_count: 0 }
            : conv
        );
        
        if (state.selectedConversation && conversationId === state.selectedConversation.id) {
          state.selectedConversation = { ...state.selectedConversation, unread_count: 0 };
        }
        
        state.error.markingRead = null;
      })
      .addCase(markAsRead.rejected, (state, action) => {
        state.loading.markingRead = false;
        state.error.markingRead = action.payload;
      })
      
      // Mark Messages as Read
      .addCase(markMessagesAsRead.pending, (state) => {
        state.loading.markingRead = true;
        state.error.markingRead = null;
      })
      .addCase(markMessagesAsRead.fulfilled, (state, action) => {
        state.loading.markingRead = false;
        const { conversationId, messageIds } = action.payload;
        
        // Update messages read status
        state.messages = state.messages.map(message =>
          messageIds.includes(message.id)
            ? { ...message, is_read: true, read_at: new Date().toISOString() }
            : message
        );
        
        // Update conversation unread count
        state.conversations = state.conversations.map(conv => 
          conv.id === conversationId 
            ? { ...conv, unread_count: Math.max(0, conv.unread_count - messageIds.length) }
            : conv
        );
        
        if (state.selectedConversation && state.selectedConversation.id === conversationId) {
          state.selectedConversation = { 
            ...state.selectedConversation, 
            unread_count: Math.max(0, state.selectedConversation.unread_count - messageIds.length)
          };
        }
        
        state.error.markingRead = null;
      })
      .addCase(markMessagesAsRead.rejected, (state, action) => {
        state.loading.markingRead = false;
        state.error.markingRead = action.payload;
      })
      
      // Create Group
      .addCase(createGroup.pending, (state) => {
        state.loading.creatingGroup = true;
        state.error.creatingGroup = null;
        state.success.groupCreated = false;
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        state.loading.creatingGroup = false;
        state.error.creatingGroup = null;
        state.success.groupCreated = true;
        
        const newConversation = action.payload.conversation;
        if (newConversation) {
          state.conversations.unshift(newConversation);
          state.selectedConversation = newConversation;
          state.messages = [];
        }
      })
      .addCase(createGroup.rejected, (state, action) => {
        state.loading.creatingGroup = false;
        state.error.creatingGroup = action.payload;
        state.success.groupCreated = false;
      })
      
      // Search Users
      .addCase(searchUsers.pending, (state) => {
        state.loading.searching = true;
        state.error.searching = null;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.loading.searching = false;
        state.searchedUsers = action.payload.users || [];
        state.searchResults.users = action.payload.users || [];
        state.error.searching = null;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.loading.searching = false;
        state.error.searching = action.payload;
        state.searchedUsers = [];
        state.searchResults.users = [];
      })
      
      // Delete Message
      .addCase(deleteMessage.pending, (state) => {
        state.loading.deletingMessage = true;
        state.error.deletingMessage = null;
        state.success.messageDeleted = false;
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.loading.deletingMessage = false;
        state.error.deletingMessage = null;
        state.success.messageDeleted = true;
        
        const deletedMessageId = action.payload.messageId;
        state.messages = state.messages.filter(msg => msg.id !== deletedMessageId);
      })
      .addCase(deleteMessage.rejected, (state, action) => {
        state.loading.deletingMessage = false;
        state.error.deletingMessage = action.payload;
        state.success.messageDeleted = false;
      })
      
      // Leave Group
      .addCase(leaveGroup.pending, (state) => {
        state.loading.leavingGroup = true;
        state.error.leavingGroup = null;
        state.success.leftGroup = false;
      })
      .addCase(leaveGroup.fulfilled, (state, action) => {
        state.loading.leavingGroup = false;
        state.error.leavingGroup = null;
        state.success.leftGroup = true;
        
        const leftGroupId = action.payload.groupId;
        state.conversations = state.conversations.filter(conv => conv.id !== leftGroupId);
        
        if (state.selectedConversation && state.selectedConversation.id === leftGroupId) {
          state.selectedConversation = null;
          state.messages = [];
        }
      })
      .addCase(leaveGroup.rejected, (state, action) => {
        state.loading.leavingGroup = false;
        state.error.leavingGroup = action.payload;
        state.success.leftGroup = false;
      })
      
      // Get Online Users
      .addCase(getOnlineUsers.fulfilled, (state, action) => {
        state.onlineUsers = action.payload.online_users || [];
      })
      
      // Get Blocked Users
      .addCase(getBlockedUsers.fulfilled, (state, action) => {
        state.blockedUsers = action.payload.blocked_users || [];
      })
      
      // Block User
      .addCase(blockUser.fulfilled, (state, action) => {
        state.success.userBlocked = true;
        const blockedUserId = action.payload.userId;
        if (!state.blockedUsers.includes(blockedUserId)) {
          state.blockedUsers.push(blockedUserId);
        }
      })
      
      // Unblock User
      .addCase(unblockUser.fulfilled, (state, action) => {
        const unblockedUserId = action.payload.userId;
        state.blockedUsers = state.blockedUsers.filter(id => id !== unblockedUserId);
      })
      
      // Get Chat Settings
      .addCase(getChatSettings.fulfilled, (state, action) => {
        state.chatSettings = action.payload.settings;
      })
      
      // Update Chat Settings
      .addCase(updateChatSettings.fulfilled, (state, action) => {
        state.success.settingsUpdated = true;
        state.chatSettings = action.payload.settings;
      })
      
      // Get Pinned Messages
      .addCase(getPinnedMessages.fulfilled, (state, action) => {
        state.pinnedMessages[action.payload.conversationId] = action.payload.pinnedMessages;
      })
      
      // Get Archived Conversations
      .addCase(getArchivedConversations.fulfilled, (state, action) => {
        state.archivedConversations = action.payload?.conversations?.data || [];
      })
      
      // Archive Conversation
      .addCase(archiveConversation.fulfilled, (state, action) => {
        state.success.conversationArchived = true;
        const archivedId = action.payload.conversationId;
        state.conversations = state.conversations.filter(conv => conv.id !== archivedId);
        if (state.selectedConversation && state.selectedConversation.id === archivedId) {
          state.selectedConversation = null;
          state.messages = [];
        }
      });
  }
});

export const {
  setSocket,
  clearErrors,
  clearSuccess,
  clearSearchResults,
  setSelectedConversation,
  addMessage,
  updateMessage, // This is the reducer action
  removeMessage,
  markConversationAsRead, // ✅ NEW: Added this export
  markMessagesAsReadReducer, // ✅ NEW: Added this export
  handleNewMessage,
  handleMessageRead,
  handleConversationUpdate,
  handleTypingStart,
  handleTypingStop,
  handleUserOnline,
  handleUserOffline,
  resetChatState
} = chatSlice.actions;

export default chatSlice.reducer;