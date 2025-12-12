// src/store/socketSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { io } from 'socket.io-client';

// Create a slice for the socket connection
const socketSlice = createSlice({
  name: 'socket',
  initialState: {
    socket: null,  // Store the socket instance
    connected: false, // Track connection status
  },
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload;
      state.connected = true;
    },
    disconnectSocket: (state) => {
      if (state.socket) {
        state.socket.disconnect();
      }
      state.connected = false;
    },
  },
});

// Export actions
export const { setSocket, disconnectSocket } = socketSlice.actions;

// Export reducer
export default socketSlice.reducer;
