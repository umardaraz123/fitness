import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Phone, Search, ChevronLeft, ChevronRight } from 'lucide-react';
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

const Partners = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { activePartners, pagination, isLoadingActive } = useSelector(state => state.partners);

    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const perPage = 12;

    useEffect(() => {
        dispatch(getActivePartners({
            page: currentPage,
            per_page: perPage,
            search: searchTerm || undefined
        }));
    }, [dispatch, currentPage]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (currentPage === 1) {
                dispatch(getActivePartners({
                    page: 1,
                    per_page: perPage,
                    search: searchTerm || undefined
                }));
            } else {
                setCurrentPage(1);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

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
        if (!days) return '';
        if (Array.isArray(days)) {
            return days.map(d => d.charAt(0).toUpperCase() + d.slice(1, 3)).join(', ');
        }
        return days;
    };

    return (
        <div className="partners-page">
            {/* Hero Section */}
            <div className="partners-hero">
                <div className="container">
                    <h1>Our Partner <span>Gyms</span></h1>
                    <p>Find and train at the best fitness centers near you</p>

                    <div className="partners-search">
                        <Search size={20} />
                        <input
                            type="text"
                            placeholder="Search gyms by name or location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Partners Grid */}
            <div className="partners-content">
                <div className="container">
                    {isLoadingActive ? (
                        <div className="partners-loading-full">
                            <div className="loader"></div>
                            <p>Finding gyms for you...</p>
                        </div>
                    ) : activePartners.length === 0 ? (
                        <div className="partners-empty">
                            <div className="empty-icon">🏢</div>
                            <h3>No Partners Found</h3>
                            <p>We couldn't find any gyms matching your search. Try a different keyword.</p>
                        </div>
                    ) : (
                        <>
                            <div className="partners-results-info">
                                <span>Showing {activePartners.length} of {pagination.totalItems} gyms</span>
                            </div>

                            <div className="partners-grid">
                                {activePartners.map(partner => (
                                    <div
                                        key={partner.id}
                                        className="partner-grid-card"
                                        onClick={() => navigate(`/partners/${partner.id}`)}
                                    >
                                        <div className="partner-grid-image">
                                            {getPartnerImage(partner) ? (
                                                <img
                                                    src={getPartnerImage(partner)}
                                                    alt={partner.name}
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                    }}
                                                />
                                            ) : (
                                                <div className="partner-grid-placeholder">🏢</div>
                                            )}
                                        </div>
                                        <div className="partner-grid-content">
                                            <h3>{partner.name}</h3>
                                            {partner.description && (
                                                <p className="partner-grid-desc">
                                                    {partner.description.substring(0, 80)}
                                                    {partner.description.length > 80 ? '...' : ''}
                                                </p>
                                            )}
                                            <div className="partner-grid-meta">
                                                {partner.address && (
                                                    <div className="meta-item">
                                                        <MapPin size={14} />
                                                        <span>{partner.address.substring(0, 30)}{partner.address.length > 30 ? '...' : ''}</span>
                                                    </div>
                                                )}
                                                {(partner.opening_hours && partner.closing_hours) && (
                                                    <div className="meta-item">
                                                        <Clock size={14} />
                                                        <span>{formatTime(partner.opening_hours)} - {formatTime(partner.closing_hours)}</span>
                                                    </div>
                                                )}
                                                {partner.working_days && (
                                                    <div className="meta-item days">
                                                        <span className="days-badge">{formatDays(partner.working_days)}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <button className="partner-grid-btn">View Details</button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {pagination.totalPages > 1 && (
                                <div className="partners-pagination">
                                    <button
                                        className="pagination-btn"
                                        onClick={() => setCurrentPage(prev => prev - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        <ChevronLeft size={20} />
                                        Previous
                                    </button>

                                    <div className="pagination-numbers">
                                        {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                            let pageNum;
                                            if (pagination.totalPages <= 5) {
                                                pageNum = i + 1;
                                            } else if (currentPage <= 3) {
                                                pageNum = i + 1;
                                            } else if (currentPage >= pagination.totalPages - 2) {
                                                pageNum = pagination.totalPages - 4 + i;
                                            } else {
                                                pageNum = currentPage - 2 + i;
                                            }
                                            return (
                                                <button
                                                    key={pageNum}
                                                    className={`page-num ${currentPage === pageNum ? 'active' : ''}`}
                                                    onClick={() => setCurrentPage(pageNum)}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <button
                                        className="pagination-btn"
                                        onClick={() => setCurrentPage(prev => prev + 1)}
                                        disabled={currentPage === pagination.totalPages}
                                    >
                                        Next
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Partners;
