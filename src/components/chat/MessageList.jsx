// components/MessageList.jsx
import React, { useEffect, useRef, useCallback } from 'react';

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
  const checkMessagesInView = useCallback(() => {
    if (!messagesContainerRef.current || !onMessageRead) return;

    const container = messagesContainerRef.current;
    const messageElements = container.querySelectorAll('.message');
    
    let allMessagesInView = true;
    
    messageElements.forEach(element => {
      const rect = element.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      
      // Check if message is within the visible container area
      if (rect.bottom > containerRect.bottom || rect.top < containerRect.top) {
        allMessagesInView = false;
      }
    });

    if (allMessagesInView && !hasMarkedAsRead.current) {
      onMessageRead();
      hasMarkedAsRead.current = true;
    }
  }, [onMessageRead]);

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
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', minute: '2-digit' 
    });
  };

  const getReadReceiptInfo = (message) => {
    if (message.is_own && message.read_by && message.read_by.length > 0) {
      const readCount = message.read_by.length;
      const totalParticipants = conversation.users?.length || 1;
      
      if (readCount === totalParticipants) {
        return 'Read by everyone';
      } else if (readCount > 0) {
        return `Read by ${readCount}`;
      }
    }
    return null;
  };

  if (loading) {
    return (
      <div className="message-list">
        <div className="loading-messages">Loading messages...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="message-list">
        <div className="error-messages">Error loading messages: {error}</div>
      </div>
    );
  }

  return (
    <div className="message-list">
      <div className="conversation-header">
        <div className="conversation-details">
          {conversation.type === 'private' ? (
            <>
              <img 
                src={conversation.other_user?.avatar || '/default-avatar.png'} 
                alt={conversation.other_user?.name}
                className="conversation-avatar"
              />
              <div className="conversation-info">
                <h3>{conversation.other_user?.name}</h3>
                <span className="conversation-status">
                  {conversation.other_user?.is_online ? 'Online' : 'Offline'}
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="group-avatar">
                {conversation.name?.charAt(0)?.toUpperCase() || 'G'}
              </div>
              <div className="conversation-info">
                <h3>{conversation.name}</h3>
                <span className="participants-count">
                  {conversation.users?.length || 0} participants
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
          messages.map(message => (
            <MessageItem 
              key={message.id} 
              message={message} 
              formatTime={formatTime}
              getReadReceiptInfo={getReadReceiptInfo}
            />
          ))
        )}
        <div ref={messagesEndRef} className="messages-end" />
      </div>
    </div>
  );
};

const MessageItem = ({ message, formatTime, getReadReceiptInfo }) => {
  const isSystem = message.type === 'system';
  const isDeleted = message.is_deleted;
  const readReceipt = getReadReceiptInfo(message);

  if (isSystem) {
    return (
      <div className="message-system">
        <span>{message.message}</span>
        <span className="message-time system-time">
          {formatTime(message.created_at)}
        </span>
      </div>
    );
  }

  return (
    <div className={`message ${message.is_own ? 'own-message' : 'other-message'}`}>
      {!message.is_own && (
        <img 
          src={message.user?.avatar || '/default-avatar.png'} 
          alt={message.user?.name}
          className="message-avatar"
        />
      )}
      
      <div className="message-content">
        {!message.is_own && (
          <span className="message-sender">{message.user?.name}</span>
        )}
        
        {message.reply_to && message.parent_message && (
          <div className="message-reply">
            <strong>{message.parent_message.user?.name}: </strong>
            {message.parent_message.is_deleted 
              ? 'This message was deleted'
              : message.parent_message.message
            }
          </div>
        )}
        
        <div className="message-bubble">
          {isDeleted ? (
            <p className="message-deleted">This message was deleted</p>
          ) : message.attachment_url ? (
            <MessageAttachment message={message} />
          ) : (
            <p>{message.message}</p>
          )}
          
          <div className="message-meta">
            <span className="message-time">
              {formatTime(message.created_at)}
              {message.is_edited && <span className="edited">(edited)</span>}
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
  const isImage = message.attachment_url.match(/\.(jpg|jpeg|png|gif|webp)$/i);

  if (isImage) {
    return (
      <div className="message-attachment">
        <img 
          src={message.attachment_url} 
          alt="Attachment"
          onClick={() => window.open(message.attachment_url, '_blank')}
          className="attachment-image"
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
        📎 {message.attachment_url.split('/').pop() || 'Download file'}
      </a>
      {message.message && <p className="attachment-caption">{message.message}</p>}
    </div>
  );
};

export default MessageList;