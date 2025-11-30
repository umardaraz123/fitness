import React, { useState, useRef } from 'react';

const MessageInput = ({ onSendMessage }) => {
    const [message, setMessage] = useState('');
    const [attachment, setAttachment] = useState(null);
    const [replyTo, setReplyTo] = useState(null);
    const fileInputRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (message.trim() || attachment) {
            onSendMessage(message, attachment, replyTo?.id);
            setMessage('');
            setAttachment(null);
            setReplyTo(null);
        }
    };

    const handleAttachment = (e) => {
        const file = e.target.files[0];
        if (file) {
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

    return (
        <div className="message-input">
            {/* Reply Preview */}
            {replyTo && (
                <div className="reply-preview">
                    <div className="reply-info">
                        <strong>Replying to {replyTo.user?.name}</strong>
                        <p>{replyTo.message}</p>
                    </div>
                    <button onClick={removeReply}>×</button>
                </div>
            )}

            {/* Attachment Preview */}
            {attachment && (
                <div className="attachment-preview">
                    <span>{attachment.name}</span>
                    <button onClick={removeAttachment}>×</button>
                </div>
            )}

            <form onSubmit={handleSubmit} className="message-form">
                <div className="input-actions">
                    <button 
                        type="button"
                        className="btn-attachment"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        📎
                    </button>
                    
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleAttachment}
                        style={{ display: 'none' }}
                        accept="image/*,.pdf,.doc,.docx,.txt"
                    />
                </div>

                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="message-text-input"
                />

                <button 
                    type="submit" 
                    disabled={!message.trim() && !attachment}
                    className="btn-send"
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default MessageInput;