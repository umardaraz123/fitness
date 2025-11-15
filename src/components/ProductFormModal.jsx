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

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const response = await productAPI.getCategories();
      if (response.success) {
        // Filter only product categories
        const productCategories = (response.data || []).filter(cat => cat.type === 'products');
        setCategories(productCategories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      showError('Failed to load categories');
    }
  };

  useEffect(() => {
    if (product) {
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
      // Use gallery images URL for preview
      const mainImageUrl = product.gallery_images && product.gallery_images.length > 0 
        ? product.gallery_images[0].url 
        : '';
      setImagePreview(mainImageUrl);
      // Map gallery_images array to get URLs
      const galleryUrls = (product.gallery_images || []).map(img => img.url || img);
      setGalleryPreviews(galleryUrls);
    } else {
      // Reset form for new product
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
    }
    setErrors({});
  }, [product, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
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
    if (files.length > 0) {
      setFormData(prev => ({ 
        ...prev, 
        gallery_images: [...prev.gallery_images, ...files]
      }));
      
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setGalleryPreviews(prev => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeGalleryImage = (index) => {
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
    if (!formData.price) newErrors.price = 'Price is required';
    if (formData.price && isNaN(formData.price)) newErrors.price = 'Price must be a number';
    
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
      formDataToSend.append('category_id', formData.category_id);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('status', formData.status);
      formDataToSend.append('is_featured', formData.is_featured);
      
      if (formData.discount_price) {
        formDataToSend.append('discount_price', formData.discount_price);
      }
      if (formData.benefits) {
        formDataToSend.append('benefits', formData.benefits);
      }
      if (formData.suggested_use) {
        formDataToSend.append('suggested_use', formData.suggested_use);
      }
      if (formData.nutritional_information) {
        formDataToSend.append('nutritional_information', formData.nutritional_information);
      }
      if (formData.flavor) {
        formDataToSend.append('flavor', formData.flavor);
      }
      
      // Add main image
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }
      
      // Add gallery images
      formData.gallery_images.forEach((file) => {
        formDataToSend.append('gallery_images[]', file);
      });

      let response;
      if (product) {
        response = await productAPI.updateProduct(product.guid, formDataToSend);
      } else {
        response = await productAPI.createProduct(formDataToSend);
      }

      if (response.success) {
        showSuccess(product ? 'Product updated successfully' : 'Product created successfully');
        onSave();
        onClose();
      }
    } catch (error) {
      console.error('Error saving product:', error);
      
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
      <div className="modal-content product-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{product ? 'Edit Product' : 'Create New Product'}</h2>
          <button className="modal-close" onClick={onClose}>
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
                id="discount_price"
                name="discount_price"
                value={formData.discount_price}
                onChange={handleChange}
                placeholder="0.00"
                disabled={loading}
              />
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
                <div style={{ marginTop: '10px' }}>
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
                disabled={loading}
              />
              {galleryPreviews.length > 0 && (
                <div style={{ 
                  display: 'flex', 
                  gap: '12px', 
                  marginTop: '12px', 
                  flexWrap: 'wrap' 
                }}>
                  {galleryPreviews.map((preview, index) => (
                    <div key={index} style={{ position: 'relative' }}>
                      <img 
                        src={preview} 
                        alt={`Preview ${index + 1}`} 
                        style={{ 
                          width: '100px', 
                          height: '100px', 
                          objectFit: 'cover', 
                          borderRadius: '8px',
                          border: '1px solid #3a3a3a'
                        }} 
                      />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        style={{
                          position: 'absolute',
                          top: '-8px',
                          right: '-8px',
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: '#ff4444',
                          border: 'none',
                          color: '#fff',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px',
                          fontWeight: 'bold'
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
              {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;
