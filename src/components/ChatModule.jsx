import React, { useState } from 'react';

const ChatModule = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [messageText, setMessageText] = useState('');

  // Mock chat data
  const chats = [
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
    {
      id: 3,
      name: 'Ahmed Medi',
      lastMessage: 'Your really nice 🔥',
      time: '1:46 AM',
      avatar: '/src/assets/images/user3.jpg',
      isOnline: true,
      unread: 1
    },
    {
      id: 4,
      name: 'Claudia Mancil',
      lastMessage: 'Typing...',
      time: '4:30 PM',
      avatar: '/src/assets/images/user4.jpg',
      isOnline: true,
      unread: 0,
      isTyping: true
    },
    {
      id: 5,
      name: 'Novita',
      lastMessage: 'Hi, here are a...',
      time: '4:02 PM',
      avatar: '/src/assets/images/user5.jpg',
      isOnline: false,
      unread: 0
    },
    {
      id: 6,
      name: 'Millio Nese',
      lastMessage: 'Lorem goo 😊',
      time: '5:20 PM',
      avatar: '/src/assets/images/user6.jpg',
      isOnline: false,
      unread: 0
    },
    {
      id: 7,
      name: 'Nagem SD',
      lastMessage: '',
      time: 'yesterday',
      avatar: '/src/assets/images/user7.jpg',
      isOnline: false,
      unread: 0
    },
    {
      id: 8,
      name: 'Aditya',
      lastMessage: '',
      time: 'yesterday',
      avatar: '/src/assets/images/user8.jpg',
      isOnline: false,
      unread: 0
    },
    {
      id: 9,
      name: 'Ahmed Medi',
      lastMessage: '',
      time: '1:46 AM',
      avatar: '/src/assets/images/user9.jpg',
      isOnline: false,
      unread: 1
    }
  ];

  // Mock messages for selected chat
  const messages = [
    {
      id: 1,
      text: 'Hello my dear sir I have so delicious design request document for our next projects.',
      time: '10:28 AM',
      isSent: false,
      type: 'text'
    },
    {
      id: 2,
      fileName: 'Design_project_2025.docx',
      time: '10:29 AM',
      isSent: false,
      type: 'file'
    },
    {
      id: 3,
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris',
      time: '10:30 AM',
      isSent: true,
      type: 'text'
    },
    {
      id: 4,
      text: 'Do distinctio truly dream of electric sheeps?',
      time: '10:35 AM',
      isSent: false,
      type: 'text'
    },
    {
      id: 5,
      videoThumbnail: '/src/assets/images/video-thumb.jpg',
      time: '10:36 AM',
      isSent: false,
      type: 'video'
    },
    {
      audioWaveform: true,
      time: '10:37 AM',
      isSent: true,
      type: 'audio'
    }
  ];

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
  };

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // Add message logic here
      setMessageText('');
    }
  };

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="chat-list">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              className={`chat-item ${selectedChat?.id === chat.id ? 'active' : ''}`}
              onClick={() => handleChatSelect(chat)}
            >
              <div className="chat-avatar">
                <img src={chat.avatar} alt={chat.name} />
                {chat.isOnline && <div className="online-indicator"></div>}
              </div>
              <div className="chat-info">
                <div className="chat-name">{chat.name}</div>
                <div className={`chat-last-message ${chat.isTyping ? 'typing' : ''}`}>
                  {chat.lastMessage}
                </div>
              </div>
              <div className="chat-meta">
                <div className="chat-time">{chat.time}</div>
                {chat.unread > 0 && (
                  <div className="unread-badge">{chat.unread}</div>
                )}
              </div>
            </div>
          ))}
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
                  <img src={selectedChat.avatar} alt={selectedChat.name} />
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

            {/* Messages Area */}
            <div className="messages-area">
              <div className="date-divider">
                <span>19 August</span>
              </div>

              {messages.map((message) => (
                <div key={message.id} className={`message ${message.isSent ? 'sent' : 'received'}`}>
                  <div className="message-content">
                    {message.type === 'text' && (
                      <div className="message-text">{message.text}</div>
                    )}
                    {message.type === 'file' && (
                      <div className="message-file">
                        <div className="file-icon">📄</div>
                        <div className="file-info">
                          <div className="file-name">{message.fileName}</div>
                        </div>
                      </div>
                    )}
                    {message.type === 'video' && (
                      <div className="message-video">
                        <img src={message.videoThumbnail} alt="Video" />
                        <div className="play-button">▶️</div>
                      </div>
                    )}
                    {message.type === 'audio' && (
                      <div className="message-audio">
                        <div className="audio-waveform">🎵 ╱╲╱╲╱╲╱╲╱╲╱╲╱╲</div>
                      </div>
                    )}
                  </div>
                  <div className="message-time">{message.time}</div>
                </div>
              ))}

              <div className="date-divider">
                <span>Today</span>
              </div>
            </div>

            {/* Message Input */}
            <div className="message-input-area">
              <div className="message-options">
                <span>⋯</span>
              </div>
              <div className="message-input-wrapper">
                <input
                  type="text"
                  placeholder="Send a message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="message-input"
                />
                <div className="input-actions">
                  <button className="input-action-btn">😊</button>
                  <button className="input-action-btn">🎤</button>
                  <button className="send-btn" onClick={handleSendMessage}>
                    Send 🚀
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="no-chat-selected">
            <h3>Select a conversation to start messaging</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatModule;