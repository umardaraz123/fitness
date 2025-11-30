import React, { useState, useEffect } from 'react';
import axiosInstance from '../../config/axios.config';

const GroupCreator = ({ onClose, onCreateGroup }) => {
    const [groupName, setGroupName] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Reset form when component mounts
    useEffect(() => {
        setGroupName('');
        setSelectedUsers([]);
        setUsers([]);
        setSearchTerm('');
        setError(null);
    }, []);

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            searchUsers();
        }, 300);

        return () => clearTimeout(delaySearch);
    }, [searchTerm]);

    const searchUsers = async () => {
        if (!searchTerm.trim()) {
            setUsers([]);
            setError(null);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            
            const response = await axiosInstance.get(`/chat/search-users?search=${encodeURIComponent(searchTerm)}`);
            
            if (response.data.success) {
                setUsers(response.data.users || []);
            } else {
                setError('Failed to search users');
                setUsers([]);
            }
        } catch (error) {
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
            setLoading(false);
        }
    };

    const toggleUserSelection = (user) => {
        setSelectedUsers(prev => 
            prev.find(u => u.id === user.id)
                ? prev.filter(u => u.id !== user.id)
                : [...prev, user]
        );
    };

    const handleCreateGroup = () => {
        if (!groupName.trim()) {
            setError('Please provide a group name');
            return;
        }

        if (selectedUsers.length === 0) {
            setError('Please select at least one user');
            return;
        }

        setError(null);
        
        onCreateGroup({
            name: groupName.trim(),
            user_ids: selectedUsers.map(user => user.id),
            description: `Group chat for ${groupName}`
        });
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Escape') {
            onClose();
        } else if (e.key === 'Enter' && groupName.trim() && selectedUsers.length > 0) {
            handleCreateGroup();
        }
    };

    const removeSelectedUser = (user) => {
        setSelectedUsers(prev => prev.filter(u => u.id !== user.id));
    };

    const clearAllSelected = () => {
        setSelectedUsers([]);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Create New Group</h3>
                    <button 
                        onClick={onClose}
                        className="close-btn"
                        aria-label="Close group creator"
                    >
                        ×
                    </button>
                </div>

                <div className="modal-body">
                    {error && (
                        <div className="error-message">
                            {error}
                            <button 
                                onClick={() => setError(null)}
                                className="error-close"
                            >
                                ×
                            </button>
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="group-name">Group Name *</label>
                        <input
                            id="group-name"
                            type="text"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="Enter group name"
                            maxLength={100}
                            autoFocus
                        />
                        <div className="character-count">
                            {groupName.length}/100
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="user-search">Add Members *</label>
                        <input
                            id="user-search"
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="Search users by name or email..."
                            disabled={loading}
                        />
                        
                        {loading && (
                            <div className="loading-state">
                                <div className="loading-spinner"></div>
                                <span>Searching users...</span>
                            </div>
                        )}
                        
                        <div className="user-search-results">
                            {users.map(user => (
                                <div 
                                    key={user.id}
                                    className={`user-item ${
                                        selectedUsers.find(u => u.id === user.id) ? 'selected' : ''
                                    }`}
                                    onClick={() => toggleUserSelection(user)}
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
                                        <span className="user-name">{user.name}</span>
                                        <span className="user-email">{user.email}</span>
                                    </div>
                                    <div className="selection-indicator">
                                        {selectedUsers.find(u => u.id === user.id) ? '✓' : '+'}
                                    </div>
                                </div>
                            ))}
                            
                            {!loading && searchTerm && users.length === 0 && (
                                <div className="no-results">
                                    No users found for "{searchTerm}"
                                </div>
                            )}
                        </div>
                    </div>

                    {selectedUsers.length > 0 && (
                        <div className="selected-users-section">
                            <div className="section-header">
                                <h4>Selected Members ({selectedUsers.length})</h4>
                                <button 
                                    onClick={clearAllSelected}
                                    className="clear-all-btn"
                                >
                                    Clear All
                                </button>
                            </div>
                            <div className="selected-users-list">
                                {selectedUsers.map(user => (
                                    <div key={user.id} className="selected-user">
                                        <div className="selected-user-info">
                                            <img 
                                                src={user.avatar || '/default-avatar.png'} 
                                                alt={user.name}
                                                onError={(e) => {
                                                    e.target.src = '/default-avatar.png';
                                                }}
                                            />
                                            <span>{user.name}</span>
                                        </div>
                                        <button 
                                            onClick={() => removeSelectedUser(user)}
                                            className="remove-user-btn"
                                            aria-label={`Remove ${user.name}`}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    <button 
                        onClick={onClose}
                        className="btn-secondary"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleCreateGroup}
                        disabled={!groupName.trim() || selectedUsers.length === 0 || loading}
                        className="btn-primary"
                    >
                        {loading ? 'Creating...' : `Create Group (${selectedUsers.length})`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GroupCreator;