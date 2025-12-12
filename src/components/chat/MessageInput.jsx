import React, { useState, useRef, useEffect } from 'react';

const MessageInput = ({ onSendMessage, loading, disabled }) => {
    const [message, setMessage] = useState('');
    const [attachment, setAttachment] = useState(null);
    const [replyTo, setReplyTo] = useState(null);
    const fileInputRef = useRef(null);
    
    // Clear input after successful send
    const clearInputs = () => {
        setMessage('');
        setAttachment(null);
        setReplyTo(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if ((message.trim() || attachment) && !loading && !disabled) {
            try {
                await onSendMessage(message, attachment, replyTo?.id);
                clearInputs();
            } catch (error) {
                console.error('Failed to send message:', error);
            }
        }
    };

    const handleAttachment = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (10MB limit)
            if (file.size > 10 * 1024 * 1024) {
                alert('File size must be less than 10MB');
                return;
            }
            
            // Validate file type
            const allowedTypes = [
                'image/jpeg', 'image/png', 'image/gif', 'image/webp',
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'text/plain'
            ];
            
            if (!allowedTypes.includes(file.type)) {
                alert('File type not supported. Please select an image, PDF, Word document, or text file.');
                return;
            }
            
            setAttachment(file);
        }
    };

    const removeAttachment = () => {
        setAttachment(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removeReply = () => {
        setReplyTo(null);
    };

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && message.trim()) {
                handleSubmit(e);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [message, attachment, replyTo, loading, disabled]);

    return (
        <div className="message-input">
            {/* Reply Preview */}
            {replyTo && (
                <div className="reply-preview">
                    <div className="reply-info">
                        <strong>Replying to {replyTo.user?.name || 'User'}</strong>
                        <p>{replyTo.message}</p>
                    </div>
                    <button 
                        type="button" 
                        onClick={removeReply}
                        className="btn-close"
                    >
                        ×
                    </button>
                </div>
            )}

            {/* Attachment Preview */}
            {attachment && (
                <div className="attachment-preview">
                    <span>{attachment.name}</span>
                    <button 
                        type="button"
                        onClick={removeAttachment}
                        className="btn-close"
                    >
                        ×
                    </button>
                </div>
            )}

            <form onSubmit={handleSubmit} className="message-form">
                <div className="input-actions">
                    <button 
                        type="button"
                        className="btn-attachment"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={disabled || loading}
                    >
                        📎
                    </button>
                    
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleAttachment}
                        style={{ display: 'none' }}
                        accept="image/*,.pdf,.doc,.docx,.txt"
                        disabled={disabled || loading}
                    />
                </div>

                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={disabled ? "Connecting to chat..." : "Type a message... (Ctrl+Enter to send)"}
                    className="message-text-input"
                    disabled={disabled || loading}
                />

                <button 
                    type="submit" 
                    disabled={(!message.trim() && !attachment) || disabled || loading}
                    className="btn-send"
                >
                    {loading ? 'Sending...' : 'Send'}
                </button>
            </form>
        </div>
    );
};

export default MessageInput;