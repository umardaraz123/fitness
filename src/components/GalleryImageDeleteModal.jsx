import React, { useState, useEffect } from 'react';
import { X, Trash2, AlertTriangle, Loader, ImageIcon } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const GalleryImageDeleteModal = ({ 
  isOpen, 
  onClose, 
  image, 
  images = [], 
  onConfirm,
  mode = 'single' // 'single' or 'bulk'
}) => {
  const { showError } = useToast();
  const [safeDelete, setSafeDelete] = useState(true);
  const [confirmText, setConfirmText] = useState('');
  const [loading, setLoading] = useState(false);

  const selectedImages = mode === 'single' && image ? [image] : images;

  useEffect(() => {
    if (isOpen) {
      setSafeDelete(true);
      setConfirmText('');
      setLoading(false);
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    if (!validateConfirmation()) {
      showError('Please type the confirmation text correctly');
      return;
    }

    setLoading(true);
    try {
      await onConfirm(safeDelete);
      // Modal will close automatically after successful confirmation
    } catch (error) {
      console.error('Error in delete confirmation:', error);
      setLoading(false);
    }
  };

  const validateConfirmation = () => {
    if (mode === 'single') {
      return confirmText === 'DELETE';
    } else {
      return confirmText === `DELETE ${selectedImages.length}`;
    }
  };

  const getDeleteMessage = () => {
    if (mode === 'single') {
      const imageName = selectedImages[0]?.file_name || selectedImages[0]?.original_name || 'this image';
      return `Are you sure you want to delete "${imageName}"?`;
    } else {
      return `Are you sure you want to delete ${selectedImages.length} image${selectedImages.length !== 1 ? 's' : ''}?`;
    }
  };

  const getWarningMessage = () => {
    if (mode === 'single') {
      const image = selectedImages[0];
      if (image?.is_featured) {
        return "This is a featured image. Deleting it will automatically set another image as featured if available.";
      }
    } else {
      const featuredCount = selectedImages.filter(img => img.is_featured).length;
      if (featuredCount > 0) {
        return `${featuredCount} featured image${featuredCount !== 1 ? 's' : ''} will be deleted. New featured images will be automatically selected if available.`;
      }
    }
    return null;
  };

  const getConfirmationText = () => {
    if (mode === 'single') {
      return "Type DELETE to confirm";
    } else {
      return `Type DELETE ${selectedImages.length} to confirm`;
    }
  };

  const getImagePreview = () => {
    if (mode === 'single' && selectedImages[0]) {
      const image = selectedImages[0];
      return (
        <div className="image-preview">
          <div className="preview-container">
            <img 
              src={image.url || image.image_url || image.thumbnail_url} 
              alt={image.file_name || 'Image to delete'}
              className="preview-image"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="image-placeholder">
              <ImageIcon size={32} />
              <span>Image preview not available</span>
            </div>
          </div>
          <div className="image-info">
            <div className="info-row">
              <strong>File Name:</strong>
              <span>{image.file_name || 'N/A'}</span>
            </div>
            <div className="info-row">
              <strong>Size:</strong>
              <span>{image.file_size_human || 'N/A'}</span>
            </div>
            <div className="info-row">
              <strong>Dimensions:</strong>
              <span>{image.dimensions || 'N/A'}</span>
            </div>
            {image.is_featured && (
              <div className="featured-badge">
                <span>Featured Image</span>
              </div>
            )}
          </div>
        </div>
      );
    } else if (mode === 'bulk' && selectedImages.length > 0) {
      return (
        <div className="bulk-preview">
          <div className="preview-grid">
            {selectedImages.slice(0, 6).map((img, index) => (
              <div key={img.id || index} className="preview-item">
                <div className="preview-container">
                  <img 
                    src={img.url || img.image_url || img.thumbnail_url} 
                    alt={img.file_name || `Image ${index + 1}`}
                    className="preview-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="image-placeholder">
                    <ImageIcon size={16} />
                  </div>
                </div>
                {img.is_featured && (
                  <div className="featured-indicator" title="Featured image">
                    ★
                  </div>
                )}
              </div>
            ))}
            {selectedImages.length > 6 && (
              <div className="more-images">
                +{selectedImages.length - 6} more
              </div>
            )}
          </div>
          <div className="bulk-info">
            <div className="info-row">
              <strong>Total Images:</strong>
              <span>{selectedImages.length}</span>
            </div>
            <div className="info-row">
              <strong>Featured Images:</strong>
              <span>{selectedImages.filter(img => img.is_featured).length}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  if (!isOpen) return null;

  const warningMessage = getWarningMessage();
  const isConfirmValid = validateConfirmation();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="header-icon">
            <Trash2 size={24} className="delete-icon" />
          </div>
          <h2>
            {mode === 'single' ? 'Delete Image' : `Delete ${selectedImages.length} Images`}
          </h2>
          <button 
            className="modal-close" 
            onClick={onClose}
            disabled={loading}
          >
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          <div className="delete-warning">
            <div className="warning-header">
              <AlertTriangle size={32} className="warning-icon" />
              <p className="warning-message">{getDeleteMessage()}</p>
            </div>
            
            {warningMessage && (
              <div className="warning-info">
                <AlertTriangle size={16} />
                <span>{warningMessage}</span>
              </div>
            )}

            <div className="warning-note">
              <p>This action cannot be undone. The image files will be permanently deleted from the server.</p>
            </div>
          </div>

          {/* Image Preview */}
          {getImagePreview()}

          {/* Safe Delete Option */}
          {mode === 'single' && (
            <div className="safe-delete-option">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={safeDelete}
                  onChange={(e) => setSafeDelete(e.target.checked)}
                  disabled={loading}
                />
                <span className="checkbox-text">Safe delete (validate business rules)</span>
              </label>
              <small className="checkbox-description">
                Prevents deletion if this is the only featured image or if it would violate business rules
              </small>
            </div>
          )}

          {/* Confirmation Text Input */}
          <div className="confirmation-input">
            <label htmlFor="confirm-text" className="confirmation-label">
              {getConfirmationText()}
            </label>
            <input
              type="text"
              id="confirm-text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
              placeholder={mode === 'single' ? 'DELETE' : `DELETE ${selectedImages.length}`}
              disabled={loading}
              className="confirmation-field"
              autoComplete="off"
            />
          </div>
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn-delete"
            onClick={handleConfirm}
            disabled={loading || !isConfirmValid}
          >
            {loading ? (
              <>
                <Loader size={16} className="spinner" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={16} />
                {mode === 'single' ? 'Delete Image' : `Delete ${selectedImages.length} Images`}
              </>
            )}
          </button>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content.delete-modal {
          background: #1a1a1a;
          border-radius: 12px;
          padding: 0;
          max-width: 500px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          border: 1px solid #333;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }

        .modal-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 24px 24px 0;
          border-bottom: 1px solid #333;
          padding-bottom: 20px;
        }

        .header-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 8px;
          background: rgba(244, 67, 54, 0.1);
          color: #f44336;
        }

        .delete-icon {
          color: #f44336;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
          color: #fff;
          flex: 1;
        }

        .modal-close {
          background: none;
          border: none;
          color: #888;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-close:hover {
          background: #333;
          color: #fff;
        }

        .modal-close:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .modal-body {
          padding: 24px;
        }

        .delete-warning {
          text-align: center;
          margin-bottom: 24px;
        }

        .warning-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .warning-icon {
          color: #ff9800;
          flex-shrink: 0;
        }

        .warning-message {
          margin: 0;
          font-size: 16px;
          line-height: 1.5;
          color: #fff;
          text-align: left;
          flex: 1;
        }

        .warning-info {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 12px;
          background: rgba(255, 152, 0, 0.1);
          border: 1px solid rgba(255, 152, 0, 0.3);
          border-radius: 6px;
          margin-bottom: 16px;
          font-size: 14px;
          color: #ff9800;
        }

        .warning-note {
          padding: 12px;
          background: rgba(244, 67, 54, 0.1);
          border: 1px solid rgba(244, 67, 54, 0.3);
          border-radius: 6px;
          font-size: 14px;
          color: #f44336;
        }

        .warning-note p {
          margin: 0;
        }

        /* Image Preview Styles */
        .image-preview {
          display: flex;
          gap: 16px;
          margin-bottom: 20px;
          padding: 16px;
          background: #2a2a2a;
          border-radius: 8px;
          border: 1px solid #333;
        }

        .preview-container {
          position: relative;
          width: 120px;
          height: 120px;
          border-radius: 8px;
          overflow: hidden;
          flex-shrink: 0;
          background: #1a1a1a;
        }

        .preview-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .image-placeholder {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: none;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #2a2a2a;
          color: #666;
          font-size: 12px;
          gap: 4px;
        }

        .image-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
        }

        .info-row strong {
          color: #ccc;
        }

        .info-row span {
          color: #fff;
        }

        .featured-badge {
          background: var(--accent-color);
          color: #000;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: bold;
          align-self: flex-start;
        }

        /* Bulk Preview Styles */
        .bulk-preview {
          margin-bottom: 20px;
          padding: 16px;
          background: #2a2a2a;
          border-radius: 8px;
          border: 1px solid #333;
        }

        .preview-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin-bottom: 12px;
        }

        .preview-item {
          position: relative;
          aspect-ratio: 1;
        }

        .preview-item .preview-container {
          width: 100%;
          height: 100%;
        }

        .preview-item .image-placeholder {
          font-size: 10px;
        }

        .featured-indicator {
          position: absolute;
          top: 4px;
          right: 4px;
          background: var(--accent-color);
          color: #000;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: bold;
        }

        .more-images {
          display: flex;
          align-items: center;
          justify-content: center;
          background: #333;
          color: #888;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
        }

        .bulk-info {
          display: flex;
          gap: 16px;
        }

        .bulk-info .info-row {
          flex: 1;
        }

        /* Safe Delete Option */
        .safe-delete-option {
          margin-bottom: 20px;
          padding: 12px;
          background: #2a2a2a;
          border-radius: 6px;
          border: 1px solid #333;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          margin-bottom: 4px;
        }

        .checkbox-label input[type="checkbox"] {
          cursor: pointer;
        }

        .checkbox-text {
          color: #fff;
          font-size: 14px;
        }

        .checkbox-description {
          color: #888;
          font-size: 12px;
          margin-left: 24px;
        }

        /* Confirmation Input */
        .confirmation-input {
          margin-bottom: 20px;
        }

        .confirmation-label {
          display: block;
          margin-bottom: 8px;
          color: #fff;
          font-size: 14px;
          font-weight: 500;
        }

        .confirmation-field {
          width: 100%;
          padding: 12px;
          background: #2a2a2a;
          border: 1px solid #444;
          border-radius: 6px;
          color: #fff;
          font-size: 14px;
          text-transform: uppercase;
          font-family: monospace;
        }

        .confirmation-field:focus {
          outline: none;
          border-color: var(--accent-color);
        }

        .confirmation-field:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Modal Actions */
        .modal-actions {
          display: flex;
          gap: 12px;
          padding: 0 24px 24px;
        }

        .btn-cancel {
          flex: 1;
          padding: 12px 20px;
          background: #333;
          color: #fff;
          border: 1px solid #444;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
        }

        .btn-cancel:hover:not(:disabled) {
          background: #444;
          border-color: #555;
        }

        .btn-cancel:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-delete {
          flex: 1;
          padding: 12px 20px;
          background: #d32f2f;
          color: #fff;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s;
        }

        .btn-delete:hover:not(:disabled) {
          background: #f44336;
        }

        .btn-delete:disabled {
          background: #666;
          cursor: not-allowed;
          opacity: 0.6;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Responsive Design */
        @media (max-width: 640px) {
          .modal-content.delete-modal {
            margin: 20px;
            max-width: none;
          }

          .image-preview {
            flex-direction: column;
            text-align: center;
          }

          .preview-container {
            align-self: center;
          }

          .preview-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .modal-actions {
            flex-direction: column-reverse;
          }
        }
      `}</style>
    </div>
  );
};

export default GalleryImageDeleteModal;