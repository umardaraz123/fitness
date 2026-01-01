import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, MapPin, Clock, Calendar, Phone, Image as ImageIcon, Trash2 } from 'lucide-react';

// Helper function to get full image URL
const getFullImageUrl = (imagePath) => {
    const baseUrl = import.meta.env.VITE_APP_BASE_URL;
    if (!imagePath) return null;
    if (typeof imagePath !== 'string') return null;
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }
    if (imagePath.includes('/storage/uploads/')) {
        const storagePath = imagePath.substring(imagePath.indexOf('/storage/uploads/'));
        return `${baseUrl}${storagePath}`;
    }
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${baseUrl}${cleanPath}`;
};

// Working days with lowercase values for API
const WORKING_DAYS_OPTIONS = [
    { label: 'Mon', value: 'monday' },
    { label: 'Tue', value: 'tuesday' },
    { label: 'Wed', value: 'wednesday' },
    { label: 'Thu', value: 'thursday' },
    { label: 'Fri', value: 'friday' },
    { label: 'Sat', value: 'saturday' },
    { label: 'Sun', value: 'sunday' },
];

const PartnerFormModal = ({ isOpen, onClose, partner, onSubmit, isLoading }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        address: '',
        phone: '',
        opening_hours: '',
        closing_hours: '',
        image: null,
        gallery_images: [],
    });

    const [errors, setErrors] = useState({});
    const [imagePreview, setImagePreview] = useState(null);
    const [galleryPreviews, setGalleryPreviews] = useState([]);
    const [existingGalleryImages, setExistingGalleryImages] = useState([]);
    const [selectedDays, setSelectedDays] = useState([]);

    const imageInputRef = useRef(null);
    const galleryInputRef = useRef(null);

    const isEditing = !!partner;

    useEffect(() => {
        if (partner) {
            setFormData({
                name: partner.name || '',
                description: partner.description || '',
                address: partner.address || '',
                phone: partner.phone || '',
                opening_hours: partner.opening_hours || '',
                closing_hours: partner.closing_hours || '',
                image: null,
                gallery_images: [],
            });

            // Set existing image preview
            if (partner.image_url || partner.image) {
                setImagePreview(getFullImageUrl(partner.image_url || partner.image));
            }

            // Set existing gallery images
            if (partner.gallery_images && partner.gallery_images.length > 0) {
                setExistingGalleryImages(partner.gallery_images);
            }

            // Parse working days (already in lowercase from API)
            if (partner.working_days) {
                if (Array.isArray(partner.working_days)) {
                    setSelectedDays(partner.working_days);
                } else {
                    const days = partner.working_days.split(',').map(d => d.trim().toLowerCase());
                    setSelectedDays(days);
                }
            }
        } else {
            resetForm();
        }
    }, [partner, isOpen]);

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            address: '',
            phone: '',
            opening_hours: '',
            closing_hours: '',
            image: null,
            gallery_images: [],
        });
        setErrors({});
        setImagePreview(null);
        setGalleryPreviews([]);
        setExistingGalleryImages([]);
        setSelectedDays([]);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleDayToggle = (dayValue) => {
        setSelectedDays(prev => {
            if (prev.includes(dayValue)) {
                return prev.filter(d => d !== dayValue);
            } else {
                return [...prev, dayValue];
            }
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setErrors(prev => ({ ...prev, image: 'Image size must be less than 5MB' }));
                return;
            }
            setFormData(prev => ({ ...prev, image: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGalleryChange = (e) => {
        const files = Array.from(e.target.files);
        const validFiles = files.filter(file => file.size <= 5 * 1024 * 1024);

        if (validFiles.length < files.length) {
            setErrors(prev => ({ ...prev, gallery: 'Some images were too large (max 5MB each)' }));
        }

        setFormData(prev => ({
            ...prev,
            gallery_images: [...prev.gallery_images, ...validFiles]
        }));

        // Create previews
        validFiles.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setGalleryPreviews(prev => [...prev, { file, preview: reader.result }]);
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

    const removeImage = () => {
        setFormData(prev => ({ ...prev, image: null }));
        setImagePreview(null);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Partner name is required';
        }

        if (!formData.address.trim()) {
            newErrors.address = 'Address is required';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        // Send working_days as array with lowercase values
        const submitData = {
            ...formData,
            working_days: selectedDays, // Already lowercase
        };

        onSubmit(submitData);
    };

    if (!isOpen) return null;

    return (
        <div className="partner-modal-overlay" onClick={onClose}>
            <div className="partner-modal-container" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="partner-modal-header">
                    <h2>{isEditing ? 'Edit Partner' : 'Add New Partner'}</h2>
                    <button className="partner-close-btn" onClick={onClose} disabled={isLoading}>
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="partner-modal-body">

                    {/* Basic Information Section */}
                    <div className="partner-section">
                        <div className="partner-section-header">
                            <span className="partner-section-icon">📋</span>
                            <h3>Basic Information</h3>
                        </div>

                        <div className="partner-form-grid">
                            <div className="partner-form-group full-width">
                                <label>Partner Name <span className="required">*</span></label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter partner/gym name"
                                    className={errors.name ? 'error' : ''}
                                    disabled={isLoading}
                                />
                                {errors.name && <span className="partner-error">{errors.name}</span>}
                            </div>

                            <div className="partner-form-group full-width">
                                <label>Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Brief description about the partner..."
                                    rows={3}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="partner-form-group full-width">
                                <label><Phone size={14} /> Phone Number <span className="required">*</span></label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="+92 300 1234567"
                                    className={errors.phone ? 'error' : ''}
                                    disabled={isLoading}
                                />
                                {errors.phone && <span className="partner-error">{errors.phone}</span>}
                            </div>
                        </div>
                    </div>

                    {/* Location Section */}
                    <div className="partner-section">
                        <div className="partner-section-header">
                            <span className="partner-section-icon"><MapPin size={16} /></span>
                            <h3>Location</h3>
                        </div>

                        <div className="partner-form-grid">
                            <div className="partner-form-group full-width">
                                <label>Address <span className="required">*</span></label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    placeholder="Enter full address"
                                    rows={2}
                                    className={errors.address ? 'error' : ''}
                                    disabled={isLoading}
                                />
                                {errors.address && <span className="partner-error">{errors.address}</span>}
                            </div>
                        </div>
                    </div>

                    {/* Working Hours Section */}
                    <div className="partner-section">
                        <div className="partner-section-header">
                            <span className="partner-section-icon"><Clock size={16} /></span>
                            <h3>Working Hours</h3>
                        </div>

                        <div className="partner-form-grid">
                            <div className="partner-form-group">
                                <label>Opening Time</label>
                                <input
                                    type="time"
                                    name="opening_hours"
                                    value={formData.opening_hours}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="partner-form-group">
                                <label>Closing Time</label>
                                <input
                                    type="time"
                                    name="closing_hours"
                                    value={formData.closing_hours}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="partner-form-group full-width">
                                <label><Calendar size={14} /> Working Days</label>
                                <div className="partner-days-grid">
                                    {WORKING_DAYS_OPTIONS.map(day => (
                                        <button
                                            key={day.value}
                                            type="button"
                                            className={`partner-day-btn ${selectedDays.includes(day.value) ? 'selected' : ''}`}
                                            onClick={() => handleDayToggle(day.value)}
                                            disabled={isLoading}
                                        >
                                            {day.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Images Section */}
                    <div className="partner-section">
                        <div className="partner-section-header">
                            <span className="partner-section-icon"><ImageIcon size={16} /></span>
                            <h3>Images</h3>
                        </div>

                        <div className="partner-images-grid">
                            {/* Main Image */}
                            <div className="partner-image-box">
                                <label>Main Image</label>
                                <div className="partner-upload-area">
                                    {imagePreview ? (
                                        <div className="partner-image-preview">
                                            <img src={imagePreview} alt="Preview" />
                                            <button
                                                type="button"
                                                className="partner-remove-btn"
                                                onClick={removeImage}
                                                disabled={isLoading}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div
                                            className="partner-upload-placeholder"
                                            onClick={() => imageInputRef.current?.click()}
                                        >
                                            <Upload size={24} />
                                            <span>Upload Image</span>
                                        </div>
                                    )}
                                    <input
                                        ref={imageInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        style={{ display: 'none' }}
                                        disabled={isLoading}
                                    />
                                </div>
                                {errors.image && <span className="partner-error">{errors.image}</span>}
                            </div>

                            {/* Gallery Images */}
                            <div className="partner-image-box">
                                <label>Gallery Images</label>
                                <div className="partner-gallery-grid">
                                    {/* Existing gallery images */}
                                    {existingGalleryImages.map((img, index) => (
                                        <div key={`existing-${index}`} className="partner-gallery-item">
                                            <img
                                                src={getFullImageUrl(img.image_url || img)}
                                                alt={`Gallery ${index + 1}`}
                                            />
                                        </div>
                                    ))}

                                    {/* New gallery images */}
                                    {galleryPreviews.map((item, index) => (
                                        <div key={index} className="partner-gallery-item">
                                            <img src={item.preview} alt={`New ${index + 1}`} />
                                            <button
                                                type="button"
                                                className="partner-gallery-remove"
                                                onClick={() => removeGalleryImage(index)}
                                                disabled={isLoading}
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}

                                    {/* Add more button */}
                                    <div
                                        className="partner-gallery-add"
                                        onClick={() => galleryInputRef.current?.click()}
                                    >
                                        <Upload size={18} />
                                        <span>Add</span>
                                    </div>

                                    <input
                                        ref={galleryInputRef}
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleGalleryChange}
                                        style={{ display: 'none' }}
                                        disabled={isLoading}
                                    />
                                </div>
                                {errors.gallery && <span className="partner-error">{errors.gallery}</span>}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="partner-modal-footer">
                        <button
                            type="button"
                            className="partner-btn-cancel"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="partner-btn-submit"
                            disabled={isLoading}
                        >
                            {isLoading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Partner' : 'Create Partner')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PartnerFormModal;
