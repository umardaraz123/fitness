import React from 'react';

const ConversationList = ({ conversations, selectedConversation, onSelectConversation, loading }) => {
    if (loading) {
        return <div className="loading">Loading conversations...</div>;
    }

    return (
        <div className="conversation-list">
            {conversations.map(conversation => (
                <div
                    key={conversation.id}
                    className={`conversation-item ${
                        selectedConversation?.id === conversation.id ? 'active' : ''
                    }`}
                    onClick={() => onSelectConversation(conversation)}
                >
                    <div className="conversation-avatar">
                        {conversation.type === 'private' ? (
                            <img 
                                src={conversation.other_user?.avatar || '/default-avatar.png'} 
                                alt={conversation.other_user?.name}
                            />
                        ) : (
                            <div className="group-avatar">
                                {conversation.name?.charAt(0) || 'G'}
                            </div>
                        )}
                    </div>
                    
                    <div className="conversation-info">
                        <div className="conversation-header">
                            <h4>
                                {conversation.type === 'private' 
                                    ? conversation.other_user?.name
                                    : conversation.name
                                }
                            </h4>
                            <span className="conversation-time">
                                {conversation.last_message_at && 
                                    new Date(conversation.last_message_at).toLocaleTimeString()
                                }
                            </span>
                        </div>
                        
                        <div className="conversation-preview">
                            <p>
                                {conversation.last_message?.is_deleted 
                                    ? 'This message was deleted'
                                    : conversation.last_message?.message?.substring(0, 50) || 'No messages yet'
                                }
                            </p>
                            {conversation.unread_count > 0 && (
                                <span className="unread-badge">{conversation.unread_count}</span>
                            )}
                        </div>
                    </div>
                </div>
            ))}
            
            {conversations.length === 0 && (
                <div className="no-conversations">
                    <p>No conversations yet</p>
                </div>
            )}
        </div>
    );
};

export default ConversationList;