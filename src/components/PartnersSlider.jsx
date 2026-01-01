import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, Clock, ChevronRight, ArrowRight } from 'lucide-react';
import { getActivePartners } from '../store/slices/partnerSlice';

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

const PartnersSlider = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { activePartners, isLoadingActive } = useSelector(state => state.partners);

    useEffect(() => {
        dispatch(getActivePartners({ limit: 6 }));
    }, [dispatch]);

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

    if (isLoadingActive) {
        return (
            <section className="partners-section-new">
                <div className="container">
                    <div className="partners-loading">
                        <div className="loader"></div>
                        <p>Loading partners...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (!activePartners || activePartners.length === 0) {
        return null;
    }

    // Only show first 3 partners
    const displayPartners = activePartners.slice(0, 3);

    return (
        <section className="partners-section-new">
            <div className="container">
                {/* Section Header */}
                <div className="partners-header">
                    <div className="partners-header-left">
                        <span className="partners-badge">💪 Trusted Partners</span>
                        <h2>Our <span>Partners</span></h2>
                        <p>Train at the best gyms and fitness centers near you</p>
                    </div>
                    <Link to="/partners" className="partners-see-all">
                        See All Partners
                        <ArrowRight size={18} />
                    </Link>
                </div>

                {/* Partners Grid - 3 Cards */}
                <div className="partners-cards-grid">
                    {displayPartners.map(partner => {
                        const imageUrl = getPartnerImage(partner);

                        return (
                            <div
                                key={partner.id}
                                className="partner-card-new"
                                onClick={() => navigate(`/partners/${partner.id}`)}
                            >
                                {/* Image Section */}
                                <div className="partner-card-img">
                                    {imageUrl ? (
                                        <img
                                            src={imageUrl}
                                            alt={partner.name}
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                    ) : null}
                                    <div className="partner-card-placeholder" style={{ display: imageUrl ? 'none' : 'flex' }}>
                                        <span>🏢</span>
                                    </div>
                                    <div className="partner-card-gradient"></div>
                                </div>

                                {/* Content Section */}
                                <div className="partner-card-body">
                                    <h3>{partner.name}</h3>

                                    <div className="partner-card-meta">
                                        {partner.address && (
                                            <div className="meta-row">
                                                <MapPin size={14} />
                                                <span>{partner.address.length > 35 ? partner.address.substring(0, 35) + '...' : partner.address}</span>
                                            </div>
                                        )}
                                        {(partner.opening_hours && partner.closing_hours) && (
                                            <div className="meta-row">
                                                <Clock size={14} />
                                                <span>{formatTime(partner.opening_hours)} - {formatTime(partner.closing_hours)}</span>
                                            </div>
                                        )}
                                    </div>

                                    <button className="partner-card-action">
                                        View Details
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Mobile See All Button */}
                <Link to="/partners" className="partners-mobile-btn">
                    View All Partners
                    <ArrowRight size={18} />
                </Link>
            </div>
        </section>
    );
};

export default PartnersSlider;
