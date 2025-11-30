// services/socketService.js
import { io } from 'socket.io-client';
import { store } from '../store';
import { setSocket, handleNewMessage, handleMessageRead, handleConversationUpdate } from '../store/slices/chatSlice';
import { addNotification } from '../store/slices/notificationSlice';

class SocketService {
  constructor() {
    this.socket = null;
    this.eventListeners = new Map();
  }

  initializeSocket() {
    const token = localStorage.getItem('token');
    
    if (!token) {
      store.dispatch(addNotification({
        type: 'error',
        message: 'Authentication token not found',
        id: Date.now().toString()
      }));
      return;
    }

    try {
      this.socket = io(import.meta.env.VITE_APP_SOCKET_URL, {
        auth: { token },
        transports: ['websocket', 'polling']
      });

      this.setupEventListeners();
      store.dispatch(setSocket(this.socket));

    } catch (error) {
      console.error('Socket initialization error:', error);
      store.dispatch(addNotification({
        type: 'error',
        message: 'Failed to initialize socket connection',
        id: Date.now().toString()
      }));
    }
  }

  setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to socket server');
      store.dispatch(addNotification({
        type: 'success',
        message: 'Connected to chat server',
        id: Date.now().toString()
      }));
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected from socket server:', reason);
      if (reason === 'io server disconnect') {
        store.dispatch(addNotification({
          type: 'error',
          message: 'Disconnected from server',
          id: Date.now().toString()
        }));
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      store.dispatch(addNotification({
        type: 'error',
        message: 'Failed to connect to chat server',
        id: Date.now().toString()
      }));
    });

    this.socket.on('message.sent', (data) => {
      store.dispatch(handleNewMessage(data));
    });

    this.socket.on('message.read', (data) => {
      store.dispatch(handleMessageRead(data));
    });

    this.socket.on('conversation.updated', (data) => {
      store.dispatch(handleConversationUpdate(data));
    });

    this.socket.on('user.typing', (data) => {
      // Handle typing indicators if needed
      console.log('User typing:', data);
    });

    this.socket.on('user.stopTyping', (data) => {
      // Handle stop typing if needed
      console.log('User stopped typing:', data);
    });
  }

  // Add event listener
  on(event, callback) {
    if (!this.socket) {
      console.warn('Socket not initialized. Cannot add event listener for:', event);
      return;
    }
    
    this.socket.on(event, callback);
    
    // Store the listener for cleanup
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(callback);
  }

  // Remove event listener
  off(event, callback) {
    if (!this.socket) {
      console.warn('Socket not initialized. Cannot remove event listener for:', event);
      return;
    }
    
    if (callback) {
      this.socket.off(event, callback);
      
      // Remove from stored listeners
      const listeners = this.eventListeners.get(event);
      if (listeners) {
        const index = listeners.indexOf(callback);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    } else {
      // Remove all listeners for this event
      this.socket.off(event);
      this.eventListeners.delete(event);
    }
  }

  // Emit event to server
  emit(event, data) {
    if (!this.socket) {
      console.warn('Socket not initialized. Cannot emit event:', event);
      return false;
    }
    
    try {
      this.socket.emit(event, data);
      return true;
    } catch (error) {
      console.error('Error emitting socket event:', error);
      return false;
    }
  }

  // Check if socket is connected
  isConnected() {
    return this.socket && this.socket.connected;
  }

  // Get socket ID
  getId() {
    return this.socket ? this.socket.id : null;
  }

  disconnect() {
    if (this.socket) {
      // Remove all stored listeners
      this.eventListeners.clear();
      
      this.socket.disconnect();
      this.socket = null;
      store.dispatch(setSocket(null));
      
      console.log('Socket disconnected');
    }
  }

  // Reconnect socket
  reconnect() {
    this.disconnect();
    this.initializeSocket();
  }

  getSocket() {
    return this.socket;
  }
}

export const socketService = new SocketService();