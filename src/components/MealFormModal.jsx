import React, { useState, useEffect } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { mealAPI, productAPI } from '../services/api.service';
import { useToast } from '../context/ToastContext';
import { getErrorMessage } from '../utils/errorHandler';

const MealFormModal = ({ isOpen, onClose, meal, onSave }) => {
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
    price: '',
    sale_price: '',
    stock_quantity: '',
    category_id: '',
    calories: '',
    preparation_time: '',
    serving_size: '',
    is_featured: 0,
    is_best_selling: 0,
    status: 1,
    image: null,
    gallery_images: [],
    ingredients: [],
    nutrition_facts: {
      protein: '',
      carbs: '',
      fat: ''
    }
  });
  const [imagePreview, setImagePreview] = useState('');
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [ingredientInput, setIngredientInput] = useState('');
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
        // Filter only meal categories
        const mealCategories = (response.data || []).filter(cat => cat.type === 'meals');
        setCategories(mealCategories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      showError('Failed to load categories');
    }
  };

  useEffect(() => {
    if (meal) {
      // Parse nutrition_facts if it's a string
      let nutritionFacts = { protein: '', carbs: '', fat: '' };
      if (meal.nutrition_facts) {
        if (typeof meal.nutrition_facts === 'string') {
          try {
            nutritionFacts = JSON.parse(meal.nutrition_facts);
          } catch (e) {
            console.error('Failed to parse nutrition_facts:', e);
          }
        } else {
          nutritionFacts = meal.nutrition_facts;
        }
      }

      // Parse ingredients if it's a string
      let ingredients = [];
      if (meal.ingredients) {
        if (typeof meal.ingredients === 'string') {
          try {
            ingredients = JSON.parse(meal.ingredients);
          } catch (e) {
            // If it's a comma-separated string
            ingredients = meal.ingredients.split(',').map(i => i.trim()).filter(i => i);
          }
        } else if (Array.isArray(meal.ingredients)) {
          ingredients = meal.ingredients;
        }
      }

      setFormData({
        name: meal.name || '',
        type: meal.type || '',
        description: meal.description || '',
        price: meal.price || '',
        sale_price: meal.sale_price || '',
        stock_quantity: meal.stock_quantity || '',
        category_id: meal.category_id || meal.category?.id || '',
        calories: meal.calories || '',
        preparation_time: meal.preparation_time || '',
        serving_size: meal.serving_size || '',
        is_featured: meal.is_featured ? 1 : 0,
        is_best_selling: meal.is_best_selling ? 1 : 0,
        status: meal.status ? 1 : 0,
        image: null,
        gallery_images: [],
        ingredients: ingredients,
        nutrition_facts: nutritionFacts
      });
      setImagePreview(meal.image || '');
      const galleryUrls = (meal.gallery_images || []).map(img => img.url || img);
      setGalleryPreviews(galleryUrls);
    } else {
      // Reset form for new meal
      setFormData({
        name: '',
        type: '',
        description: '',
        price: '',
        sale_price: '',
        stock_quantity: '',
        category_id: '',
        calories: '',
        preparation_time: '',
        serving_size: '',
        is_featured: 0,
        is_best_selling: 0,
        status: 1,
        image: null,
        gallery_images: [],
        ingredients: [],
        nutrition_facts: {
          protein: '',
          carbs: '',
          fat: ''
        }
      });
      setImagePreview('');
      setGalleryPreviews([]);
    }
    setErrors({});
    setIngredientInput('');
  }, [meal, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : (name === 'status' ? parseInt(value) : value)
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleNutritionChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      nutrition_facts: {
        ...prev.nutrition_facts,
        [name]: value
      }
    }));
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
  };

  const removeGalleryImage = (index) => {
    setFormData(prev => ({
      ...prev,
      gallery_images: prev.gallery_images.filter((_, i) => i !== index)
    }));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddIngredient = () => {
    if (ingredientInput.trim()) {
      setFormData(prev => ({
        ...prev,
        ingredients: [...prev.ingredients, ingredientInput.trim()]
      }));
      setIngredientInput('');
    }
  };

  const handleRemoveIngredient = (index) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const handleIngredientKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddIngredient();
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Meal name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
    if (!formData.category_id) newErrors.category_id = 'Category is required';
    
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
      formDataToSend.append('is_best_selling', formData.is_best_selling);
      
      if (formData.type) formDataToSend.append('type', formData.type);
      if (formData.sale_price) formDataToSend.append('sale_price', formData.sale_price);
      if (formData.stock_quantity) formDataToSend.append('stock_quantity', formData.stock_quantity);
      if (formData.calories) formDataToSend.append('calories', formData.calories);
      if (formData.preparation_time) formDataToSend.append('preparation_time', formData.preparation_time);
      if (formData.serving_size) formDataToSend.append('serving_size', formData.serving_size);
      
      // Add main image
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }
      
      // Add gallery images
      // formData.gallery_images.forEach((file) => {
      //   formDataToSend.append('gallery_images[]', file);
      // });

      formData.gallery_images.forEach((file, index) => {
        formDataToSend.append(`gallery_images_${index + 1}`, file);  // Dynamically appending with index
      });

      // Add ingredients as JSON
      formDataToSend.append('ingredients', JSON.stringify(formData.ingredients));

      // Add nutrition_facts as JSON
      formDataToSend.append('nutrition_facts', JSON.stringify(formData.nutrition_facts));

      let response;
      if (meal) {
        response = await mealAPI.updateMeal(meal.guid, formDataToSend);
      } else {
        response = await mealAPI.createMeal(formDataToSend);
      }

      if (response.success) {
        showSuccess(meal ? 'Meal updated successfully' : 'Meal created successfully');
        onSave();
        onClose();
      }
    } catch (error) {
      console.error('Error saving meal:', error);
      
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
      <div className="modal-content meal-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{meal ? 'Edit Meal' : 'Create New Meal'}</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="meal-form">
          <div className="form-grid">
            {/* Basic Information */}
            <div className="form-section full-width">
              <h3>Basic Information</h3>
            </div>

            <div className="form-group full-width">
              <label htmlFor="name">Meal Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                className={errors.name ? 'error' : ''}
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter meal name"
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
                placeholder="Enter meal description"
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
              <label htmlFor="type">Type</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="">Select Type</option>
                <option value="VEG">VEG</option>
                <option value="NON_VEG">NON_VEG</option>
                <option value="VEGAN">VEGAN</option>
                <option value="OTHER">OTHER</option>
              </select>
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
              <label htmlFor="stock_quantity">Stock Quantity</label>
              <input
                type="number"
                id="stock_quantity"
                name="stock_quantity"
                value={formData.stock_quantity}
                onChange={handleChange}
                placeholder="0"
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
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>
            </div>

            {/* Meal Details */}
            <div className="form-section full-width">
              <h3>Meal Details</h3>
            </div>

            <div className="form-group">
              <label htmlFor="calories">Calories</label>
              <input
                type="number"
                id="calories"
                name="calories"
                value={formData.calories}
                onChange={handleChange}
                placeholder="450"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="preparation_time">Preparation Time (min)</label>
              <input
                type="number"
                id="preparation_time"
                name="preparation_time"
                value={formData.preparation_time}
                onChange={handleChange}
                placeholder="15"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="serving_size">Serving Size</label>
              <input
                type="text"
                id="serving_size"
                name="serving_size"
                value={formData.serving_size}
                onChange={handleChange}
                placeholder="1 bowl"
                disabled={loading}
              />
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
                <span>Featured Meal</span>
              </label>
            </div>

            <div className="form-group">
              <label htmlFor="is_best_selling" className="checkbox-label">
                <input
                  type="checkbox"
                  id="is_best_selling"
                  name="is_best_selling"
                  checked={formData.is_best_selling === 1}
                  onChange={handleChange}
                  disabled={loading}
                />
                <span>Best Selling</span>
              </label>
            </div>

            {/* Nutrition Facts */}
            <div className="form-section full-width">
              <h3>Nutrition Facts</h3>
            </div>

            <div className="form-group">
              <label htmlFor="protein">Protein (g)</label>
              <input
                type="number"
                id="protein"
                name="protein"
                value={formData.nutrition_facts.protein}
                onChange={handleNutritionChange}
                placeholder="20"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="carbs">Carbs (g)</label>
              <input
                type="number"
                id="carbs"
                name="carbs"
                value={formData.nutrition_facts.carbs}
                onChange={handleNutritionChange}
                placeholder="45"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="fat">Fat (g)</label>
              <input
                type="number"
                id="fat"
                name="fat"
                value={formData.nutrition_facts.fat}
                onChange={handleNutritionChange}
                placeholder="15"
                disabled={loading}
              />
            </div>

            {/* Ingredients */}
            <div className="form-section full-width">
              <h3>Ingredients</h3>
            </div>

            <div className="form-group full-width">
              <label htmlFor="ingredient-input">Add Ingredients</label>
              <div className="array-input-group">
                <input
                  type="text"
                  id="ingredient-input"
                  value={ingredientInput}
                  onChange={(e) => setIngredientInput(e.target.value)}
                  onKeyPress={handleIngredientKeyPress}
                  placeholder="Type ingredient and press Enter"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={handleAddIngredient}
                  className="add-btn"
                  disabled={loading || !ingredientInput.trim()}
                >
                  <Plus size={18} />
                  Add
                </button>
              </div>
              {formData.ingredients.length > 0 && (
                <div className="tags-container">
                  {formData.ingredients.map((ingredient, index) => (
                    <div key={index} className="tag-chip">
                      <span>{ingredient}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveIngredient(index)}
                        className="remove-tag"
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
              <h3>Meal Images</h3>
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
                <div className="image-preview-container">
                  <img 
                    src={imagePreview} 
                    alt="Main Preview" 
                    className="image-preview"
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
                <div className="gallery-previews">
                  {galleryPreviews.map((preview, index) => (
                    <div key={index} className="gallery-preview-item">
                      <img 
                        src={preview} 
                        alt={`Preview ${index + 1}`} 
                        className="gallery-preview"
                      />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="remove-image-btn"
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
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  {meal ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                meal ? 'Update Meal' : 'Create Meal'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MealFormModal;
