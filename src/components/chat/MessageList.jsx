import React, { useEffect, useRef, useCallback } from 'react';


const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

const MessageList = ({ 
  messages, 
  conversation, 
  loading, 
  error, 
  onMessageRead,
  currentUserId 
}) => {
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const hasMarkedAsRead = useRef(false);

  // Function to check if messages are in viewport and mark as read
  // const checkMessagesInView = useCallback(() => {
  //   if (!messagesContainerRef.current || !onMessageRead) return;

  //   const container = messagesContainerRef.current;
  //   const messageElements = container.querySelectorAll('.message');
    
  //   let allMessagesInView = true;
    
  //   messageElements.forEach(element => {
  //     const rect = element.getBoundingClientRect();
  //     const containerRect = container.getBoundingClientRect();
      
  //     // Check if message is within the visible container area
  //     if (rect.bottom > containerRect.bottom || rect.top < containerRect.top) {
  //       allMessagesInView = false;
  //     }
  //   });

  //   if (allMessagesInView && !hasMarkedAsRead.current) {
  //     onMessageRead();
  //     hasMarkedAsRead.current = true;
  //   }
  // }, [onMessageRead]);


  const checkMessagesInView = useCallback(
  debounce(() => {
    if (!messagesContainerRef.current || !onMessageRead) return;

    const container = messagesContainerRef.current;
    const messageElements = container.querySelectorAll(".message");

    let allMessagesInView = true;

    messageElements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      if (
        rect.bottom > containerRect.bottom ||
        rect.top < containerRect.top
      ) {
        allMessagesInView = false;
      }
    });

    if (allMessagesInView && !hasMarkedAsRead.current) {
      hasMarkedAsRead.current = true; // FIRST set flag
      onMessageRead();                // THEN call handler
    }
  }, 300), // 300ms debounce
  []
);


  useEffect(() => {
    scrollToBottom();
    hasMarkedAsRead.current = false;
    
    // Add scroll event listener to check when messages come into view
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkMessagesInView);
    }

    // Initial check after render
    const timeoutId = setTimeout(checkMessagesInView, 100);

    return () => {
      if (container) {
        container.removeEventListener('scroll', checkMessagesInView);
      }
      clearTimeout(timeoutId);
    };
  }, [messages, checkMessagesInView]);

  useEffect(() => {
    // Reset the read flag when conversation changes
    hasMarkedAsRead.current = false;
  }, [conversation?.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    try {
      return new Date(timestamp).toLocaleTimeString([], { 
        hour: '2-digit', minute: '2-digit' 
      });
    } catch (e) {
      return '';
    }
  };

  const getReadReceiptInfo = (message) => {
    if (message.is_own && message.read_by && message.read_by.length > 0) {
      const readCount = message.read_by.length;
      const totalParticipants = conversation?.users?.length || 1;
      
      if (readCount === totalParticipants) {
        return 'Read by everyone';
      } else if (readCount > 0) {
        return `Read by ${readCount}`;
      }
    }
    return null;
  };

  // Group messages by date
  const groupMessagesByDate = () => {
    if (!messages || messages.length === 0) return [];
    
    const groups = [];
    let currentDate = null;
    let currentGroup = [];
    
    // Sort messages by created_at (oldest first)
    const sortedMessages = [...messages].sort((a, b) => 
      new Date(a.created_at || 0) - new Date(b.created_at || 0)
    );
    
    sortedMessages.forEach((message, index) => {
      const messageDate = message.created_at ? new Date(message.created_at).toDateString() : '';
      
      if (messageDate !== currentDate) {
        if (currentGroup.length > 0) {
          groups.push({
            date: currentDate,
            messages: currentGroup
          });
        }
        currentDate = messageDate;
        currentGroup = [message];
      } else {
        currentGroup.push(message);
      }
      
      // Add last group
      if (index === sortedMessages.length - 1) {
        groups.push({
          date: currentDate,
          messages: currentGroup
        });
      }
    });
    
    return groups;
  };

  const formatDateHeader = (dateString) => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    if (dateString === today) return 'Today';
    if (dateString === yesterday) return 'Yesterday';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="message-list">
        <div className="conversation-header">
          <div className="conversation-details">
            {conversation?.type === 'private' ? (
              <>
                <div className="conversation-avatar-placeholder"></div>
                <div className="conversation-info">
                  <h3>{conversation?.other_user?.name || 'User'}</h3>
                  <span className="conversation-status">
                    {conversation?.other_user?.is_online ? 'Online' : 'Offline'}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="group-avatar-placeholder"></div>
                <div className="conversation-info">
                  <h3>{conversation?.name || 'Group'}</h3>
                  <span className="participants-count">
                    {conversation?.users?.length || 0} participants
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="messages-container loading">
          <div className="loading-messages">Loading messages...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="message-list">
        <div className="conversation-header">
          <div className="conversation-details">
            <div className="conversation-info">
              <h3>Error</h3>
            </div>
          </div>
        </div>
        <div className="messages-container error">
          <div className="error-messages">Error loading messages: {error}</div>
        </div>
      </div>
    );
  }

  const messageGroups = groupMessagesByDate();

  return (
    <div className="message-list">
      <div className="conversation-header">
        <div className="conversation-details">
          {conversation?.type === 'private' ? (
            <>
              {/* <img 
                src={conversation?.other_user?.avatar || '/default-avatar.png'} 
                alt={conversation?.other_user?.name || 'User'}
                className="conversation-avatar"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/default-avatar.png';
                }}
              /> */}
              <div className="conversation-info">
                <h3>{conversation?.other_user?.name || 'User'}</h3>
                <span className="conversation-status">
                  {conversation?.other_user?.is_online ? 'Online' : 'Offline'}
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="group-avatar">
                {conversation?.name?.charAt(0)?.toUpperCase() || 'G'}
              </div>
              <div className="conversation-info">
                <h3>{conversation?.name || 'Group'}</h3>
                <span className="participants-count">
                  {conversation?.users?.length || 0} participants
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      <div 
        className="messages-container" 
        ref={messagesContainerRef}
        onScroll={checkMessagesInView}
      >
        {messages.length === 0 ? (
          <div className="no-messages">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <>
            {messageGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="message-date-group">
                <div className="date-header">
                  {formatDateHeader(group.date)}
                </div>
                {group.messages.map(message => (
                  <MessageItem 
                    key={message.id || message.tempId || Math.random()} 
                    message={message} 
                    formatTime={formatTime}
                    getReadReceiptInfo={getReadReceiptInfo}
                    currentUserId={currentUserId}
                  />
                ))}
              </div>
            ))}
          </>
        )}
        <div ref={messagesEndRef} className="messages-end" />
      </div>
    </div>
  );
};

const MessageItem = ({ message, formatTime, getReadReceiptInfo, currentUserId }) => {
  const isSystem = message.type === 'system';
  const isDeleted = message.is_deleted;
  const readReceipt = getReadReceiptInfo(message);
  const isOwn = message.is_own || (message.user_id && message.user_id === currentUserId);

  if (isSystem) {
    return (
      <div className="message-system">
        <span>{message.message || 'System message'}</span>
        <span className="message-time system-time">
          {formatTime(message.created_at)}
        </span>
      </div>
    );
  }

  return (
    <div className={`message ${isOwn ? 'own-message' : 'other-message'}`}>
      {!isOwn && (
        <img 
          src={message.user?.avatar || '/default-avatar.png'} 
          alt={message.user?.name || 'User'}
          className="message-avatar"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/default-avatar.png';
          }}
        />
      )}
      
      <div className="message-content">
        {!isOwn && message.user?.name && (
          <span className="message-sender">{message.user.name}</span>
        )}
        
        {message.reply_to && message.parent_message && (
          <div className="message-reply">
            <strong>{message.parent_message.user?.name || 'User'}: </strong>
            {message.parent_message.is_deleted 
              ? 'This message was deleted'
              : message.parent_message.message || ''
            }
          </div>
        )}
        
        <div className="message-bubble">
          {isDeleted ? (
            <p className="message-deleted">
              <i>This message was deleted</i>
            </p>
          ) : message.attachment_url ? (
            <MessageAttachment message={message} />
          ) : (
            <p>{message.message || ''}</p>
          )}
          
          <div className="message-meta">
            <span className="message-time">
              {formatTime(message.created_at)}
              {message.is_edited && <span className="edited"> (edited)</span>}
            </span>
            {readReceipt && (
              <span className="read-receipt">{readReceipt}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const MessageAttachment = ({ message }) => {
  const isImage = message.attachment_url && 
    message.attachment_url.match(/\.(jpg|jpeg|png|gif|webp|bmp)$/i);

  if (isImage) {
    return (
      <div className="message-attachment">
        <img 
          src={message.attachment_url} 
          alt="Attachment"
          onClick={() => window.open(message.attachment_url, '_blank')}
          className="attachment-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.parentElement.innerHTML = 
              `<div class="file-attachment-error">
                <span>📎 Image not available</span>
              </div>`;
          }}
        />
        {message.message && <p className="attachment-caption">{message.message}</p>}
      </div>
    );
  }

  return (
    <div className="message-attachment">
      <a 
        href={message.attachment_url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="file-attachment"
      >
        📎 {message.attachment_url?.split('/').pop() || 'Download file'}
      </a>
      {message.message && <p className="attachment-caption">{message.message}</p>}
    </div>
  );
};

export default MessageList;