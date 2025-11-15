import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Upload, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { userAPI } from '../services/api.service';

const EditProfile = () => {
  const { user, updateUser } = useAuth();
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    profile_image: null
  });
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        profile_image: null
      });
      setImagePreview(user.profile_image || '');
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileData(prev => ({ ...prev, profile_image: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const names = name.trim().split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleSaveProfile = async () => {
    if (!profileData.name.trim()) {
      showError('Name is required');
      return;
    }
    if (!profileData.email.trim()) {
      showError('Email is required');
      return;
    }

    setLoading(true);

    try {
      // Use FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('name', profileData.name);
      formDataToSend.append('email', profileData.email);
      
      if (profileData.profile_image) {
        formDataToSend.append('profile_image', profileData.profile_image);
      }

      const response = await userAPI.updateProfile(formDataToSend);

      if (response.success) {
        showSuccess(response.message || 'Profile updated successfully');
        
        // Update global user state
        updateUser({
          name: profileData.name,
          email: profileData.email,
          profile_image: response.data?.profile_image || imagePreview
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-profile-section">
      <h2 className="edit-profile-title">Edit Profile</h2>
      
      <div className="edit-profile-form">
        {/* Profile Image Section */}
        <div className="form-group profile-image-section">
          <label className="form-label">Profile Image</label>
          <div className="profile-image-upload">
            <div className="profile-image-preview">
              {imagePreview ? (
                <img src={imagePreview} alt="Profile" />
              ) : (
                <div className="profile-initials">
                  {getInitials(profileData.name || user?.name)}
                </div>
              )}
            </div>
            <label htmlFor="profile-image-input" className="upload-btn">
              <Upload size={18} />
              Upload Image
            </label>
            <input
              type="file"
              id="profile-image-input"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Name *</label>
          <input
            type="text"
            name="name"
            value={profileData.name}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Enter your name"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email *</label>
          <input
            type="email"
            name="email"
            value={profileData.email}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Enter your email"
            disabled={loading}
          />
        </div>

        <button 
          className="save-profile-btn"
          onClick={handleSaveProfile}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
};

export default EditProfile;