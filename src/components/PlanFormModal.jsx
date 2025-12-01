import React, { useState, useEffect } from 'react';
import { X, Trash2, AlertTriangle } from 'lucide-react';
import { planAPI } from '../services/api.service';
import { useToast } from '../context/ToastContext';
import { getErrorMessage } from '../utils/errorHandler';
import { useGalleryImages } from '../hooks/reduxHooks';
import GalleryImageDeleteModal from './GalleryImageDeleteModal';

const PlanFormModal = ({ isOpen, onClose, plan, onSave }) => {
  const { showSuccess, showError } = useToast();
  const { 
    deleteImage, 
    deleteLoading, 
    deleteError,
    clearDeleteError,
    successMessage,
    clearSuccessMessage
  } = useGalleryImages();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    short_description: '',
    description: '',
    plan_type: 'ONE_TIME',
    plan_category: 'WORKOUT',
    fitness_goal: 'MAINTENANCE',
    intensity_level: 'BEGINNER',
    price: '',
    sale_price: '',
    duration_days: '',
    workouts_per_week: '',
    is_active: 1,
    is_featured: 0,
    image: null,
    gallery_images: [],
    equipment_required: []
  });
  const [imagePreview, setImagePreview] = useState('');
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [existingGalleryImages, setExistingGalleryImages] = useState([]);
  const [equipmentInput, setEquipmentInput] = useState('');
  const [errors, setErrors] = useState({});
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);

  useEffect(() => {
    if (plan) {
      // Parse equipment_required if it's a string
      let equipment = [];
      if (plan.equipment_required) {
        if (typeof plan.equipment_required === 'string') {
          try {
            equipment = JSON.parse(plan.equipment_required);
          } catch (e) {
            equipment = plan.equipment_required.split(',').map(i => i.trim()).filter(i => i);
          }
        } else if (Array.isArray(plan.equipment_required)) {
          equipment = plan.equipment_required;
        }
      }

      setFormData({
        title: plan.title || '',
        short_description: plan.short_description || '',
        description: plan.description || '',
        plan_type: plan.plan_type || 'ONE_TIME',
        plan_category: plan.plan_category || 'WORKOUT',
        fitness_goal: plan.fitness_goal || 'MAINTENANCE',
        intensity_level: plan.intensity_level || 'BEGINNER',
        price: plan.price || '',
        sale_price: plan.sale_price || '',
        duration_days: plan.duration_days || '',
        workouts_per_week: plan.workouts_per_week || '',
        is_active: plan.is_active ? 1 : 0,
        is_featured: plan.is_featured ? 1 : 0,
        image: null,
        gallery_images: [],
        equipment_required: equipment
      });
      setImagePreview(plan.image || '');
      
      // Set existing gallery images from plan
      const existingImages = plan.gallery_images || [];
      setExistingGalleryImages(existingImages);
      
      // Set previews for existing images
      const existingPreviews = existingImages.map(img => img.url || img.image_url || img);
      setGalleryPreviews(existingPreviews);
    } else {
      // Reset form for new plan
      setFormData({
        title: '',
        short_description: '',
        description: '',
        plan_type: 'ONE_TIME',
        plan_category: 'WORKOUT',
        fitness_goal: 'MAINTENANCE',
        intensity_level: 'BEGINNER',
        price: '',
        sale_price: '',
        duration_days: '',
        workouts_per_week: '',
        is_active: 1,
        is_featured: 0,
        image: null,
        gallery_images: [],
        equipment_required: []
      });
      setImagePreview('');
      setGalleryPreviews([]);
      setExistingGalleryImages([]);
    }
    setErrors({});
    setEquipmentInput('');
  }, [plan, isOpen]);

  // Handle delete success and errors
  useEffect(() => {
    if (successMessage) {
      showSuccess(successMessage);
      clearSuccessMessage();
      // Refresh the plan data after successful deletion
      if (plan) {
        onSave(); // This will trigger parent to refresh plan data
      }
    }
    
    if (deleteError) {
      showError(deleteError.message || 'Failed to delete image');
      clearDeleteError();
    }
  }, [successMessage, deleteError, showSuccess, showError, clearSuccessMessage, clearDeleteError, plan, onSave]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : (name === 'is_active' ? parseInt(value) : value)
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleMainImageChange = (e) => {
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

  const handleGalleryImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setFormData(prev => ({
      ...prev,
      gallery_images: [...prev.gallery_images, ...files]
    }));

    // Create previews for new files only
    const newPreviews = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result);
        // When all previews are loaded, update state once
        if (newPreviews.length === files.length) {
          setGalleryPreviews(prev => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove newly added gallery image (not yet saved to server)
  const removeNewGalleryImage = (index) => {
    // Calculate the actual index in the galleryPreviews array
    const actualIndex = existingGalleryImages.length + index;
    
    setFormData(prev => ({
      ...prev,
      gallery_images: prev.gallery_images.filter((_, i) => i !== index)
    }));
    
    setGalleryPreviews(prev => prev.filter((_, i) => i !== actualIndex));
  };

  // Remove existing gallery image (already saved to server)
  const handleDeleteExistingImage = (image) => {
    setImageToDelete(image);
    setDeleteModalOpen(true);
  };

  const confirmDeleteImage = async (safeDelete = true) => {
    if (!imageToDelete) return;
    
    try {
      await deleteImage(imageToDelete.id, { safeDelete });
      setDeleteModalOpen(false);
      setImageToDelete(null);
      
      // Remove from existing images immediately for better UX
      setExistingGalleryImages(prev => 
        prev.filter(img => img.id !== imageToDelete.id)
      );
      setGalleryPreviews(prev => 
        prev.filter((preview, index) => {
          // Keep all previews except the one corresponding to the deleted image
          // Since existing images come first in galleryPreviews, we can use index
          if (index < existingGalleryImages.length) {
            return existingGalleryImages[index].id !== imageToDelete.id;
          }
          return true;
        })
      );
    } catch (error) {
      console.error('Error in delete confirmation:', error);
    }
  };

  // Clear main image
  const clearMainImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setImagePreview('');
  };

  const handleAddEquipment = () => {
    if (equipmentInput.trim()) {
      setFormData(prev => ({
        ...prev,
        equipment_required: [...prev.equipment_required, equipmentInput.trim()]
      }));
      setEquipmentInput('');
    }
  };

  const handleRemoveEquipment = (index) => {
    setFormData(prev => ({
      ...prev,
      equipment_required: prev.equipment_required.filter((_, i) => i !== index)
    }));
  };

  const handleEquipmentKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddEquipment();
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Plan title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
    
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
      
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('plan_type', formData.plan_type);
      formDataToSend.append('plan_category', formData.plan_category);
      formDataToSend.append('fitness_goal', formData.fitness_goal);
      formDataToSend.append('intensity_level', formData.intensity_level);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('is_active', formData.is_active);
      formDataToSend.append('is_featured', formData.is_featured);
      
      if (formData.short_description) formDataToSend.append('short_description', formData.short_description);
      if (formData.sale_price) formDataToSend.append('sale_price', formData.sale_price);
      if (formData.duration_days) formDataToSend.append('duration_days', formData.duration_days);
      if (formData.workouts_per_week) formDataToSend.append('workouts_per_week', formData.workouts_per_week);
      
      // Add main image
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }
      
      // Add new gallery images
      // formData.gallery_images.forEach((file) => {
      //   formDataToSend.append('gallery_images[]', file);
      // });

      formData.gallery_images.forEach((file, index) => {
        formDataToSend.append(`gallery_images_${index + 1}`, file);  // Dynamically appending with index
      });

      // Add equipment_required as JSON
      formDataToSend.append('equipment_required', JSON.stringify(formData.equipment_required));

      let response;
      if (plan) {
        response = await planAPI.updatePlan(plan.guid, formDataToSend);
      } else {
        response = await planAPI.createPlan(formDataToSend);
      }

      if (response.success) {
        showSuccess(plan ? 'Plan updated successfully' : 'Plan created successfully');
        onSave();
        onClose();
      }
    } catch (error) {
      console.error('Error saving plan:', error);
      
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
      
      // Show formatted validation errors or generic error message
      showError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const getTotalGalleryImagesCount = () => {
    return existingGalleryImages.length + formData.gallery_images.length;
  };

  const isDeleting = deleteLoading;

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content plan-form-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>{plan ? 'Edit Plan' : 'Create New Plan'}</h2>
            <button className="modal-close" onClick={onClose}>
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="plan-form">
            <div className="form-grid">
              {/* Basic Information */}
              <div className="form-section full-width">
                <h3>Basic Information</h3>
              </div>

              <div className="form-group full-width">
                <label htmlFor="title">Plan Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className={errors.title ? 'error' : ''}
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter plan title"
                  disabled={loading}
                />
                {errors.title && <span className="error-text">{errors.title}</span>}
              </div>

              <div className="form-group full-width">
                <label htmlFor="short_description">Short Description</label>
                <textarea
                  id="short_description"
                  name="short_description"
                  rows="2"
                  value={formData.short_description}
                  onChange={handleChange}
                  placeholder="Brief description"
                  disabled={loading}
                />
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
                  placeholder="Enter detailed description"
                  disabled={loading}
                />
                {errors.description && <span className="error-text">{errors.description}</span>}
              </div>

              {/* Plan Configuration */}
              <div className="form-section full-width">
                <h3>Plan Configuration</h3>
              </div>

              <div className="form-group">
                <label htmlFor="plan_type">Plan Type *</label>
                <select
                  id="plan_type"
                  name="plan_type"
                  value={formData.plan_type}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="ONE_TIME">One Time</option>
                  <option value="MEMBERSHIP">Membership</option>
                  <option value="SUBSCRIPTION">Subscription</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="plan_category">Plan Category *</label>
                <select
                  id="plan_category"
                  name="plan_category"
                  value={formData.plan_category}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="DIET">Diet</option>
                  <option value="WORKOUT">Workout</option>
                  <option value="COMPREHENSIVE">Comprehensive</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="fitness_goal">Fitness Goal *</label>
                <select
                  id="fitness_goal"
                  name="fitness_goal"
                  value={formData.fitness_goal}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="WEIGHT_LOSS">Weight Loss</option>
                  <option value="WEIGHT_GAIN">Weight Gain</option>
                  <option value="MAINTENANCE">Maintenance</option>
                  <option value="MUSCLE_BUILDING">Muscle Building</option>
                  <option value="ENDURANCE">Endurance</option>
                  <option value="FLEXIBILITY">Flexibility</option>
                  <option value="REHABILITATION">Rehabilitation</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="intensity_level">Intensity Level *</label>
                <select
                  id="intensity_level"
                  name="intensity_level"
                  value={formData.intensity_level}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                  <option value="PROFESSIONAL">Professional</option>
                </select>
              </div>

              {/* Pricing & Duration */}
              <div className="form-section full-width">
                <h3>Pricing & Duration</h3>
              </div>

              <div className="form-group">
                <label htmlFor="price">Price *</label>
                <input
                  type="number"
                  step="0.01"
                  id="price"
                  name="price"
                  className={errors.price ? 'error' : ''}
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  disabled={loading}
                />
                {errors.price && <span className="error-text">{errors.price}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="sale_price">Sale Price</label>
                <input
                  type="number"
                  step="0.01"
                  id="sale_price"
                  name="sale_price"
                  value={formData.sale_price}
                  onChange={handleChange}
                  placeholder="0.00"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="duration_days">Duration (Days)</label>
                <input
                  type="number"
                  id="duration_days"
                  name="duration_days"
                  value={formData.duration_days}
                  onChange={handleChange}
                  placeholder="84"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="workouts_per_week">Workouts Per Week</label>
                <input
                  type="number"
                  id="workouts_per_week"
                  name="workouts_per_week"
                  value={formData.workouts_per_week}
                  onChange={handleChange}
                  placeholder="5"
                  disabled={loading}
                />
              </div>

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

              <div className="form-group">
                <label htmlFor="is_featured" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    id="is_featured"
                    name="is_featured"
                    checked={formData.is_featured === 1}
                    onChange={handleChange}
                    disabled={loading}
                    style={{ cursor: 'pointer' }}
                  />
                  Featured Plan
                </label>
              </div>

              {/* Equipment Required */}
              <div className="form-section full-width">
                <h3>Equipment Required</h3>
              </div>

              <div className="form-group full-width">
                <label htmlFor="equipment-input">Add Equipment</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    id="equipment-input"
                    value={equipmentInput}
                    onChange={(e) => setEquipmentInput(e.target.value)}
                    onKeyPress={handleEquipmentKeyPress}
                    placeholder="Type equipment and press Enter"
                    disabled={loading}
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={handleAddEquipment}
                    className="btn-icon"
                    disabled={loading || !equipmentInput.trim()}
                    style={{
                      padding: '8px 16px',
                      background: 'var(--accent-color)',
                      color: '#000',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    +
                  </button>
                </div>
                {formData.equipment_required.length > 0 && (
                  <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {formData.equipment_required.map((equipment, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          background: '#2c2c2c',
                          borderRadius: '6px',
                          fontSize: '14px'
                        }}
                      >
                        <span>{equipment}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveEquipment(index)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#ff4444',
                            cursor: 'pointer',
                            padding: '0',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Images */}
              <div className="form-section full-width">
                <h3>Plan Images</h3>
                {getTotalGalleryImagesCount() > 0 && (
                  <div style={{ fontSize: '14px', color: '#888', marginTop: '4px' }}>
                    Total images: {getTotalGalleryImagesCount()}
                  </div>
                )}
              </div>

              <div className="form-group full-width">
                <label htmlFor="image">Main Image</label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleMainImageChange}
                  disabled={loading}
                />
                {imagePreview && (
                  <div style={{ marginTop: '10px', position: 'relative', display: 'inline-block' }}>
                    <img 
                      src={imagePreview} 
                      alt="Main Preview" 
                      style={{ 
                        width: '150px', 
                        height: '150px', 
                        objectFit: 'cover', 
                        borderRadius: '8px',
                        border: '1px solid #3a3a3a'
                      }} 
                    />
                    <button
                      type="button"
                      onClick={clearMainImage}
                      disabled={loading}
                      style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: '#ff4444',
                        border: 'none',
                        color: '#fff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px',
                        fontWeight: 'bold'
                      }}
                      title="Remove main image"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>

              <div className="form-group full-width">
                <label htmlFor="gallery_images">Gallery Images (Multiple)</label>
                <input
                  type="file"
                  id="gallery_images"
                  name="gallery_images"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryImagesChange}
                  disabled={loading || isDeleting}
                />
                
                {/* Gallery Images Preview */}
                {galleryPreviews.length > 0 && (
                  <div style={{ marginTop: '16px' }}>
                    <h4 style={{ marginBottom: '12px', fontSize: '16px', color: '#fff' }}>
                      Gallery Images ({getTotalGalleryImagesCount()})
                    </h4>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                      gap: '12px', 
                      marginTop: '12px'
                    }}>
                      {/* Existing Images (from server) */}
                      {existingGalleryImages.map((image, index) => (
                        <div key={`existing-${image.id}`} style={{ position: 'relative' }}>
                          <img 
                            src={image.url || image.image_url || image} 
                            alt={`Gallery ${index + 1}`} 
                            style={{ 
                              width: '100%', 
                              height: '120px', 
                              objectFit: 'cover', 
                              borderRadius: '8px',
                              border: '1px solid #3a3a3a'
                            }} 
                          />
                          <div style={{
                            position: 'absolute',
                            top: '4px',
                            right: '4px',
                            display: 'flex',
                            gap: '4px'
                          }}>
                            {image.is_featured && (
                              <div style={{
                                background: 'var(--accent-color)',
                                color: '#000',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontSize: '10px',
                                fontWeight: 'bold'
                              }}>
                                Featured
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDeleteExistingImage(image)}
                              disabled={isDeleting}
                              style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                background: '#ff4444',
                                border: 'none',
                                color: '#fff',
                                cursor: isDeleting ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                opacity: isDeleting ? 0.6 : 1
                              }}
                              title="Delete image"
                            >
                              {isDeleting ? '...' : <Trash2 size={14} />}
                            </button>
                          </div>
                          <div style={{
                            position: 'absolute',
                            bottom: '4px',
                            left: '4px',
                            right: '4px',
                            background: 'rgba(0,0,0,0.7)',
                            padding: '4px',
                            borderRadius: '4px',
                            fontSize: '10px',
                            color: '#fff',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap'
                          }}>
                            {image.file_name || `Image ${index + 1}`}
                          </div>
                        </div>
                      ))}
                      
                      {/* New Images (not yet saved to server) */}
                      {formData.gallery_images.map((file, index) => (
                        <div key={`new-${index}`} style={{ position: 'relative' }}>
                          <img 
                            src={galleryPreviews[existingGalleryImages.length + index]} 
                            alt={`New ${index + 1}`} 
                            style={{ 
                              width: '100%', 
                              height: '120px', 
                              objectFit: 'cover', 
                              borderRadius: '8px',
                              border: '2px dashed var(--accent-color)'
                            }} 
                          />
                          <button
                            type="button"
                            onClick={() => removeNewGalleryImage(index)}
                            disabled={loading}
                            style={{
                              position: 'absolute',
                              top: '-8px',
                              right: '-8px',
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              background: '#ff4444',
                              border: 'none',
                              color: '#fff',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '16px',
                              fontWeight: 'bold'
                            }}
                            title="Remove image"
                          >
                            ×
                          </button>
                          <div style={{
                            position: 'absolute',
                            bottom: '4px',
                            left: '4px',
                            right: '4px',
                            background: 'rgba(0,0,0,0.7)',
                            padding: '4px',
                            borderRadius: '4px',
                            fontSize: '10px',
                            color: '#fff',
                            textAlign: 'center'
                          }}>
                            New
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Warning for featured images */}
                    {existingGalleryImages.some(img => img.is_featured) && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginTop: '12px',
                        padding: '8px 12px',
                        background: 'rgba(255, 193, 7, 0.1)',
                        border: '1px solid rgba(255, 193, 7, 0.3)',
                        borderRadius: '6px',
                        fontSize: '14px',
                        color: '#ffc107'
                      }}>
                        <AlertTriangle size={16} />
                        <span>Deleting a featured image will automatically set another image as featured</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={onClose}
                disabled={loading || isDeleting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-submit"
                disabled={loading || isDeleting}
              >
                {loading ? 'Saving...' : plan ? 'Update Plan' : 'Create Plan'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <GalleryImageDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setImageToDelete(null);
        }}
        image={imageToDelete}
        onConfirm={confirmDeleteImage}
        mode="single"
      />
    </>
  );
};

export default PlanFormModal;