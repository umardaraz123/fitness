import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { productAPI } from '../services/api.service';
import { useToast } from '../context/ToastContext';
import { getErrorMessage } from '../utils/errorHandler';

const CategoryFormModal = ({ isOpen, onClose, category, categories, onSave }) => {
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_active: 1,
    type: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
        is_active: category.is_active ? 1 : 0,
        type: category.type || ''
      });
    } else {
      // Reset form for new category
      setFormData({
        name: '',
        description: '',
        is_active: 1,
        type: ''
      });
    }
    setErrors({});
  }, [category, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'is_active' ? parseInt(value) : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Category name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    
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
      const payload = {
        name: formData.name,
        description: formData.description,
        is_active: formData.is_active,
        type: formData.type
      };

      let response;
      if (category) {
        response = await productAPI.updateCategory(category.guid, payload);
      } else {
        response = await productAPI.createCategory(payload);
      }

      if (response.success) {
        showSuccess(category ? 'Category updated successfully' : 'Category created successfully');
        onSave();
        onClose();
      }
    } catch (error) {
      console.error('Error saving category:', error);
      
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
      <div className="modal-content category-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{category ? 'Edit Category' : 'Create New Category'}</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="category-form">
          <div className="form-grid">
            {/* Basic Information */}
            <div className="form-section full-width">
              <h3>Basic Information</h3>
            </div>

            <div className="form-group full-width">
              <label htmlFor="name">Category Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                className={errors.name ? 'error' : ''}
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Workout Plans"
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
                placeholder="Enter category description"
                disabled={loading}
              />
              {errors.description && <span className="error-text">{errors.description}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="type">Type</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="">Select Type</option>
                <option value="workout">Workout</option>
                <option value="meals">Meals</option>
                <option value="products">Products</option>
              </select>
            </div>

            {/* Status */}
            <div className="form-group">
              <label htmlFor="is_active">Status</label>
              <select
                id="is_active"
                name="is_active"
                value={formData.is_active}
                onChange={handleChange}
                disabled={loading}
              >
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>
            </div>
          </div>

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
              className="btn-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  {category ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                category ? 'Update Category' : 'Create Category'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryFormModal;
