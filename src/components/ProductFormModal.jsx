import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { productAPI } from '../services/api.service';
import { useToast } from '../context/ToastContext';
import { getErrorMessage } from '../utils/errorHandler';

const ProductFormModal = ({ isOpen, onClose, product, onSave }) => {
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: '',
    price: '',
    discount_price: '',
    status: 'active',
    is_featured: 0,
    benefits: '',
    suggested_use: '',
    nutritional_information: '',
    flavor: '',
    image: null,
    gallery_images: []
  });
  const [imagePreview, setImagePreview] = useState('');
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getCategories();
      if (response.success) {
        const productCategories = (response.data || []).filter(cat => cat.type === 'products');
        setCategories(productCategories);
      } else {
        showError('Failed to load categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      showError(getErrorMessage(error, 'Failed to load categories'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (product && isOpen) {
      // Set form data from existing product
      setFormData({
        name: product.name || '',
        description: product.description || '',
        category_id: product.category_id || product.category?.id || '',
        price: product.price || '',
        discount_price: product.discount_price || '',
        status: product.status || 'active',
        is_featured: product.is_featured ? 1 : 0,
        benefits: product.benefits || '',
        suggested_use: product.suggested_use || '',
        nutritional_information: product.nutritional_information || '',
        flavor: product.flavor || '',
        image: null,
        gallery_images: []
      });

      // Set main image preview - check multiple possible image paths
      const mainImageUrl = product.image_url || 
                          product.image?.url || 
                          (product.gallery_images && product.gallery_images.length > 0 ? product.gallery_images[0].image_url : '');
      setImagePreview(mainImageUrl || '');

      // Set gallery images previews using image_url
      const galleryUrls = (product.gallery_images || [])
        .map(img => img.image_url || img.url || img) // Try image_url first, then fallback to url or the object itself
        .filter(url => {
          // Filter out empty URLs and avoid duplicating the main image
          if (!url) return false;
          // If this URL matches the main image preview, exclude it from gallery
          return url !== mainImageUrl;
        });
      
      setGalleryPreviews(galleryUrls.map(url => ({ url, isExisting: true })));
    } else if (isOpen) {
      // Reset form for new product
      resetForm();
    }
    setErrors({});
  }, [product, isOpen]);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category_id: '',
      price: '',
      discount_price: '',
      status: 'active',
      is_featured: 0,
      benefits: '',
      suggested_use: '',
      nutritional_information: '',
      flavor: '',
      image: null,
      gallery_images: []
    });
    setImagePreview('');
    setGalleryPreviews([]);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      // File inputs are handled separately
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showError('Please select a valid image file');
      e.target.value = ''; // Reset file input
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showError('Image size should be less than 5MB');
      e.target.value = '';
      return;
    }

    setFormData(prev => ({ ...prev, image: file }));
    
    // Create preview
    const reader = new FileReader();
    reader.onloadstart = () => setImageLoading(true);
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setImageLoading(false);
    };
    reader.onerror = () => {
      showError('Failed to load image');
      setImageLoading(false);
      e.target.value = '';
    };
    reader.readAsDataURL(file);
  };

  const handleGalleryImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const validFiles = [];
    const invalidFiles = [];

    // Validate each file
    files.forEach(file => {
      if (!file.type.startsWith('image/')) {
        invalidFiles.push(file.name);
      } else if (file.size > 5 * 1024 * 1024) {
        invalidFiles.push(`${file.name} (too large)`);
      } else {
        validFiles.push(file);
      }
    });

    // Show error for invalid files
    if (invalidFiles.length > 0) {
      showError(`Invalid files: ${invalidFiles.join(', ')}. Please select valid images under 5MB.`);
    }

    if (validFiles.length === 0) {
      e.target.value = '';
      return;
    }

    // Check total gallery images limit (e.g., max 10)
    const totalAfterAdd = formData.gallery_images.length + validFiles.length;
    if (totalAfterAdd > 10) {
      showError('Maximum 10 gallery images allowed');
      e.target.value = '';
      return;
    }

    setFormData(prev => ({ 
      ...prev, 
      gallery_images: [...prev.gallery_images, ...validFiles]
    }));

    // Create previews for valid files
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGalleryPreviews(prev => [...prev, {
          url: reader.result,
          name: file.name,
          type: file.type,
          isExisting: false // Mark as new upload
        }]);
      };
      reader.onerror = () => {
        showError(`Failed to load image: ${file.name}`);
      };
      reader.readAsDataURL(file);
    });

    e.target.value = ''; // Reset file input
  };

  const removeMainImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setImagePreview('');
    // Reset file input
    const fileInput = document.getElementById('image');
    if (fileInput) fileInput.value = '';
  };

  const removeGalleryImage = (index) => {
    // Check if it's an existing image or a new upload
    const isExistingImage = galleryPreviews[index]?.isExisting;
    
    if (isExistingImage) {
      // For existing images, we need to handle deletion differently
      // You might want to add to a "toDelete" array or handle in your API
      console.log('Removing existing gallery image at index:', index);
    }
    
    setFormData(prev => ({
      ...prev,
      gallery_images: prev.gallery_images.filter((_, i) => i !== index)
    }));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category_id) newErrors.category_id = 'Category is required';
    
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(formData.price) || parseFloat(formData.price) < 0) {
      newErrors.price = 'Price must be a valid positive number';
    }
    
    if (formData.discount_price && 
        (isNaN(formData.discount_price) || parseFloat(formData.discount_price) < 0)) {
      newErrors.discount_price = 'Discount price must be a valid positive number';
    }
    
    if (formData.discount_price && parseFloat(formData.discount_price) >= parseFloat(formData.price)) {
      newErrors.discount_price = 'Discount price must be less than regular price';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showError('Please fix the validation errors before submitting');
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Append all basic fields
      const fields = [
        'name', 'description', 'category_id', 'price', 'status', 'is_featured',
        'discount_price', 'benefits', 'suggested_use', 'nutritional_information', 'flavor'
      ];
      
      fields.forEach(field => {
        if (formData[field] !== '' && formData[field] !== null) {
          formDataToSend.append(field, formData[field]);
        }
      });

      // Add main image if selected
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }
      
      // // Add gallery images
      // formData.gallery_images.forEach((file) => {
      //   formDataToSend.append('gallery_images[]', file);
      // });

      // Step 4: Append gallery images with dynamic keys like gallery_images_1, gallery_images_2, etc.
      formData.gallery_images.forEach((file, index) => {
        formDataToSend.append(`gallery_images_${index + 1}`, file);  // Dynamically appending with index
      });

      // If editing, include the product GUID
      if (product) {
        formDataToSend.append('_method', 'PUT'); // For Laravel or similar frameworks
      }

      let response;
      if (product) {
        response = await productAPI.updateProduct(product.guid, formDataToSend);
      } else {
        response = await productAPI.createProduct(formDataToSend);
      }

      if (response.success) {
        const successMessage = product ? 'Product updated successfully' : 'Product created successfully';
        showSuccess(successMessage);
        onSave();
        onClose();
        resetForm();
      } else {
        throw new Error(response.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      
      // Handle validation errors from backend
      if (error.response?.data?.errors) {
        const backendErrors = error.response.data.errors;
        setErrors(backendErrors);
        
        // Show first error as toast
        const firstError = Object.values(backendErrors)[0];
        if (firstError) {
          showError(Array.isArray(firstError) ? firstError[0] : firstError);
        }
      } else {
        showError(getErrorMessage(error, 'Failed to save product'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      resetForm();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content product-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{product ? 'Edit Product' : 'Create New Product'}</h2>
          <button 
            className="modal-close" 
            onClick={handleClose}
            disabled={loading}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-grid">
            {/* Basic Information */}
            <div className="form-section full-width">
              <h3>Basic Information</h3>
            </div>

            <div className="form-group full-width">
              <label htmlFor="name">Product Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                className={errors.name ? 'error' : ''}
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
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
                placeholder="Enter product description"
                disabled={loading}
              />
              {errors.description && <span className="error-text">{errors.description}</span>}
            </div>

            {/* Category and Pricing */}
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

            <div className="form-group">
              <label htmlFor="price">Price *</label>
              <input
                type="number"
                step="0.01"
                min="0"
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
              <label htmlFor="discount_price">Discount Price</label>
              <input
                type="number"
                step="0.01"
                min="0"
                id="discount_price"
                name="discount_price"
                className={errors.discount_price ? 'error' : ''}
                value={formData.discount_price}
                onChange={handleChange}
                placeholder="0.00"
                disabled={loading}
              />
              {errors.discount_price && <span className="error-text">{errors.discount_price}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="is_featured" className="checkbox-label">
                <input
                  type="checkbox"
                  id="is_featured"
                  name="is_featured"
                  checked={formData.is_featured === 1}
                  onChange={handleChange}
                  disabled={loading}
                />
                Featured Product
              </label>
            </div>

            {/* Additional Information */}
            <div className="form-section full-width">
              <h3>Additional Information</h3>
            </div>

            <div className="form-group full-width">
              <label htmlFor="benefits">Benefits</label>
              <textarea
                id="benefits"
                name="benefits"
                rows="3"
                value={formData.benefits}
                onChange={handleChange}
                placeholder="Enter product benefits"
                disabled={loading}
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="suggested_use">Suggested Use</label>
              <textarea
                id="suggested_use"
                name="suggested_use"
                rows="3"
                value={formData.suggested_use}
                onChange={handleChange}
                placeholder="Enter suggested use"
                disabled={loading}
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="nutritional_information">Nutritional Information</label>
              <textarea
                id="nutritional_information"
                name="nutritional_information"
                rows="3"
                value={formData.nutritional_information}
                onChange={handleChange}
                placeholder="Enter nutritional information"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="flavor">Flavor</label>
              <input
                type="text"
                id="flavor"
                name="flavor"
                value={formData.flavor}
                onChange={handleChange}
                placeholder="e.g., Vanilla, Chocolate"
                disabled={loading}
              />
            </div>

            {/* Images */}
            <div className="form-section full-width">
              <h3>Product Images</h3>
              <p className="form-hint">Supported formats: JPG, PNG, WebP. Max file size: 5MB</p>
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
              
              {(imagePreview || imageLoading) && (
                <div className="image-preview-container">
                  {imageLoading ? (
                    <div className="image-loading">Loading image...</div>
                  ) : (
                    <>
                      <img 
                        src={imagePreview} 
                        alt="Main Preview" 
                        className="image-preview"
                        onError={(e) => {
                          console.error('Failed to load image preview');
                          e.target.style.display = 'none';
                        }}
                      />
                      <button
                        type="button"
                        onClick={removeMainImage}
                        className="remove-image-btn"
                        disabled={loading}
                      >
                        ×
                      </button>
                    </>
                  )}
                </div>
              )}
              {errors.image && <span className="error-text">{errors.image}</span>}
            </div>

            <div className="form-group full-width">
              <label htmlFor="gallery_images">
                Gallery Images (Max 10 images)
              </label>
              <input
                type="file"
                id="gallery_images"
                name="gallery_images"
                accept="image/*"
                multiple
                onChange={handleGalleryImagesChange}
                disabled={loading || galleryPreviews.length >= 10}
              />
              <p className="form-hint">
                {galleryPreviews.length}/10 images selected
                {galleryPreviews.some(img => img.isExisting) && ' (including existing images)'}
              </p>
              
              {galleryPreviews.length > 0 && (
                <div className="gallery-previews">
                  {galleryPreviews.map((preview, index) => (
                    <div key={index} className="gallery-preview-item">
                      <img 
                        src={preview.url} 
                        alt={`Gallery preview ${index + 1}`}
                        className="gallery-preview"
                        onError={(e) => {
                          console.error('Failed to load gallery image preview');
                          e.target.style.display = 'none';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="remove-image-btn"
                        disabled={loading}
                        title={preview.isExisting ? 'Remove existing image' : 'Remove new image'}
                      >
                        ×
                      </button>
                      {preview.isExisting && (
                        <div className="existing-image-badge">Existing</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {errors.gallery_images && <span className="error-text">{errors.gallery_images}</span>}
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={handleClose}
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
                  {product ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                product ? 'Update Product' : 'Create Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;