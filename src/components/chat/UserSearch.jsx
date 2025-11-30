import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../../config/axios.config';

const UserSearch = ({ onClose, onSelectUser }) => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);
    
    // Use ref to track the current search term to avoid race conditions
    const currentSearchTermRef = useRef('');

    useEffect(() => {
        const term = searchTerm.trim();
        currentSearchTermRef.current = term;
        
        if (term) {
            setHasSearched(true);
            const delaySearch = setTimeout(() => {
                // Only search if the term hasn't changed during the delay
                if (currentSearchTermRef.current === term) {
                    searchUsers(term);
                }
            }, 500); // Increased debounce time
            return () => clearTimeout(delaySearch);
        } else {
            setUsers([]);
            setError(null);
            setHasSearched(false);
        }
    }, [searchTerm]);

    const searchUsers = async (term) => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await axiosInstance.get(`/chat/search-users?search=${encodeURIComponent(term)}`);
            
            // Check if this response is still relevant
            if (currentSearchTermRef.current !== term) {
                return;
            }
            
            if (response.data.success) {
                setUsers(response.data.users || []);
            } else {
                setError('Failed to search users');
                setUsers([]);
            }
        } catch (error) {
            // Check if this error is still relevant
            if (currentSearchTermRef.current !== term) {
                return;
            }
            
            console.error('Failed to search users:', error);
            
            // Handle different error types
            if (error.response?.status === 401) {
                setError('Please login to search users');
            } else if (error.response?.status === 403) {
                setError('You do not have permission to search users');
            } else if (error.response?.status === 404) {
                setError('Search endpoint not found');
            } else if (error.isNetworkError) {
                setError('Network error. Please check your connection');
            } else {
                setError(error.response?.data?.message || 'Failed to search users');
            }
            
            setUsers([]);
        } finally {
            // Only update loading state if this is still the current search
            if (currentSearchTermRef.current === term) {
                setLoading(false);
            }
        }
    };

    const handleUserSelect = (user) => {
        onSelectUser(user);
        onClose();
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const retrySearch = () => {
        if (searchTerm.trim()) {
            searchUsers(searchTerm.trim());
        }
    };

    // Determine what to show in the results area
    const renderResultsContent = () => {
        if (loading) {
            return (
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <span>Searching users...</span>
                </div>
            );
        }
        
        if (error) {
            return (
                <div className="error-state">
                    <span className="error-message">{error}</span>
                    <button 
                        onClick={retrySearch}
                        className="retry-btn"
                    >
                        Retry
                    </button>
                </div>
            );
        }
        
        if (users.length > 0) {
            return users.map(user => (
                <div 
                    key={user.id}
                    className="user-item"
                    onClick={() => handleUserSelect(user)}
                >
                    <div className="user-avatar">
                        <img 
                            src={user.avatar || '/default-avatar.png'} 
                            alt={user.name}
                            onError={(e) => {
                                e.target.src = '/default-avatar.png';
                            }}
                        />
                    </div>
                    <div className="user-info">
                        <h4 className="user-name">{user.name}</h4>
                        <span className="user-email">{user.email}</span>
                        {user.isOnline && <span className="online-indicator">Online</span>}
                    </div>
                </div>
            ));
        }
        
        if (hasSearched && searchTerm) {
            return (
                <div className="no-results">
                    <p>No users found for "{searchTerm}"</p>
                    <small>Try searching with a different name or email</small>
                </div>
            );
        }
        
        if (!searchTerm) {
            return (
                <div className="search-prompt">
                    <p>Enter a name or email to search for users</p>
                </div>
            );
        }
        
        return null;
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>New Chat</h3>
                    <button 
                        onClick={onClose}
                        className="close-btn"
                        aria-label="Close search"
                    >
                        ×
                    </button>
                </div>

                <div className="modal-body">
                    <div className="form-group">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyPress}
                            placeholder="Search users by name or email..."
                            autoFocus
                            disabled={loading}
                        />
                    </div>

                    <div className="user-search-results">
                        {renderResultsContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserSearch;