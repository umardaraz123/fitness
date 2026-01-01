import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { workoutAPI } from '../services/api.service';
import { useToast } from '../context/ToastContext';
import { getErrorMessage } from '../utils/errorHandler';

const WorkoutFormModal = ({ isOpen, onClose, workout, categories, onSave }) => {
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration_minutes: '',
    category_id: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (workout) {
      setFormData({
        name: workout.name || '',
        description: workout.description || '',
        duration_minutes: workout.duration_minutes || '',
        category_id: workout.category_id || workout.category?.id || '',
        image: null
      });
      setImagePreview(workout.image || '');
    } else {
      // Reset form for new workout
      setFormData({
        name: '',
        description: '',
        duration_minutes: '',
        category_id: '',
        image: null
      });
      setImagePreview('');
    }
    setErrors({});
  }, [workout, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Workout name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category_id) newErrors.category_id = 'Category is required';
    if (!formData.duration_minutes) newErrors.duration_minutes = 'Duration is required';
    if (formData.duration_minutes && isNaN(formData.duration_minutes)) {
      newErrors.duration_minutes = 'Duration must be a number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showError('Please fill all required fields');
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('duration_minutes', formData.duration_minutes);
      formDataToSend.append('category_id', formData.category_id);
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      let response;
      if (workout) {
        response = await workoutAPI.updateWorkout(workout.guid, formDataToSend);
      } else {
        response = await workoutAPI.createWorkout(formDataToSend);
      }

      if (response.success) {
        showSuccess(workout ? 'Workout updated successfully' : 'Workout created successfully');
        onSave();
        onClose();
      }
    } catch (error) {
      console.error('Error saving workout:', error);
      
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
      
      // Show formatted validation errors or generic error message
      showError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content workout-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{workout ? 'Edit Workout' : 'Create New Workout'}</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form id="workout-form" onSubmit={handleSubmit} className="workout-form">
          <div className="form-grid">
            {/* Basic Information */}
            <div className="form-section full-width">
              <h3>Basic Information</h3>
            </div>

            <div className="form-group full-width">
              <label htmlFor="name">Workout Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                className={errors.name ? 'error' : ''}
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Full Body Strength Training"
                disabled={loading}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="form-group full-width">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                rows="4"
                className={errors.description ? 'error' : ''}
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter workout description"
                disabled={loading}
              />
              {errors.description && <span className="error-text">{errors.description}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="duration_minutes">Duration (minutes) *</label>
              <input
                type="number"
                id="duration_minutes"
                name="duration_minutes"
                className={errors.duration_minutes ? 'error' : ''}
                value={formData.duration_minutes}
                onChange={handleChange}
                placeholder="e.g., 45"
                disabled={loading}
              />
              {errors.duration_minutes && <span className="error-text">{errors.duration_minutes}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="category_id">Category *</label>
              <select
                id="category_id"
                name="category_id"
                className={errors.category_id ? 'error' : ''}
                value={formData.category_id}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category_id && <span className="error-text">{errors.category_id}</span>}
            </div>

            {/* Image */}
            <div className="form-section full-width">
              <h3>Workout Image</h3>
            </div>

            <div className="form-group full-width">
              <label htmlFor="image">Image</label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                disabled={loading}
              />
              {imagePreview && (
                <div className="image-preview-container">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="image-preview"
                  />
                </div>
              )}
            </div>
          </div>
        </form>

        <div className="form-actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="workout-form"
            className="btn-submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                {workout ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              workout ? 'Update Workout' : 'Create Workout'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutFormModal;
