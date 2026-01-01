import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Plus, Edit2, Trash2, MapPin, Phone, Clock, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import {
    getPartners,
    createPartner,
    updatePartner,
    deletePartner,
    clearPartnerError,
    clearPartnerSuccess
} from '../store/slices/partnerSlice';
import { useToast } from '../context/ToastContext';
import PartnerFormModal from '../components/PartnerFormModal';

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

const AdminPartners = () => {
    const dispatch = useDispatch();
    const { showSuccess, showError } = useToast();

    const {
        partners,
        pagination,
        isLoading,
        isCreating,
        isUpdating,
        isDeleting,
        error,
        successMessage
    } = useSelector(state => state.partners);

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [viewPartner, setViewPartner] = useState(null);

    // Fetch partners on mount and when search/page changes
    useEffect(() => {
        fetchPartners();
    }, [currentPage, dispatch]);

    // Handle search with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            if (currentPage === 1) {
                fetchPartners();
            } else {
                setCurrentPage(1);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Handle error/success messages
    useEffect(() => {
        if (error) {
            showError(error);
            dispatch(clearPartnerError());
        }
    }, [error]);

    useEffect(() => {
        if (successMessage) {
            showSuccess(successMessage);
            dispatch(clearPartnerSuccess());
            setIsModalOpen(false);
            setSelectedPartner(null);
        }
    }, [successMessage]);

    const fetchPartners = () => {
        dispatch(getPartners({
            page: currentPage,
            per_page: 10,
            search: searchTerm || undefined,
        }));
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleAddNew = () => {
        setSelectedPartner(null);
        setIsModalOpen(true);
    };

    const handleEdit = (partner) => {
        setSelectedPartner(partner);
        setIsModalOpen(true);
    };

    const handleView = (partner) => {
        setViewPartner(partner);
    };

    const handleDelete = (partner) => {
        setDeleteConfirm(partner);
    };

    const confirmDelete = async () => {
        if (deleteConfirm) {
            await dispatch(deletePartner(deleteConfirm.id));
            setDeleteConfirm(null);
        }
    };

    const handleSubmit = async (formData) => {
        if (selectedPartner) {
            await dispatch(updatePartner({ id: selectedPartner.id, data: formData }));
        } else {
            await dispatch(createPartner(formData));
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPartner(null);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setCurrentPage(newPage);
        }
    };

    const getPartnerImage = (partner) => {
        if (partner.image_url) {
            return getFullImageUrl(partner.image_url);
        }
        if (partner.image) {
            return getFullImageUrl(partner.image);
        }
        if (partner.gallery_images && partner.gallery_images.length > 0) {
            const firstImg = partner.gallery_images[0];
            return getFullImageUrl(firstImg.image_url || firstImg);
        }
        return null;
    };

    return (
        <div className="admin-page admin-partners">
            {/* Header */}
            <div className="page-header">
                <div className="header-left">
                    <h1 className="page-title">Partners</h1>
                    <p className="page-subtitle">Manage your partner locations and gyms</p>
                </div>
                <button className="btn-primary" onClick={handleAddNew}>
                    <Plus size={20} />
                    Add Partner
                </button>
            </div>

            {/* Search & Filters */}
            <div className="filters-section">
                <div className="search-box">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Search partners..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>
                <div className="results-info">
                    {pagination.totalItems > 0 && (
                        <span>Showing {partners.length} of {pagination.totalItems} partners</span>
                    )}
                </div>
            </div>

            {/* Partners Table */}
            <div className="table-container">
                {isLoading ? (
                    <div className="loading-state">
                        <div className="loader"></div>
                        <p>Loading partners...</p>
                    </div>
                ) : partners.length === 0 ? (
                    <div className="empty-state">
                        <MapPin size={48} />
                        <h3>No Partners Found</h3>
                        <p>Start by adding your first partner location</p>
                        <button className="btn-primary" onClick={handleAddNew}>
                            <Plus size={20} />
                            Add Partner
                        </button>
                    </div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Partner</th>
                                <th>Address</th>
                                <th>Phone</th>
                                <th>Working Hours</th>
                                <th>Working Days</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {partners.map((partner) => (
                                <tr key={partner.id}>
                                    <td>
                                        <div className="partner-info">
                                            <div className="partner-avatar">
                                                {getPartnerImage(partner) ? (
                                                    <img
                                                        src={getPartnerImage(partner)}
                                                        alt={partner.name}
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            e.target.parentElement.innerHTML = '🏢';
                                                        }}
                                                    />
                                                ) : (
                                                    <span>🏢</span>
                                                )}
                                            </div>
                                            <div className="partner-details">
                                                <span className="partner-name">{partner.name}</span>
                                                {partner.description && (
                                                    <span className="partner-desc">
                                                        {partner.description.substring(0, 50)}
                                                        {partner.description.length > 50 ? '...' : ''}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="address-cell">
                                            <MapPin size={14} />
                                            <span>{partner.address || 'N/A'}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="phone-cell">
                                            <Phone size={14} />
                                            <span>{partner.phone || 'N/A'}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="hours-cell">
                                            <Clock size={14} />
                                            <span>
                                                {partner.opening_hours && partner.closing_hours
                                                    ? `${partner.opening_hours} - ${partner.closing_hours}`
                                                    : 'N/A'
                                                }
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="days-cell">
                                            {partner.working_days ? (
                                                <span className="days-badge">{partner.working_days}</span>
                                            ) : (
                                                'N/A'
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="btn-icon view"
                                                onClick={() => handleView(partner)}
                                                title="View Details"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                className="btn-icon edit"
                                                onClick={() => handleEdit(partner)}
                                                title="Edit"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                className="btn-icon delete"
                                                onClick={() => handleDelete(partner)}
                                                title="Delete"
                                                disabled={isDeleting}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="pagination">
                    <button
                        className="pagination-btn"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft size={20} />
                        Previous
                    </button>

                    <div className="pagination-info">
                        Page {currentPage} of {pagination.totalPages}
                    </div>

                    <button
                        className="pagination-btn"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === pagination.totalPages}
                    >
                        Next
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}

            {/* Partner Form Modal */}
            <PartnerFormModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                partner={selectedPartner}
                onSubmit={handleSubmit}
                isLoading={isCreating || isUpdating}
            />

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
                    <div className="confirm-modal" onClick={e => e.stopPropagation()}>
                        <div className="confirm-icon delete">
                            <Trash2 size={32} />
                        </div>
                        <h3>Delete Partner?</h3>
                        <p>Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? This action cannot be undone.</p>
                        <div className="confirm-actions">
                            <button
                                className="btn-cancel"
                                onClick={() => setDeleteConfirm(null)}
                                disabled={isDeleting}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn-delete"
                                onClick={confirmDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Partner Modal */}
            {viewPartner && (
                <div className="modal-overlay" onClick={() => setViewPartner(null)}>
                    <div className="view-modal partner-view" onClick={e => e.stopPropagation()}>
                        <button className="close-btn" onClick={() => setViewPartner(null)}>×</button>

                        <div className="view-header">
                            {getPartnerImage(viewPartner) ? (
                                <img
                                    src={getPartnerImage(viewPartner)}
                                    alt={viewPartner.name}
                                    className="view-image"
                                />
                            ) : (
                                <div className="view-placeholder">🏢</div>
                            )}
                            <h2>{viewPartner.name}</h2>
                        </div>

                        <div className="view-content">
                            {viewPartner.description && (
                                <div className="view-section">
                                    <h4>Description</h4>
                                    <p>{viewPartner.description}</p>
                                </div>
                            )}

                            <div className="view-grid">
                                <div className="view-item">
                                    <MapPin size={18} />
                                    <div>
                                        <span className="label">Address</span>
                                        <span className="value">{viewPartner.address || 'N/A'}</span>
                                    </div>
                                </div>

                                <div className="view-item">
                                    <Phone size={18} />
                                    <div>
                                        <span className="label">Phone</span>
                                        <span className="value">{viewPartner.phone || 'N/A'}</span>
                                    </div>
                                </div>

                                <div className="view-item">
                                    <Clock size={18} />
                                    <div>
                                        <span className="label">Working Hours</span>
                                        <span className="value">
                                            {viewPartner.opening_hours && viewPartner.closing_hours
                                                ? `${viewPartner.opening_hours} - ${viewPartner.closing_hours}`
                                                : 'N/A'
                                            }
                                        </span>
                                    </div>
                                </div>

                                <div className="view-item">
                                    <div className="icon">📅</div>
                                    <div>
                                        <span className="label">Working Days</span>
                                        <span className="value">{viewPartner.working_days || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>

                            {(viewPartner.latitude && viewPartner.longitude) && (
                                <div className="view-section">
                                    <h4>Coordinates</h4>
                                    <p>Lat: {viewPartner.latitude}, Long: {viewPartner.longitude}</p>
                                </div>
                            )}

                            {viewPartner.gallery_images && viewPartner.gallery_images.length > 0 && (
                                <div className="view-section">
                                    <h4>Gallery ({viewPartner.gallery_images.length} images)</h4>
                                    <div className="gallery-grid">
                                        {viewPartner.gallery_images.map((img, index) => (
                                            <img
                                                key={index}
                                                src={getFullImageUrl(img.image_url || img)}
                                                alt={`Gallery ${index + 1}`}
                                                onError={(e) => e.target.style.display = 'none'}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="view-actions">
                            <button className="btn-edit" onClick={() => {
                                setViewPartner(null);
                                handleEdit(viewPartner);
                            }}>
                                <Edit2 size={18} />
                                Edit Partner
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPartners;
