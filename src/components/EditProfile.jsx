import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const EditProfile = () => {
  const [profileData, setProfileData] = useState({
    name: 'Jhen',
    email: 'jhen23@gmail.com',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = () => {
    console.log('Save profile:', profileData);
  };

  return (
    <div className="edit-profile-section">
      <h2 className="edit-profile-title">Edit Profile</h2>
      
      <div className="edit-profile-form">
        <div className="form-group">
          <label className="form-label">Name</label>
          <input
            type="text"
            name="name"
            value={profileData.name}
            onChange={handleInputChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            value={profileData.email}
            onChange={handleInputChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={profileData.password}
              onChange={handleInputChange}
              className="form-input"
              placeholder="•••••••"
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Confirm Password</label>
          <div className="password-input-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={profileData.confirmPassword}
              onChange={handleInputChange}
              className="form-input"
              placeholder="•••••••"
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button 
          className="save-profile-btn"
          onClick={handleSaveProfile}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default EditProfile;