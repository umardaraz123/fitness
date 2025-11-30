import React, { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import axiosInstance from '../config/axios.config';

const ChatModule = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [messageText, setMessageText] = useState('');
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const messagesEndRef = useRef(null);

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
    // ... rest of mock chats
  ];

  useEffect(() => {
    initializeSocket();
    loadConversations();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeSocket = () => {
    const token = localStorage.getItem('auth_token');
    const newSocket = io(import.meta.env.VITE_APP_SOCKET_URL || 'http://localhost:8000', {
      auth: { token }
    });

    newSocket.on('connect', () => {
      console.log('Connected to chat server');
    });

    newSocket.on('message.sent', (data) => {
      if (selectedChat && data.conversation.id === selectedChat.id) {
        setMessages(prev => [...prev, data.message]);
      }
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  };

  const loadConversations = async () => {
    try {
      setLoading(true);
      
      const response = await axiosInstance.get('/chat/conversations');
      
      if (response.data.success) {
        setConversations(response.data.conversations?.data || mockChats);
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
      const response = await axiosInstance.get(`/chat/conversations/${conversationId}/messages`);
      if (response.data.success) {
        setMessages(response.data.messages?.data || []);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
      setMessages(getMockMessages());
    }
  };

  const getMockMessages = () => [
    {
      id: 1,
      message: 'Hello my dear sir I have so delicious design request document for our next projects.',
      created_at: '2024-01-19T10:28:00Z',
      user: { name: 'Kilian James', avatar: '/src/assets/images/user1.jpg' },
      isSent: false,
      type: 'text'
    },
    {
      id: 2,
      message: 'Design_project_2025.docx',
      attachment_url: '#',
      created_at: '2024-01-19T10:29:00Z',
      user: { name: 'Kilian James', avatar: '/src/assets/images/user1.jpg' },
      isSent: false,
      type: 'file'
    },
    {
      id: 3,
      message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris',
      created_at: '2024-01-19T10:30:00Z',
      user: { name: 'You', avatar: '' },
      isSent: true,
      type: 'text'
    },
    {
      id: 4,
      message: 'Do distinctio truly dream of electric sheeps?',
      created_at: '2024-01-19T10:35:00Z',
      user: { name: 'Kilian James', avatar: '/src/assets/images/user1.jpg' },
      isSent: false,
      type: 'text'
    }
  ];

  const handleChatSelect = async (chat) => {
    setSelectedChat(chat);
    setReplyingTo(null);
    await loadMessages(chat.id);
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedChat) return;

    try {
      // Prepare message data
      const messageData = {
        conversation_id: selectedChat.id,
        message: messageText.trim(),
        type: 'text'
      };

      // Only add reply_to if we're replying to a message
      if (replyingTo && replyingTo.id) {
        messageData.reply_to = replyingTo.id;
      }

      console.log('Sending message with data:', messageData); // Debug log

      const response = await axiosInstance.post('/chat/send-message', messageData);
      
      if (response.data.success) {
        const newMessage = response.data.message;
        
        // If this is a reply, we need to ensure parent_message is included
        if (replyingTo && newMessage.reply_to) {
          // Manually add the parent message data for immediate display
          newMessage.parent_message = {
            id: replyingTo.id,
            message: replyingTo.message,
            user: replyingTo.user
          };
        }
        
        setMessages(prev => [...prev, newMessage]);
        setMessageText('');
        setReplyingTo(null);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      
      // Create a temporary message with proper reply data
      const tempMessage = {
        id: Date.now(),
        message: messageText,
        created_at: new Date().toISOString(),
        user: { name: 'You', avatar: '' },
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

      setMessages(prev => [...prev, tempMessage]);
      setMessageText('');
      setReplyingTo(null);
    }
  };

  const handleReplyToMessage = (message) => {
    setReplyingTo(message);
    // Focus the input field
    setTimeout(() => {
      const input = document.querySelector('.message-input');
      if (input) {
        input.focus();
      }
    }, 100);
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
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
  };

  const getLastMessageTime = (conversation) => {
    if (conversation.last_message_at) {
      return formatTime(conversation.last_message_at);
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

  const filteredChats = conversations.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedMessages = () => {
    const groups = [];
    let currentDate = null;

    messages.forEach(message => {
      const messageDate = formatDate(message.created_at);
      
      if (messageDate !== currentDate) {
        groups.push({ type: 'date', value: messageDate });
        currentDate = messageDate;
      }
      
      groups.push({ type: 'message', value: message });
    });

    return groups;
  };

  // Enhanced function to check if a message has valid reply data
  const hasValidReply = (message) => {
    return message.reply_to && message.parent_message && message.parent_message.message;
  };

  // Memoized functions for better performance
  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleMessageChange = useCallback((e) => {
    setMessageText(e.target.value);
  }, []);

  return (
    <div className="chat-module">
      {/* Chat Sidebar */}
      <div className="chat-sidebar">
        <div className="chat-header">
          <h2 className="chat-title">Messages</h2>
        </div>

        <div className="chat-search">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
        </div>

        <div className="chat-list">
          {loading ? (
            <div className="loading-chats">Loading conversations...</div>
          ) : (
            filteredChats.map((chat) => (
              <div
                key={chat.id}
                className={`chat-item ${selectedChat?.id === chat.id ? 'active' : ''}`}
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
                  <div className={`chat-last-message ${chat.isTyping ? 'typing' : ''}`}>
                    {getLastMessageText(chat)}
                  </div>
                </div>
                <div className="chat-meta">
                  <div className="chat-time">{getLastMessageTime(chat)}</div>
                  {chat.unread > 0 && (
                    <div className="unread-badge">{chat.unread}</div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="all-messages">
          <span className="all-messages-text">📧 All Messages</span>
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
                    {selectedChat.isOnline ? 'Online' : 'From Computer 100'}
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
                return (
                  <div key={message.id} className={`message ${message.isSent ? 'sent' : 'received'}`}>
                    {!message.isSent && (
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
                      {/* Enhanced Reply indicator with better validation */}
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
                        {message.isTemp && (
                          <div className="message-status">Sending...</div>
                        )}
                      </div>
                      <div className="message-actions">
                        <button 
                          className="message-action-btn"
                          onClick={() => handleReplyToMessage(message)}
                          title="Reply"
                        >
                          ↩
                        </button>
                      </div>
                      <div className="message-time">{formatTime(message.created_at)}</div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="message-input-area">
              <div className="message-options">
                <button className="option-btn">📎</button>
                <button className="option-btn">😊</button>
              </div>
              <div className="message-input-wrapper">
                <input
                  type="text"
                  placeholder={replyingTo ? `Replying to ${replyingTo.user?.name}...` : "Send a message..."}
                  value={messageText}
                  onChange={handleMessageChange}
                  onKeyDown={handleKeyPress}
                  className="message-input"
                />
                <div className="input-actions">
                  <button className="input-action-btn">🎤</button>
                  <button 
                    className="send-btn" 
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
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
              <p>Select a conversation to start messaging</p>
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