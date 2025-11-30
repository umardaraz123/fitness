// components/ChatInterface.jsx
import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  loadConversations,
  selectConversation,
  sendMessage,
  createGroup,
  searchUsers,
  clearSearchResults,
  setSelectedConversation,
  clearErrors,
  markMessagesAsReadReducer,
  markConversationAsRead,
  handleNewMessage,
  handleMessageRead
} from '../../store/slices/chatSlice';
import { removeNotification } from '../../store/slices/notificationSlice';
import { socketService } from '../../services/socketService';
import ConversationList from './ConversationList';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import GroupCreator from './GroupCreator';
import UserSearch from './UserSearch';
import Notification from './Notification';
import './ChatInterface.css';

const ChatInterface = () => {
  const dispatch = useDispatch();
  const {
    conversations,
    selectedConversation,
    messages,
    searchedUsers,
    loading,
    error
  } = useSelector((state) => state.chat);
  
  const notifications = useSelector((state) => state.notifications.items);
  const messagesEndRef = useRef(null);
  const currentUserId = useSelector((state) => state.auth.user?.id);

  // State to control modal visibility
  const [activeModal, setActiveModal] = useState(null); // 'userSearch', 'groupCreator', or null

  useEffect(() => {
    // Initialize socket and load conversations
    socketService.initializeSocket();
    dispatch(loadConversations());

    // Socket event listeners for real-time updates
    const handleSocketMessage = (data) => {
      if (data.conversation && data.message) {
        dispatch(handleNewMessage({ message: data.message, conversation: data.conversation }));
      }
    };

    const handleSocketMessageRead = (data) => {
      dispatch(handleMessageRead(data));
    };

    // Add socket listeners
    socketService.on('newMessage', handleSocketMessage);
    socketService.on('messagesRead', handleSocketMessageRead);

    return () => {
      // Cleanup socket listeners
      socketService.off('newMessage', handleSocketMessage);
      socketService.off('messagesRead', handleSocketMessageRead);
      socketService.disconnect();
      dispatch(clearErrors());
    };
  }, [dispatch]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle message read functionality
  const handleMessageRead = useCallback(() => {
    if (selectedConversation && messages.length > 0) {
      const unreadMessages = messages.filter(
        message => !message.is_own && !message.is_read
      );

      if (unreadMessages.length > 0) {
        const messageIds = unreadMessages.map(msg => msg.id);
        
        // Mark messages as read in Redux store using reducer (immediate update)
        dispatch(markMessagesAsReadReducer(messageIds));
        
        // Mark conversation as read in Redux store
        dispatch(markConversationAsRead(selectedConversation.id));
        
        // Emit socket event for real-time read receipts
        const success = socketService.emit('messagesRead', {
          conversationId: selectedConversation.id,
          messageIds: messageIds
        });
        
        if (success) {
          console.log(`Marked ${unreadMessages.length} messages as read`);
        } else {
          console.warn('Failed to emit read receipt to server');
        }
      }
    }
  }, [selectedConversation, messages, dispatch]);

  const handleSelectConversation = (conversation) => {
    dispatch(selectConversation(conversation));
  };

  const handleSendMessage = (message, attachment, replyTo = null) => {
    if (!message.trim() && !attachment) return;
    
    dispatch(sendMessage({
      message: message.trim(),
      attachment,
      replyTo,
      conversation: selectedConversation
    }));
  };

  const handleCreateGroup = (groupData) => {
    dispatch(createGroup(groupData));
    closeAllModals(); // Close modal after creating group
  };

  const handleSearchUsers = (searchTerm) => {
    if (searchTerm.trim()) {
      dispatch(searchUsers(searchTerm));
    } else {
      dispatch(clearSearchResults());
    }
  };

  const handleSelectUser = (user) => {
    const privateConv = conversations.find(conv => 
      conv.type === 'private' && 
      conv.users.some(u => u.id === user.id)
    );
    
    if (privateConv) {
      dispatch(selectConversation(privateConv));
    } else {
      dispatch(setSelectedConversation({
        type: 'private',
        users: [user],
        isTemporary: true
      }));
    }
    closeAllModals(); // Close modal after selecting user
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCloseNotification = (id) => {
    dispatch(removeNotification(id));
  };

  const handleReconnectSocket = () => {
    socketService.reconnect();
  };

  // Modal control functions
  const openUserSearch = () => {
    setActiveModal('userSearch');
    dispatch(clearSearchResults());
  };

  const openGroupCreator = () => {
    setActiveModal('groupCreator');
    dispatch(clearSearchResults());
  };

  const closeAllModals = () => {
    setActiveModal(null);
    dispatch(clearSearchResults());
  };

  return (
    <div className="chat-interface">
      {/* Notifications */}
      <div className="notifications-container">
        {notifications.map(notification => (
          <Notification
            key={notification.id}
            notification={notification}
            onClose={() => handleCloseNotification(notification.id)}
          />
        ))}
        
        {/* Socket connection status */}
        {!socketService.isConnected() && (
          <div className="connection-status error">
            <span>Disconnected from chat server</span>
            <button onClick={handleReconnectSocket} className="reconnect-btn">
              Reconnect
            </button>
          </div>
        )}
      </div>

      <div className="chat-container">
        {/* Sidebar */}
        <div className="chat-sidebar">
          <div className="sidebar-header">
            <h2>Messages</h2>
            <div className="sidebar-actions">
              <button 
                className="btn-primary"
                onClick={openUserSearch}
              >
                New Chat
              </button>
              <button 
                className="btn-secondary"
                onClick={openGroupCreator}
              >
                New Group
              </button>
            </div>
          </div>
          
          <ConversationList
            conversations={conversations}
            selectedConversation={selectedConversation}
            onSelectConversation={handleSelectConversation}
            loading={loading.conversations}
            error={error.conversations}
          />
        </div>

        {/* Main Chat Area */}
        <div className="chat-main">
          {selectedConversation ? (
            <>
              <MessageList
                messages={messages}
                conversation={selectedConversation}
                loading={loading.messages}
                error={error.messages}
                onMessageRead={handleMessageRead}
                currentUserId={currentUserId}
              />
              <div ref={messagesEndRef} />
              <MessageInput 
                onSendMessage={handleSendMessage}
                loading={loading.sending}
                disabled={!selectedConversation || !socketService.isConnected()}
              />
            </>
          ) : (
            <div className="no-conversation">
              <h3>Select a conversation to start chatting</h3>
              <p>Choose a conversation from the sidebar or start a new chat</p>
            </div>
          )}
        </div>
      </div>

      {/* Modals - Conditionally rendered */}
      {activeModal === 'userSearch' && (
        <UserSearch
          onClose={closeAllModals}
          onSelectUser={handleSelectUser}
        />
      )}

      {activeModal === 'groupCreator' && (
        <GroupCreator
          onClose={closeAllModals}
          onCreateGroup={handleCreateGroup}
        />
      )}
    </div>
  );
};

export default ChatInterface;