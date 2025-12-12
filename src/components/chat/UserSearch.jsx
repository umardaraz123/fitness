import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../../config/axios.config';

const UserSearch = ({ onClose, onSelectUser }) => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);
    
    const currentSearchTermRef = useRef('');
    const searchTimeoutRef = useRef(null);

    useEffect(() => {
        const term = searchTerm.trim();
        currentSearchTermRef.current = term;
        
        // Clear previous timeout
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        
        if (term) {
            setHasSearched(true);
            searchTimeoutRef.current = setTimeout(() => {
                // Only search if the term hasn't changed during the delay
                if (currentSearchTermRef.current === term) {
                    searchUsers(term);
                }
            }, 500);
        } else {
            setUsers([]);
            setError(null);
            setHasSearched(false);
        }
        
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [searchTerm]);

    const searchUsers = async (term) => {
        try {
            setLoading(true);
            setError(null);
            
            // Use chatAPI searchUsers method if available, otherwise use direct API call
            const response = await axiosInstance.get(`/chat/search-users?search=${encodeURIComponent(term)}`);
            
            // Check if this response is still relevant
            if (currentSearchTermRef.current !== term) {
                return;
            }
            
            if (response.data.success) {
                const usersData = response.data.users || response.data.data || [];
                setUsers(usersData);
            } else {
                setError(response.data.message || 'Failed to search users');
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
                // Try alternative endpoint
                try {
                    const altResponse = await axiosInstance.get(`/api/users/search?q=${encodeURIComponent(term)}`);
                    if (altResponse.data.success) {
                        setUsers(altResponse.data.data || []);
                        setError(null);
                        return;
                    }
                } catch (altError) {
                    setError('Search endpoint not found');
                }
            } else if (error.message === 'Network Error') {
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
        if (e.key === 'Enter' && users.length === 1) {
            handleUserSelect(users[0]);
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
                            alt={user.name || user.email}
                            onError={(e) => {
                                e.target.src = '/default-avatar.png';
                            }}
                        />
                    </div>
                    <div className="user-info">
                        <h4 className="user-name">{user.name || user.email}</h4>
                        {user.name && user.email && <span className="user-email">{user.email}</span>}
                        {user.isOnline && <span className="online-indicator">• Online</span>}
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
                    <small>Start typing to find users to chat with</small>
                </div>
            );
        }
        
        return null;
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content user-search-modal" onClick={(e) => e.stopPropagation()}>
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
                        <div className="search-input-wrapper">
                            <span className="search-icon">🔍</span>
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