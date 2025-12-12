import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  getConversations, 
  selectConversation, 
  sendMessage, 
  createGroup,
  searchUsers,
  getConversationMessages,
  markAsRead,
  getUsers
} from '../../store/slices/chatSlice';
import MessageList from '../../components/chat/MessageList';
import './ContactsPage.css';

const ContactsPage = () => {
  const [activeTab, setActiveTab] = useState('chats');
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [lastFetchedConversationId, setLastFetchedConversationId] = useState(null);


  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  // Chat state from Redux
  const { 
    conversations, 
    selectedConversation, 
    messages, 
    searchedUsers,
    loading,
    error
  } = useSelector((state) => state.chat);

  // ✅ درست: Get conversations array from Redux state
  // Redux state میں conversations ہمیشہ array ہیں
  const conversationsArray = Array.isArray(conversations) ? conversations : [];

  // Filter conversations based on active tab
  const filteredConversations = useCallback(() => {
    if (!conversationsArray || conversationsArray.length === 0) return [];
    
    let filtered = conversationsArray.filter(conv => {
      // Check if conversation exists
      if (!conv) return false;
      
      // Search by conversation name (for groups)
      if (conv.name && conv.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return true;
      }
      
      // Search by user names in conversation
      if (conv.users && Array.isArray(conv.users)) {
        return conv.users.some(u => {
          if (!u) return false;
          return (u.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                 (u.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());
        });
      }
      
      return false;
    });

    if (activeTab === 'chats') {
      return filtered;
    } else if (activeTab === 'groups') {
      return filtered.filter(conv => conv.type === 'group');
    } else if (activeTab === 'contacts') {
      return [];
    }
    
    return filtered;
  }, [conversationsArray, searchTerm, activeTab]);

  // Separate groups and private chats
  const groups = filteredConversations().filter(conv => conv.type === 'group');
  const privateChats = filteredConversations().filter(conv => conv.type === 'private');

  // Extract contacts from private chats
  const contactsFromConversations = privateChats
    .filter(chat => chat && chat.users)
    .map(chat => {
      const otherUser = chat.users?.find(u => u && u.id !== user?.id);
      if (!otherUser) return null;
      
      return {
        ...otherUser,
        conversation_id: chat.id,
        last_message: chat.last_message,
        unread_count: chat.unread_count,
        last_message_at: chat.last_message_at
      };
    })
    .filter(Boolean); // Remove null values

  // Combine with searched users
  const allContacts = [...contactsFromConversations, ...(Array.isArray(searchedUsers) ? searchedUsers : [])]
    .filter((contact, index, self) => {
      if (!contact || !contact.id) return false;
      return index === self.findIndex(c => c && c.id === contact.id);
    });

  // Filter contacts based on search term
  const filteredContacts = allContacts.filter(contact => {
    if (!contact) return false;
    return (contact.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
           (contact.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());
  });

  // Fetch conversations on mount
  useEffect(() => {
    dispatch(getConversations({ page: 1 }));
  }, [dispatch]);

  // Fetch messages when conversation is selected
  // useEffect(() => {
  //   console.log('selectedConversation ======= ', selectedConversation);
  //   if (selectedConversation && selectedConversation.id) {
  //     dispatch(getConversationMessages({ 
  //       conversationId: selectedConversation.id, 
  //       params: { page: 1 } 
  //     }));
      
  //     // Mark as read
  //     dispatch(markAsRead(selectedConversation.id));
  //   }
  // }, [selectedConversation, dispatch]);

  useEffect(() => {
    if (selectedConversation && selectedConversation.id && selectedConversation.id !== lastFetchedConversationId) {
      const conversationId = selectedConversation.id;
      
      dispatch(getConversationMessages({ 
        conversationId, 
        params: { page: 1 } 
      }));
      
      dispatch(markAsRead(conversationId));
      
      setLastFetchedConversationId(conversationId);
    }
  }, [selectedConversation, dispatch, lastFetchedConversationId]);

  // Search users when search term changes
  useEffect(() => {
    if (searchTerm.trim() && activeTab === 'contacts') {
      const timer = setTimeout(() => {
        dispatch(searchUsers({ searchTerm }));
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [searchTerm, activeTab, dispatch]);

  // Fetch all users for contacts tab
  const fetchAllUsers = useCallback(() => {
    console.log('sdfsdf =========== ');
    dispatch(getUsers({ page: 1 }));
  }, [dispatch]);

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'contacts') {
      fetchAllUsers();
    }
  };

  // Handle conversation selection
  const handleSelectConversation = (conversation) => {
    if (conversation && conversation.id) {
      dispatch(selectConversation(conversation));
    }
  };

  // Start new conversation
  const handleStartNewConversation = (contactId) => {
    alert('Starting new conversation with user ID: ' + contactId);
  };

  // Create new group
  const handleCreateNewGroup = () => {
    if (!groupName.trim() || selectedUsers.length === 0) {
      alert('Please enter group name and select at least one user');
      return;
    }

    dispatch(createGroup({
      name: groupName,
      user_ids: selectedUsers
    })).then((action) => {
      if (action.payload?.success) {
        setShowCreateGroup(false);
        setGroupName('');
        setSelectedUsers([]);
        setActiveTab('chats');
      }
    });
  };

  // Send message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    dispatch(sendMessage({
      message: newMessage,
      conversation: selectedConversation
    })).then(() => {
      setNewMessage('');
      // Refresh messages
      dispatch(getConversationMessages({ 
        conversationId: selectedConversation.id, 
        params: { page: 1 } 
      }));
    });
  };

  // Handle key press for sending message
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Mark messages as read
  const handleMarkAsRead = () => {
    if (selectedConversation) {
      dispatch(markAsRead(selectedConversation.id));
    }
  };

  // Get unread count for chats
  const getUnreadCount = () => {
    return conversationsArray.reduce((sum, conv) => sum + (conv.unread_count || 0), 0);
  };

  // Get conversation display name
  const getConversationDisplayName = (conversation) => {
    if (!conversation) return 'Unknown';
    
    if (conversation.type === 'private') {
      const otherUser = conversation.users?.find(u => u && u.id !== user?.id);
      return otherUser?.name || 'User';
    }
    return conversation.name || 'Group Chat';
  };

  // Get conversation avatar
  const getConversationAvatar = (conversation) => {
    if (!conversation) return '/default-avatar.png';
    
    if (conversation.type === 'private') {
      const otherUser = conversation.users?.find(u => u && u.id !== user?.id);
      return otherUser?.profile_image || otherUser?.profile_image_url || '/default-avatar.png';
    }
    return conversation.avatar || '/default-avatar.png';
  };

  // Format last message
  const formatLastMessage = (conversation) => {
    if (!conversation || !conversation.last_message) return 'No messages yet';
    
    const lastMessage = conversation.last_message;
    const senderName = lastMessage.user_id === user?.id ? 'You' : (lastMessage.user?.name || 'User');
    
    if (lastMessage.type === 'image') {
      return `${senderName}: Sent an image`;
    } else if (lastMessage.type === 'file') {
      return `${senderName}: Sent a file`;
    } else if (lastMessage.type === 'system') {
      return lastMessage.message || 'System message';
    }
    
    // Trim long messages
    const message = lastMessage.message || '';
    if (message.length > 30) {
      return `${senderName}: ${message.substring(0, 30)}...`;
    }
    
    return `${senderName}: ${message}`;
  };

  // Format time
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  // Render logic
  const renderChatsList = () => {
    const filtered = filteredConversations();

    if (loading.conversations) {
      return <div className="loading">Loading conversations...</div>;
    }
    
    if (filtered.length === 0) {
      return <div className="no-conversations">No conversations found</div>;
    }
    
    return (
      <div className="chats-list">
        {filtered.map(conversation => (
          <div
            key={conversation.id}
            className={`chat-item ${selectedConversation?.id === conversation.id ? 'active' : ''}`}
            onClick={() => handleSelectConversation(conversation)}
          >
            {conversation.type === 'private' ? (
              <>
                <div className="avatar">
                  {/* <img
                    src={getConversationAvatar(conversation)}
                    alt={getConversationDisplayName(conversation)}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/default-avatar.png';
                    }}
                  /> */}
                </div>
                <div className="chat-info">
                  <h4>{getConversationDisplayName(conversation)}</h4>
                  <p className="last-message">
                    {formatLastMessage(conversation)}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="group-avatar">
                  {conversation.name?.charAt(0)?.toUpperCase() || 'G'}
                </div>
                <div className="chat-info">
                  <h4>{conversation.name || 'Group'}</h4>
                  <p className="group-members">
                    {conversation.users?.length || 0} members
                  </p>
                </div>
              </>
            )}
            <div className="chat-meta">
              <span className="time">
                {formatTime(conversation.last_message_at)}
              </span>
              {conversation.unread_count > 0 && (
                <span className="unread-count">{conversation.unread_count}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderContactsList = () => {
    if (loading.searching) {
      return <div className="loading">Searching...</div>;
    }
    
    if (filteredContacts.length === 0) {
      return <div className="no-contacts">No contacts found</div>;
    }
    
    return (
      <div className="contacts-grid">
        {filteredContacts.map(contact => (
          <div
            key={contact.id}
            className="contact-item"
            onClick={() => {
              if (contact.conversation_id) {
                const existingConv = conversationsArray.find(c => c.id === contact.conversation_id);
                if (existingConv) {
                  handleSelectConversation(existingConv);
                  setActiveTab('chats');
                }
              } else {
                handleStartNewConversation(contact.id);
              }
            }}
          >
            <div className="avatar">
              {/* <img
                src={contact.profile_image || contact.profile_image_url || '/default-avatar.png'}
                alt={contact.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/default-avatar.png';
                }}
              /> */}
              {contact.last_seen_at && 
               new Date(contact.last_seen_at) > new Date(Date.now() - 5 * 60 * 1000) && (
                <span className="online-dot"></span>
              )}
            </div>
            <div className="contact-info">
              <h4>{contact.name || 'User'}</h4>
              <p className="contact-email">{contact.email}</p>
            </div>
            {!contact.conversation_id && (
              <span className="new-badge">New</span>
            )}
            {contact.unread_count > 0 && (
              <span className="unread-badge">{contact.unread_count}</span>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderGroupsList = () => {
    if (groups.length === 0) {
      return (
        <>
          <button
            className="create-group-btn"
            onClick={() => setShowCreateGroup(true)}
          >
            <span className="plus-icon">+</span>
            Create New Group
          </button>
          <div className="no-groups">No groups found. Create your first group!</div>
        </>
      );
    }
    
    return (
      <div className="groups-list">
        <button
          className="create-group-btn"
          onClick={() => setShowCreateGroup(true)}
        >
          <span className="plus-icon">+</span>
          Create New Group
        </button>
        
        {groups.map(group => (
          <div
            key={group.id}
            className="group-item"
            onClick={() => handleSelectConversation(group)}
          >
            <div className="group-avatar">
              {group.name?.charAt(0)?.toUpperCase() || 'G'}
            </div>
            <div className="group-info">
              <h4>{group.name || 'Group'}</h4>
              <p className="group-members">
                {group.users?.length || 0} members
              </p>
              <p className="group-last-message">
                {formatLastMessage(group)}
              </p>
            </div>
            <div className="group-meta">
              <span className="time">
                {formatTime(group.last_message_at)}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="contacts-page">
      {/* Left Sidebar */}
      <div className="contacts-sidebar">
        <div className="contacts-header">
          <h2>Contacts & Chats</h2>
          <div className="search-box">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="contacts-tabs">
          <button
            className={`tab-btn ${activeTab === 'chats' ? 'active' : ''}`}
            onClick={() => handleTabChange('chats')}
          >
            <span className="tab-icon">💬</span>
            <span className="tab-text">Chats</span>
            {getUnreadCount() > 0 && (
              <span className="unread-badge">{getUnreadCount()}</span>
            )}
          </button>
          
          <button
            className={`tab-btn ${activeTab === 'contacts' ? 'active' : ''}`}
            onClick={() => handleTabChange('contacts')}
          >
            <span className="tab-icon">👥</span>
            <span className="tab-text">Contacts</span>
          </button>
          
          <button
            className={`tab-btn ${activeTab === 'groups' ? 'active' : ''}`}
            onClick={() => handleTabChange('groups')}
          >
            <span className="tab-icon">👥👥</span>
            <span className="tab-text">Groups</span>
            <span className="group-count">{groups.length}</span>
          </button>
        </div>

        <div className="contacts-list">
          {activeTab === 'chats' ? renderChatsList() :
           activeTab === 'contacts' ? renderContactsList() :
           renderGroupsList()}
        </div>
      </div>

      {/* Right Panel - Messages */}
      <div className="messages-panel">
        {selectedConversation ? (
          <>
            <MessageList
              messages={messages}
              conversation={selectedConversation}
              loading={loading.messages}
              error={error.messages}
              onMessageRead={handleMarkAsRead}
              currentUserId={user?.id}
            />
            
            <div className="message-input-container">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="message-input"
                disabled={loading.sending}
              />
              <button 
                onClick={handleSendMessage} 
                className="send-btn"
                disabled={loading.sending || !newMessage.trim()}
              >
                {loading.sending ? 'Sending...' : 'Send'}
              </button>
            </div>
            
            {error.sending && (
              <div className="error-message">
                Error sending message: {error.sending}
              </div>
            )}
          </>
        ) : (
          <div className="no-conversation-selected">
            <div className="empty-state">
              <span className="empty-icon">💬</span>
              <h3>Select a conversation</h3>
              <p>Choose a contact or group from the list to start chatting</p>
            </div>
          </div>
        )}
      </div>

      {/* Create Group Modal (same as before) */}
      {showCreateGroup && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Create New Group</h3>
              <button 
                onClick={() => setShowCreateGroup(false)} 
                className="close-btn"
                disabled={loading.creatingGroup}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Group Name</label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Enter group name"
                  className="form-input"
                  disabled={loading.creatingGroup}
                />
              </div>
              
              <div className="form-group">
                <label>Select Members</label>
                <div className="selected-users">
                  {selectedUsers.map(userId => {
                    const contact = filteredContacts.find(c => c && c.id === userId);
                    return (
                      <div key={userId} className="selected-user-tag">
                        {contact?.name || 'User'}
                        <button
                          onClick={() => setSelectedUsers(prev => prev.filter(id => id !== userId))}
                          className="remove-user"
                          disabled={loading.creatingGroup}
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
                
                <div className="users-list">
                  {filteredContacts
                    .filter(c => c && !selectedUsers.includes(c.id) && c.id !== user?.id)
                    .map(contact => (
                    <div
                      key={contact.id}
                      className="user-option"
                      onClick={() => setSelectedUsers(prev => [...prev, contact.id])}
                    >
                      <div className="avatar-small">
                        <img 
                          src={contact.profile_image || contact.profile_image_url || '/default-avatar.png'} 
                          alt={contact.name} 
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/default-avatar.png';
                          }}
                        />
                      </div>
                      <span>{contact.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                onClick={() => setShowCreateGroup(false)} 
                className="cancel-btn"
                disabled={loading.creatingGroup}
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateNewGroup} 
                className="create-btn"
                disabled={loading.creatingGroup || !groupName.trim() || selectedUsers.length === 0}
              >
                {loading.creatingGroup ? 'Creating...' : 'Create Group'}
              </button>
            </div>
            
            {error.creatingGroup && (
              <div className="modal-error">
                Error creating group: {error.creatingGroup}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactsPage;