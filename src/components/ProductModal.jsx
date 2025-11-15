import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import star from '../assets/images/star.png';
import CartImg from '../assets/images/cart1.svg';

const ProductModal = ({ product, onClose }) => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const images = [];
  if (product) {
    // Use gallery images which have full URLs
    if (product.gallery_images && product.gallery_images.length > 0) {
      product.gallery_images.forEach(img => {
        const imgUrl = img.url || img;
        images.push(imgUrl);
      });
    }
  }

  const formatPrice = (price) => {
    return `Rs.${parseFloat(price).toLocaleString()}`;
  };

  const handleViewFullDetails = () => {
    navigate(`/product/${product.guid}`);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
      <div className="modal-content product-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '1000px', maxHeight: '90vh', overflow: 'auto' }}>
        <div className="modal-header">
          <h2>Product Details</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body" style={{ padding: '24px' }}>
          <div className="row">
            {/* Left - Images */}
            <div className="col-12 col-md-6">
              {images.length > 0 && (
                <>
                  {/* Main Image */}
                  <div className="main-image" style={{ marginBottom: '16px' }}>
                    <img
                      src={images[selectedImage]}
                      alt={product.name}
                      style={{
                        width: '100%',
                        height: '400px',
                        objectFit: 'cover',
                        borderRadius: '12px',
                        border: '1px solid #3a3a3a'
                      }}
                    />
                  </div>

                  {/* Thumbnail Gallery */}
                  {images.length > 1 && (
                    <div style={{ display: 'flex', gap: '12px', overflowX: 'auto' }}>
                      {images.map((img, idx) => (
                        <div
                          key={idx}
                          onClick={() => setSelectedImage(idx)}
                          style={{
                            width: '80px',
                            height: '80px',
                            flexShrink: 0,
                            cursor: 'pointer',
                            border: selectedImage === idx ? '2px solid var(--accent-color)' : '1px solid #3a3a3a',
                            borderRadius: '8px',
                            overflow: 'hidden'
                          }}
                        >
                          <img
                            src={img}
                            alt={`${product.name} ${idx + 1}`}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Right - Product Info */}
            <div className="col-12 col-md-6">
              <div className="product-info">
                {product.is_featured === 1 && (
                  <div style={{ marginBottom: '12px' }}>
                    <span style={{
                      background: 'var(--accent-color)',
                      color: '#000',
                      padding: '4px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      ⭐ FEATURED
                    </span>
                  </div>
                )}

                <h1 className="product-title mb-16">{product.name}</h1>

                <div className="reviews-container mb-16">
                  <div className="reviews">
                    {[...Array(5)].map((_, i) => (
                      <img src={star} alt="" key={i} />
                    ))}
                  </div>
                  <span className="text">(250+ reviews)</span>
                </div>

                <div className="price-section mb-24">
                  {product.discount_price && parseFloat(product.discount_price) > 0 ? (
                    <>
                      <span style={{ textDecoration: 'line-through', opacity: 0.6, marginRight: '12px', fontSize: '18px' }}>
                        {formatPrice(product.price)}
                      </span>
                      <span style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--accent-color)' }}>
                        {formatPrice(product.discount_price)}
                      </span>
                      <span style={{ marginLeft: '12px', background: '#ff4444', padding: '4px 8px', borderRadius: '4px', fontSize: '14px' }}>
                        Save {Math.round(((product.price - product.discount_price) / product.price) * 100)}%
                      </span>
                    </>
                  ) : (
                    <span style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--accent-color)' }}>
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>

                {product.description && (
                  <div style={{ marginBottom: '24px' }}>
                    <h4 style={{ marginBottom: '12px' }}>Description</h4>
                    <p style={{ lineHeight: '1.6', opacity: 0.9 }}>
                      {product.description.substring(0, 200)}...
                    </p>
                  </div>
                )}

                {product.flavor && (
                  <div style={{ marginBottom: '24px' }}>
                    <h4 style={{ marginBottom: '8px' }}>Flavor</h4>
                    <div style={{
                      padding: '8px 16px',
                      background: '#2c2c2c',
                      borderRadius: '8px',
                      display: 'inline-block'
                    }}>
                      {product.flavor}
                    </div>
                  </div>
                )}

                <div className="quantity-section mb-24">
                  <h4 className="mb-16">Quantity</h4>
                  <div className="quantity-controls" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                      className="qty-btn"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      style={{
                        width: '40px',
                        height: '40px',
                        border: '1px solid #3a3a3a',
                        background: '#1a1a1a',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '20px'
                      }}
                    >
                      -
                    </button>
                    <span style={{ fontSize: '18px', minWidth: '40px', textAlign: 'center' }}>{quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => setQuantity(quantity + 1)}
                      style={{
                        width: '40px',
                        height: '40px',
                        border: '1px solid #3a3a3a',
                        background: '#1a1a1a',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '20px'
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="action-buttons" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button className="button w-100">
                    Add to Cart ({quantity})
                    <img src={CartImg} alt="" style={{ marginLeft: '8px' }} />
                  </button>
                  <button className="button-border w-100" onClick={handleViewFullDetails}>
                    View Full Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
