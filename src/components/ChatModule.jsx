import React, { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { chatAPI } from '../api/api';
import UserSearch from './chat/UserSearch';

const ChatModule = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [messageText, setMessageText] = useState('');
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [typingUsers, setTypingUsers] = useState({});
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [showUserSearch, setShowUserSearch] = useState(false);
  const messagesEndRef = useRef(null);
  const [tempMessages, setTempMessages] = useState([]); // Add this for optimistic updates

  // Mock chat data as fallback
  const mockChats = [
    {
      id: 1,
      name: 'Kilian James',
      lastMessage: 'I have uploaded...',
      time: '4:30 PM',
      avatar: '/src/assets/images/user1.jpg',
      isOnline: false,
      unread: 0
    },
    {
      id: 2,
      name: 'Design Team',
      lastMessage: 'Let\'s review today 😎',
      time: '6:30 AM',
      avatar: '/src/assets/images/user2.jpg',
      isOnline: false,
      unread: 0
    },
  ];

  useEffect(() => {
    loadCurrentUser();
    initializeSocket();
    loadConversations();
    loadOnlineUsers();
  }, []);

  useEffect(() => {
    if (socket) {
      setupSocketListeners();
    }
  }, [socket, selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, tempMessages]); // Include tempMessages in dependency

  const loadCurrentUser = async () => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        setCurrentUser(JSON.parse(userData));
      } else {
        const response = await chatAPI.getCurrentUser?.();
        if (response?.success) {
          setCurrentUser(response.data);
          localStorage.setItem('user', JSON.stringify(response.data));
        }
      }
    } catch (error) {
      console.error('Failed to load current user:', error);
    }
  };

  const setupSocketListeners = () => {
    if (!socket) return;

    socket.on('user.typing', (data) => {
      if (selectedChat && data.conversation_id === selectedChat.id) {
        setTypingUsers(prev => ({
          ...prev,
          [data.user_id]: true
        }));
      }
    });

    socket.on('user.stopTyping', (data) => {
      if (selectedChat && data.conversation_id === selectedChat.id) {
        setTypingUsers(prev => {
          const newTyping = { ...prev };
          delete newTyping[data.user_id];
          return newTyping;
        });
      }
    });

    socket.on('user.online', (data) => {
      setOnlineUsers(prev => [...prev, data.user_id]);
      updateConversationOnlineStatus(data.user_id, true);
    });

    socket.on('user.offline', (data) => {
      setOnlineUsers(prev => prev.filter(id => id !== data.user_id));
      updateConversationOnlineStatus(data.user_id, false);
    });

    socket.on('message.sent', (data) => {
      console.log('Socket: message.sent received:', data);
      if (selectedChat && data.conversation && data.conversation.id === selectedChat.id) {
        // Remove any temp message with the same tempId (if exists)
        if (data.message.tempId) {
          setTempMessages(prev => prev.filter(msg => msg.tempId !== data.message.tempId));
        }
        
        // Add the confirmed message from server
        setMessages(prev => [...prev, data.message]);
        updateConversationLastMessage(data.conversation.id, data.message);
      } else if (data.conversation) {
        updateConversationUnreadCount(data.conversation.id);
      }
    });

    socket.on('message.read', (data) => {
      if (selectedChat && data.conversation_id === selectedChat.id) {
        markMessagesAsRead(data.message_ids);
      }
    });

    socket.on('conversation.updated', (data) => {
      updateConversationInList(data.conversation);
    });
  };

  const initializeSocket = () => {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found for socket connection');
      return;
    }

    const newSocket = io(import.meta.env.VITE_APP_SOCKET_URL || 'http://localhost:8000', {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      console.log('Socket connected successfully');
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    setSocket(newSocket);
  };

  const loadConversations = async () => {
    try {
      setLoading(true);
      const response = await chatAPI.getConversations();
      
      if (response.success) {
        const conversationsData = response.conversations?.data || response.data || [];
        
        const enrichedConversations = conversationsData.map(conversation => {
          if (conversation.is_private && conversation.participants) {
            const otherUser = conversation.participants.find(p => p.id !== currentUser?.id);
            if (otherUser) {
              return {
                ...conversation,
                user_id: otherUser.id,
                name: otherUser.name || otherUser.email,
                avatar: otherUser.avatar,
                isOnline: onlineUsers.includes(otherUser.id)
              };
            }
          }
          return conversation;
        });
        
        setConversations(enrichedConversations);
      } else {
        setConversations(mockChats);
      }
    } catch (error) {
      console.error('Failed to load conversations, using mock data:', error);
      setConversations(mockChats);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      const response = await chatAPI.getConversationMessages(conversationId);
      if (response.success) {
        const messagesData = response.messages?.data || response.data || [];
        const processedMessages = messagesData.map(message => ({
          ...message,
          isSent: message.user_id === currentUser?.id
        }));
        setMessages(processedMessages);
        
        // Mark messages as read when loading
        await chatAPI.markAsRead(conversationId);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
      setMessages(getMockMessages());
    }
  };

  const loadOnlineUsers = async () => {
    try {
      const response = await chatAPI.getOnlineUsers();
      if (response.success) {
        const onlineUserIds = response.data || [];
        setOnlineUsers(onlineUserIds);
        
        setConversations(prev => prev.map(conv => ({
          ...conv,
          isOnline: conv.user_id ? onlineUserIds.includes(conv.user_id) : false
        })));
      }
    } catch (error) {
      console.error('Failed to load online users:', error);
    }
  };

  const getMockMessages = () => [
    {
      id: 1,
      message: 'Hello my dear sir I have so delicious design request document for our next projects.',
      created_at: '2024-01-19T10:28:00Z',
      user: { id: 1, name: 'Kilian James', avatar: '/src/assets/images/user1.jpg' },
      user_id: 1,
      isSent: false,
      type: 'text'
    },
    {
      id: 2,
      message: 'Design_project_2025.docx',
      attachment_url: '#',
      created_at: '2024-01-19T10:29:00Z',
      user: { id: 1, name: 'Kilian James', avatar: '/src/assets/images/user1.jpg' },
      user_id: 1,
      isSent: false,
      type: 'file'
    }
  ];

  const handleChatSelect = async (chat) => {
    setSelectedChat(chat);
    setReplyingTo(null);
    setTempMessages([]); // Clear temp messages when switching chats
    await loadMessages(chat.id);
    
    updateConversationUnreadCount(chat.id, true);
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedChat) return;

    // Create a temporary message ID for optimistic update
    const tempId = `temp_${Date.now()}`;
    const tempMessage = {
      tempId,
      message: messageText.trim(),
      created_at: new Date().toISOString(),
      user: { 
        id: currentUser?.id, 
        name: currentUser?.name || 'You', 
        avatar: currentUser?.avatar || '' 
      },
      user_id: currentUser?.id,
      isSent: true,
      type: 'text',
      isTemp: true
    };

    // If replying, add reply data to temp message
    if (replyingTo && replyingTo.id) {
      tempMessage.reply_to = replyingTo.id;
      tempMessage.parent_message = {
        id: replyingTo.id,
        message: replyingTo.message,
        user: replyingTo.user
      };
    }

    // Add temporary message immediately (optimistic update)
    setTempMessages(prev => [...prev, tempMessage]);
    const tempMessageText = messageText;
    setMessageText('');
    setReplyingTo(null);

    try {
      let messageData;
      let response;

      // Prepare message data based on chat type
      if (selectedChat.user_id) {
        // For new private chats (user_id only, no conversation_id)
        messageData = {
          user_id: selectedChat.user_id,
          message: tempMessageText.trim(),
          type: 'text'
        };
        
        console.log('Sending message to user:', messageData);
        response = await chatAPI.sendMessage(messageData);
      } else {
        // For existing conversations
        messageData = {
          conversation_id: selectedChat.id,
          message: tempMessageText.trim(),
          type: 'text'
        };

        if (replyingTo && replyingTo.id) {
          messageData.reply_to = replyingTo.id;
        }
        console.log('Sending message to conversation:', messageData);

        response = await chatAPI.sendMessage(messageData);
      }

      if (response.success) {
        const newMessage = response.message || response.data;
        
        // If this was a new conversation (no conversation_id before), update the selected chat
        if (response.conversation && !selectedChat.id) {
          const updatedConversation = {
            ...selectedChat,
            id: response.conversation.id,
            ...response.conversation
          };
          setSelectedChat(updatedConversation);
          
          // Update in conversations list
          setConversations(prev => {
            const existingIndex = prev.findIndex(c => 
              (c.id && c.id === updatedConversation.id) || 
              (c.user_id && c.user_id === updatedConversation.user_id)
            );
            
            if (existingIndex !== -1) {
              const updated = [...prev];
              updated[existingIndex] = updatedConversation;
              return updated;
            } else {
              return [updatedConversation, ...prev];
            }
          });
          
          // Load messages for the new conversation
          await loadMessages(response.conversation.id);
        } else {
          // Add the confirmed message from server
          const confirmedMessage = {
            ...newMessage,
            isSent: true
          };
          
          setMessages(prev => [...prev, confirmedMessage]);
          
          // Update conversation last message
          if (response.conversation) {
            updateConversationLastMessage(response.conversation.id, confirmedMessage);
          }
        }
        
        // Remove the temporary message
        setTempMessages(prev => prev.filter(msg => msg.tempId !== tempId));
        
        // Stop typing indicator
        if (socket && selectedChat) {
          socket.emit('stopTyping', { conversation_id: selectedChat.id || response.conversation?.id });
        }
        
      } else {
        console.error('Failed to send message:', response.message);
        // Remove the failed temporary message
        setTempMessages(prev => prev.filter(msg => msg.tempId !== tempId));
        alert('Failed to send message: ' + (response.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      // Remove the failed temporary message
      setTempMessages(prev => prev.filter(msg => msg.tempId !== tempId));
      alert('Failed to send message. Please try again.');
    }
  };

  const handleTyping = useCallback(
    debounce(() => {
      if (socket && selectedChat) {
        socket.emit('typing', { conversation_id: selectedChat.id });
      }
    }, 300),
    [socket, selectedChat]
  );

  const handleReplyToMessage = (message) => {
    if (selectedChat?.id) {
      setReplyingTo(message);
      setTimeout(() => {
        const input = document.querySelector('.message-input');
        if (input) {
          input.focus();
        }
      }, 100);
    } else {
      alert('Replies are only supported in existing conversations. Please start a conversation first.');
    }
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    } else {
      handleTyping();
    }
  };

  const handleSelectUser = async (user) => {
    try {
      // Check if conversation already exists with this user
      const existingConversation = conversations.find(conv => 
        conv.user_id === user.id || 
        conv.participants?.some(p => p.id === user.id)
      );
      
      if (existingConversation) {
        // Select existing conversation
        await handleChatSelect(existingConversation);
        setShowUserSearch(false);
        return;
      }
      
      // Create new conversation
      const conversationData = {
        user_id: user.id
      };
      
      const response = await chatAPI.createConversation(conversationData);
      
      if (response.success) {
        const newConversation = response.conversation || response.data;
        const enrichedConversation = {
          ...newConversation,
          user_id: user.id,
          name: user.name,
          avatar: user.avatar,
          isOnline: onlineUsers.includes(user.id)
        };
        
        // Add to conversations list
        setConversations(prev => [enrichedConversation, ...prev]);
        
        // Select the new conversation
        setSelectedChat(enrichedConversation);
        setReplyingTo(null);
        setTempMessages([]);
        
        // Load messages for the new conversation
        if (newConversation.id) {
          await loadMessages(newConversation.id);
        } else {
          // If no conversation ID yet, clear messages
          setMessages([]);
        }
        
        setShowUserSearch(false);
      } else {
        console.error('Failed to create conversation:', response.message);
        alert('Failed to start conversation. Please try again.');
      }
    } catch (error) {
      console.error('Failed to create conversation:', error);
      alert('Failed to start conversation. Please try again.');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      return '';
    }
  };

  const formatDate = (timestamp) => {
    try {
      const date = new Date(timestamp);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (date.toDateString() === today.toDateString()) {
        return 'Today';
      } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
      } else {
        return date.toLocaleDateString([], { month: 'long', day: 'numeric' });
      }
    } catch (error) {
      return '';
    }
  };

  const getLastMessageTime = (conversation) => {
    if (conversation.last_message_at) {
      return formatTime(conversation.last_message_at);
    }
    if (conversation.last_message && conversation.last_message.created_at) {
      return formatTime(conversation.last_message.created_at);
    }
    return conversation.time || '';
  };

  const getLastMessageText = (conversation) => {
    if (conversation.last_message) {
      if (conversation.last_message.is_deleted) {
        return 'This message was deleted';
      }
      if (conversation.last_message.type === 'image') {
        return '📷 Image';
      }
      if (conversation.last_message.type === 'file') {
        return '📎 File';
      }
      return conversation.last_message.message?.substring(0, 30) + 
             (conversation.last_message.message?.length > 30 ? '...' : '');
    }
    return conversation.lastMessage || 'No messages yet';
  };

  const updateConversationInList = (updatedConversation) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === updatedConversation.id ? updatedConversation : conv
      )
    );
  };

  const updateConversationLastMessage = (conversationId, message) => {
    setConversations(prev =>
      prev.map(conv => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            last_message: message,
            last_message_at: message.created_at
          };
        }
        return conv;
      })
    );
  };

  const updateConversationUnreadCount = (conversationId, reset = false) => {
    setConversations(prev =>
      prev.map(conv => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            unread: reset ? 0 : (conv.unread || 0) + 1
          };
        }
        return conv;
      })
    );
  };

  const updateConversationOnlineStatus = (userId, isOnline) => {
    setConversations(prev =>
      prev.map(conv => {
        if (conv.user_id === userId) {
          return {
            ...conv,
            isOnline
          };
        }
        return conv;
      })
    );
  };

  const markMessagesAsRead = (messageIds) => {
    setMessages(prev =>
      prev.map(msg =>
        messageIds.includes(msg.id) ? { ...msg, read_at: new Date().toISOString() } : msg
      )
    );
  };

  const filteredChats = conversations.filter(chat =>
    chat.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Combine regular messages with temporary messages for display
  const allMessages = [...messages, ...tempMessages].sort((a, b) => 
    new Date(a.created_at || 0) - new Date(b.created_at || 0)
  );

  const groupedMessages = () => {
    const groups = [];
    let currentDate = null;

    allMessages.forEach(message => {
      const messageDate = formatDate(message.created_at);
      
      if (messageDate !== currentDate) {
        groups.push({ type: 'date', value: messageDate });
        currentDate = messageDate;
      }
      
      groups.push({ type: 'message', value: message });
    });

    return groups;
  };

  const hasValidReply = (message) => {
    return message.reply_to && message.parent_message && message.parent_message.message;
  };

  const isUserTyping = () => {
    if (!selectedChat) return false;
    
    const typingUserIds = Object.keys(typingUsers);
    if (typingUserIds.length === 0) return false;

    if (selectedChat.user_id) {
      return typingUsers[selectedChat.user_id];
    }
    
    return typingUserIds.some(userId => {
      return selectedChat.participants?.some(p => p.id.toString() === userId);
    });
  };

  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  return (
    <div className="chat-module">
      {showUserSearch && (
        <UserSearch
          onClose={() => setShowUserSearch(false)}
          onSelectUser={handleSelectUser}
        />
      )}
      
      {/* Chat Sidebar */}
      <div className="chat-sidebar">
        <div className="chat-header">
          <h2 className="chat-title">Messages</h2>
          <div className="header-actions">
            <button 
              className="new-chat-btn"
              onClick={() => setShowUserSearch(true)}
              title="New Chat"
            >
              ✏️ New
            </button>
            <button 
              className="refresh-btn" 
              onClick={loadConversations}
              disabled={loading}
              title="Refresh"
            >
              {loading ? '🔄' : '🔄'}
            </button>
          </div>
        </div>

        <div className="chat-search">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="chat-list">
          {loading ? (
            <div className="loading-chats">Loading conversations...</div>
          ) : filteredChats.length === 0 ? (
            <div className="no-conversations">
              <p>No conversations found</p>
              <button 
                className="start-chat-btn"
                onClick={() => setShowUserSearch(true)}
              >
                Start a new chat
              </button>
            </div>
          ) : (
            filteredChats.map((chat) => (
              <div
                key={chat.id || `user_${chat.user_id}`}
                className={`chat-item ${selectedChat?.id === chat.id || selectedChat?.user_id === chat.user_id ? 'active' : ''}`}
                onClick={() => handleChatSelect(chat)}
              >
                <div className="chat-avatar">
                  <img 
                    src={chat.avatar || '/default-avatar.png'} 
                    alt={chat.name}
                    onError={(e) => {
                      e.target.src = '/default-avatar.png';
                    }}
                  />
                  {chat.isOnline && <div className="online-indicator"></div>}
                </div>
                <div className="chat-info">
                  <div className="chat-name">{chat.name}</div>
                  <div className={`chat-last-message ${typingUsers[chat.user_id] ? 'typing' : ''}`}>
                    {typingUsers[chat.user_id] ? 'typing...' : getLastMessageText(chat)}
                  </div>
                </div>
                <div className="chat-meta">
                  <div className="chat-time">{getLastMessageTime(chat)}</div>
                  {chat.unread > 0 && (
                    <div className="unread-badge">{chat.unread > 99 ? '99+' : chat.unread}</div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="all-messages">
          <span className="all-messages-text">📧 All Messages</span>
          <span className="online-count">{onlineUsers.length} online</span>
        </div>
      </div>

      {/* Chat Main Area */}
      <div className="chat-main">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="chat-main-header">
              <div className="chat-user-info">
                <div className="chat-user-avatar">
                  <img 
                    src={selectedChat.avatar || '/default-avatar.png'} 
                    alt={selectedChat.name}
                    onError={(e) => {
                      e.target.src = '/default-avatar.png';
                    }}
                  />
                  {selectedChat.isOnline && <div className="online-indicator"></div>}
                </div>
                <div className="chat-user-details">
                  <div className="chat-user-name">{selectedChat.name}</div>
                  <div className="chat-user-status">
                    {selectedChat.isOnline ? 'Online' : 'Offline'}
                    {isUserTyping() && <span className="typing-indicator"> • typing...</span>}
                  </div>
                </div>
              </div>
              <div className="chat-actions">
                <button className="action-btn call-btn">📞 Call</button>
                <button className="action-btn profile-btn">View Profile</button>
                <button className="action-btn menu-btn">⋯</button>
              </div>
            </div>

            {/* Reply Preview */}
            {replyingTo && (
              <div className="reply-preview">
                <div className="reply-preview-content">
                  <div className="reply-preview-header">
                    <span>Replying to {replyingTo.user?.name || 'User'}</span>
                    <button onClick={cancelReply} className="cancel-reply-btn">×</button>
                  </div>
                  <div className="reply-preview-message">
                    {replyingTo.message?.substring(0, 50)}
                    {replyingTo.message?.length > 50 ? '...' : ''}
                  </div>
                </div>
              </div>
            )}

            {/* Messages Area */}
            <div className="messages-area">
              {groupedMessages().map((item, index) => {
                if (item.type === 'date') {
                  return (
                    <div key={`date-${index}`} className="date-divider">
                      <span>{item.value}</span>
                    </div>
                  );
                }

                const message = item.value;
                const isCurrentUser = message.isSent || message.user_id === currentUser?.id;
                const isTemp = message.isTemp;
                
                return (
                  <div key={message.id || message.tempId} className={`message ${isCurrentUser ? 'sent' : 'received'} ${isTemp ? 'temp' : ''}`}>
                    {!isCurrentUser && !isTemp && (
                      <img 
                        src={message.user?.avatar || '/default-avatar.png'} 
                        alt={message.user?.name}
                        className="message-avatar"
                        onError={(e) => {
                          e.target.src = '/default-avatar.png';
                        }}
                      />
                    )}
                    <div className="message-content-wrapper">
                      {hasValidReply(message) && (
                        <div className="message-reply-indicator">
                          <span>Replying to: {message.parent_message.user?.name}</span>
                          <div className="reply-preview-small">
                            {message.parent_message.message?.substring(0, 30)}
                            {message.parent_message.message?.length > 30 ? '...' : ''}
                          </div>
                        </div>
                      )}
                      
                      <div className="message-content">
                        {message.type === 'text' && (
                          <div className="message-text">{message.message}</div>
                        )}
                        {message.type === 'file' && (
                          <div className="message-file">
                            <div className="file-icon">📄</div>
                            <div className="file-info">
                              <div className="file-name">{message.message}</div>
                              <a href={message.attachment_url} download className="download-link">
                                Download
                              </a>
                            </div>
                          </div>
                        )}
                        {message.type === 'image' && message.attachment_url && (
                          <div className="message-image">
                            <img 
                              src={message.attachment_url} 
                              alt="Shared image"
                              onClick={() => window.open(message.attachment_url, '_blank')}
                            />
                          </div>
                        )}
                        {isTemp && (
                          <div className="message-status">Sending...</div>
                        )}
                      </div>
                      {!isTemp && (
                        <div className="message-actions">
                          <button 
                            className="message-action-btn"
                            onClick={() => handleReplyToMessage(message)}
                            title="Reply"
                            disabled={!selectedChat.id}
                          >
                            ↩
                          </button>
                        </div>
                      )}
                      <div className="message-time">
                        {formatTime(message.created_at)}
                        {!isTemp && message.read_at && <span className="read-indicator">✓✓</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="message-input-area">
              <div className="message-options">
                <button className="option-btn" title="Attach file">📎</button>
                <button className="option-btn" title="Emoji">😊</button>
              </div>
              <div className="message-input-wrapper">
                <input
                  type="text"
                  placeholder={replyingTo ? `Replying to ${replyingTo.user?.name}...` : "Send a message..."}
                  value={messageText}
                  onChange={(e) => {
                    setMessageText(e.target.value);
                    handleTyping();
                  }}
                  onKeyDown={handleKeyPress}
                  className="message-input"
                  disabled={!selectedChat}
                />
                <div className="input-actions">
                  <button className="input-action-btn" title="Voice message">🎤</button>
                  <button 
                    className="send-btn" 
                    onClick={handleSendMessage}
                    disabled={!messageText.trim() || !selectedChat}
                  >
                    Send 🚀
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="no-chat-selected">
            <div className="welcome-message">
              <h3>Welcome to FitNation Chat</h3>
              <p>Select a conversation or start a new chat</p>
              <button 
                className="start-chat-btn-large"
                onClick={() => setShowUserSearch(true)}
              >
                Start New Chat
              </button>
              <div className="welcome-features">
                <div className="feature">
                  <span>💬</span>
                  <span>Real-time messaging</span>
                </div>
                <div className="feature">
                  <span>📁</span>
                  <span>File sharing</span>
                </div>
                <div className="feature">
                  <span>👥</span>
                  <span>Group chats</span>
                </div>
                <div className="feature">
                  <span>↩</span>
                  <span>Message replies</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatModule;