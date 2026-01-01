import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
    MapPin, Clock, Phone, Calendar, ArrowLeft,
    ChevronLeft, ChevronRight, X
} from 'lucide-react';
import { getPartnerWithGallery, clearCurrentPartner } from '../store/slices/partnerSlice';

// Helper function to get full image URL
const getFullImageUrl = (imagePath) => {
    const baseUrl = import.meta.env.VITE_APP_BASE_URL;
    if (!imagePath) return null;
    if (typeof imagePath !== 'string') return null;

    // Already a full URL
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }

    // Handle path starting with 'uploads/' (relative storage path)
    if (imagePath.startsWith('uploads/') || imagePath.startsWith('uploads\\')) {
        return `${baseUrl}/storage/${imagePath.replace(/\\/g, '/')}`;
    }

    // Handle path with /storage/ in it
    if (imagePath.includes('/storage/')) {
        const storagePath = imagePath.substring(imagePath.indexOf('/storage/'));
        return `${baseUrl}${storagePath}`;
    }

    // Default: append to base URL
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${baseUrl}${cleanPath}`;
};

const PartnerDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentPartner, isLoadingDetail, error } = useSelector(state => state.partners);

    const [selectedImage, setSelectedImage] = useState(null);
    const [galleryIndex, setGalleryIndex] = useState(0);

    useEffect(() => {
        if (id) {
            dispatch(getPartnerWithGallery(id));
        }
        return () => {
            dispatch(clearCurrentPartner());
        };
    }, [id, dispatch]);

    const getPartnerImage = (partner) => {
        if (partner.image_url) {
            return getFullImageUrl(partner.image_url);
        }
        if (partner.image) {
            return getFullImageUrl(partner.image);
        }
        return null;
    };

    const formatTime = (time) => {
        if (!time) return '';
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    };

    const formatDays = (days) => {
        if (!days) return [];
        if (Array.isArray(days)) {
            return days.map(d => d.charAt(0).toUpperCase() + d.slice(1));
        }
        return days.split(',').map(d => d.trim());
    };

    const getAllImages = () => {
        const images = [];
        if (currentPartner) {
            const mainImage = getPartnerImage(currentPartner);
            if (mainImage) {
                images.push({ url: mainImage, isMain: true });
            }
            if (currentPartner.gallery_images && currentPartner.gallery_images.length > 0) {
                currentPartner.gallery_images.forEach(img => {
                    images.push({
                        url: getFullImageUrl(img.image_url || img),
                        isMain: false
                    });
                });
            }
        }
        return images;
    };

    const allImages = getAllImages();

    const openLightbox = (index) => {
        setGalleryIndex(index);
        setSelectedImage(allImages[index]?.url);
    };

    const closeLightbox = () => {
        setSelectedImage(null);
    };

    const nextImage = () => {
        const newIndex = (galleryIndex + 1) % allImages.length;
        setGalleryIndex(newIndex);
        setSelectedImage(allImages[newIndex]?.url);
    };

    const prevImage = () => {
        const newIndex = (galleryIndex - 1 + allImages.length) % allImages.length;
        setGalleryIndex(newIndex);
        setSelectedImage(allImages[newIndex]?.url);
    };

    if (isLoadingDetail) {
        return (
            <div className="partner-detail-page">
                <div className="partner-detail-loading">
                    <div className="loader"></div>
                    <p>Loading partner details...</p>
                </div>
            </div>
        );
    }

    if (error || !currentPartner) {
        return (
            <div className="partner-detail-page">
                <div className="partner-detail-error">
                    <div className="error-icon">😕</div>
                    <h2>Partner Not Found</h2>
                    <p>We couldn't find the gym you're looking for.</p>
                    <button onClick={() => navigate('/partners')} className="back-btn">
                        <ArrowLeft size={20} />
                        Back to Partners
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="partner-detail-page">
            {/* Hero Section */}
            <div className="partner-detail-hero">
                <div
                    className="hero-background"
                    style={{
                        backgroundImage: getPartnerImage(currentPartner)
                            ? `url(${getPartnerImage(currentPartner)})`
                            : 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)'
                    }}
                ></div>
                <div className="hero-overlay"></div>
                <div className="container">
                    <button onClick={() => navigate('/partners')} className="back-link">
                        <ArrowLeft size={20} />
                        Back to Partners
                    </button>
                    <div className="partner-detail-title">
                        <h1>{currentPartner.name}</h1>
                        {currentPartner.address && (
                            <p className="partner-location">
                                <MapPin size={18} />
                                {currentPartner.address}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="partner-detail-content">
                <div className="container">
                    <div className="partner-detail-grid">
                        {/* Left Column - Info */}
                        <div className="partner-info-section">
                            {/* About */}
                            <div className="info-card">
                                <h3>About</h3>
                                <p className="partner-description">
                                    {currentPartner.description || 'No description available for this partner.'}
                                </p>
                            </div>

                            {/* Working Hours */}
                            <div className="info-card">
                                <h3><Clock size={20} /> Working Hours</h3>
                                <div className="working-hours">
                                    {(currentPartner.opening_hours && currentPartner.closing_hours) ? (
                                        <div className="hours-display">
                                            <span className="time">{formatTime(currentPartner.opening_hours)}</span>
                                            <span className="separator">to</span>
                                            <span className="time">{formatTime(currentPartner.closing_hours)}</span>
                                        </div>
                                    ) : (
                                        <p className="not-available">Hours not specified</p>
                                    )}
                                </div>
                            </div>

                            {/* Working Days */}
                            <div className="info-card">
                                <h3><Calendar size={20} /> Working Days</h3>
                                <div className="working-days">
                                    {currentPartner.working_days ? (
                                        <div className="days-list">
                                            {formatDays(currentPartner.working_days).map((day, index) => (
                                                <span key={index} className="day-tag">{day}</span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="not-available">Days not specified</p>
                                    )}
                                </div>
                            </div>

                            {/* Contact */}
                            {currentPartner.phone && (
                                <div className="info-card">
                                    <h3><Phone size={20} /> Contact</h3>
                                    <a href={`tel:${currentPartner.phone}`} className="phone-link">
                                        {currentPartner.phone}
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Right Column - Gallery */}
                        <div className="partner-gallery-section">
                            <h3>Gallery</h3>
                            {allImages.length > 0 ? (
                                <div className="gallery-grid">
                                    {allImages.map((img, index) => (
                                        <div
                                            key={index}
                                            className={`gallery-item ${index === 0 ? 'main' : ''}`}
                                            onClick={() => openLightbox(index)}
                                        >
                                            <img src={img.url} alt={`Gallery ${index + 1}`} />
                                            <div className="gallery-overlay">
                                                <span>View</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="no-gallery">
                                    <span>📷</span>
                                    <p>No images available</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Lightbox */}
            {selectedImage && (
                <div className="lightbox-overlay" onClick={closeLightbox}>
                    <button className="lightbox-close" onClick={closeLightbox}>
                        <X size={24} />
                    </button>
                    <button
                        className="lightbox-nav prev"
                        onClick={(e) => { e.stopPropagation(); prevImage(); }}
                    >
                        <ChevronLeft size={32} />
                    </button>
                    <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                        <img src={selectedImage} alt="Gallery" />
                        <div className="lightbox-info">
                            {galleryIndex + 1} / {allImages.length}
                        </div>
                    </div>
                    <button
                        className="lightbox-nav next"
                        onClick={(e) => { e.stopPropagation(); nextImage(); }}
                    >
                        <ChevronRight size={32} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default PartnerDetail;
