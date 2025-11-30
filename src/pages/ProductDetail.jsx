import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productAPI } from "../services/api.service";
import { useToast } from "../context/ToastContext";
import Prod1 from "../assets/images/p1.png";
import Prod2 from "../assets/images/p2.png";
import Prod3 from "../assets/images/p3.png";
import Prod4 from "../assets/images/p4.png";
import star from "../assets/images/star.png";
import Close from "../assets/images/close.svg";
import CartImg from "../assets/images/cart1.svg";
import User1 from "../assets/images/user1.jpg";
import User2 from "../assets/images/user2.jpg";

// Helper function to get full image URL
const getFullImageUrl = (imagePath) => {
  const baseUrl = import.meta.env.VITE_APP_BASE_URL

  if (!imagePath) return null;
  // Check if imagePath is a string
  if (typeof imagePath !== 'string') return null;
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  // Handle file system paths
  if (imagePath.includes('/storage/uploads/')) {
    const storagePath = imagePath.substring(imagePath.indexOf('/storage/uploads/'));
    return `${baseUrl}${storagePath}`;
  }
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${baseUrl}${cleanPath}`;
};

const productImages = [Prod1, Prod2, Prod3, Prod4];

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showError } = useToast();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [closed, setClosed] = useState(false);
  const [selectedFlavor, setSelectedFlavor] = useState('');
  const [activeReviewFilter, setActiveReviewFilter] = useState('All Reviews');

  useEffect(() => {
    if (id) {
      fetchProductDetails();
      fetchRelatedProducts();
    }
  }, [id]);

  const fetchRelatedProducts = async () => {
    try {
      const response = await productAPI.getProducts({ page: 1, per_page: 4 });
      if (response.success) {
        setRelatedProducts((response.data || []).filter(p => p.guid !== id));
      }
    } catch (error) {
      console.error('Error fetching related products:', error);
    }
  };

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const response = await productAPI.getProductById(id);
      if (response.success) {
        setProduct(response.data);
        if (response.data.flavor) {
          setSelectedFlavor(response.data.flavor);
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      showError('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const productImages = [];
  if (product) {
    // Add main image first if available
    if (product.image_url) {
      productImages.push(getFullImageUrl(product.image_url));
    }
    // Add gallery images - each object has image_url property
    if (product.gallery_images && product.gallery_images.length > 0) {
      product.gallery_images.forEach(img => {
        // Handle both object with image_url and direct string
        const imgUrl = typeof img === 'object' ? img.image_url : img;
        if (imgUrl) {
          productImages.push(getFullImageUrl(imgUrl));
        }
      });
    }
  }

  // Use placeholder images if no product images
  const displayImages = productImages.length > 0 ? productImages : [Prod1, Prod2, Prod3, Prod4];

  const formatPrice = (price) => {
    return `Rs.${parseFloat(price).toLocaleString()}`;
  };

  const flavors = ['Glacial Grape', 'Blue Raspberry'];
  const reviewFilters = ['All Reviews', 'With Photo & Video', 'With Description'];

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'benefits', label: 'Benefits' },
    { id: 'suggested', label: 'Suggested Use' },
    { id: 'nutrition', label: 'Nutritional Information' },
    { id: 'reviews', label: 'Reviews' },
  ];

  if (loading) {
    return (
      <div className="product-detail-page top-100 dark-bg" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="loader"></div>
          <p style={{ marginTop: '20px' }}>Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-page top-100 dark-bg" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h2>Product not found</h2>
          <button className="button" onClick={() => navigate('/products')} style={{ marginTop: '20px' }}>
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-page top-100">
      {/* Info Bar */}
      <div className="empty-page dark-bg">
{
!closed && <div className="info-bar bg-gray ">
    <div className="icon" onClick={() => setClosed(true)} style={{ cursor: 'pointer' }}>
        <img src={Close} alt="" />
    </div>
        Limited time offer: 40% off on first order of $65+ 
      </div>
}
      </div>
      

      {/* Product Details Section */}
      <div className="product-detail-section dark-bg padding-40">
        <div className="container">
          <div className="row">
            {/* Left - Thumbnail Images */}
            <div className="col-12 col-md-2">
              <div className="thumbnail-gallery">
                {displayImages.map((img, idx) => (
                  <div
                    key={idx}
                    className={`thumbnail ${selectedImage === idx ? 'active' : ''}`}
                    onClick={() => setSelectedImage(idx)}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} />
                  </div>
                ))}
              </div>
            </div>

            {/* Center - Main Image */}
            <div className="col-12 col-md-5">
              <div className="main-image">
                <img src={displayImages[selectedImage]} alt={product.name} />
              </div>
            </div>

            {/* Right - Product Info */}
            <div className="col-12 col-md-5">
              <div className="product-info">
                <div className="reviews-container mb-16">
                  <div className="reviews">
                    {[...Array(5)].map((_, i) => (
                      <img src={star} alt="" key={i} />
                    ))}
                  </div>
                  <span className="text">35,000+ 5 stars for Factor on Trustpilot</span>
                </div>

                <h1 className="product-title mb-16">{product.name}</h1>

                <div className="price-section mb-16">
                  {product.discount_price && parseFloat(product.discount_price) > 0 ? (
                    <>
                      <span className="original-price">{formatPrice(product.price)}</span>
                      <span className="current-price">{formatPrice(product.discount_price)}</span>
                    </>
                  ) : (
                    <span className="current-price">{formatPrice(product.price)}</span>
                  )}
                </div>

                {product.flavor && (
                  <div className="flavor-section mb-24">
                    <h4 className="mb-16 title-small">Flavor</h4>
                    <div className="flavor-options">
                      <button className="flavor-btn active">
                        {product.flavor}
                      </button>
                    </div>
                  </div>
                )}

                <div className="quantity-section mb-24">
                  <h4 className="mb-16 title-small">Quantity</h4>
                  <div className="quantity-controls">
                    <button 
                      className="qty-btn" 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </button>
                    <span className="qty-display">{quantity}</span>
                    <button 
                      className="qty-btn" 
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="action-buttons">
                  <button className="button w-100 mb-16">
                    Add to Cart
                    
                  </button>
                  <button className="button-border w-100">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="product-tabs-section dark-bg padding-40">
        <div className="container">
          {/* Tab Headers */}
          <div className="tabs-header mb-32">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'description' && (
              <div className="description-content">
                <h3 className="mb-24">Product Description</h3>
                <p className="mb-16">
                  {product.description || 'No description available for this product.'}
                </p>
              </div>
            )}
            
            {activeTab === 'benefits' && (
              <div className="benefits-content">
                <h3 className="mb-24">Benefits</h3>
                <div dangerouslySetInnerHTML={{ __html: product.benefits || '<p>No benefits information available.</p>' }} />
              </div>
            )}

            {activeTab === 'suggested' && (
              <div className="suggested-content">
                <h3 className="mb-24">Suggested Use</h3>
                <div dangerouslySetInnerHTML={{ __html: product.suggested_use || '<p>No suggested use information available.</p>' }} />
              </div>
            )}
            
            {activeTab === 'nutrition' && (
              <div className="nutrition-content">
                <h3 className="mb-24">Nutritional Information</h3>
                <div dangerouslySetInnerHTML={{ __html: product.nutritional_information || '<p>No nutritional information available.</p>' }} />
              </div>
            )}
              {activeTab === 'reviews' && (
              <div className="product-reviews">
                <div className="row">
                  {/* Left side - Rating Summary */}
                  <div className="col-12 col-lg-12">
                    <div className="reviews-summary">
                      <div className="overall-rating">
                        <div className="rating-score">4.9</div>
                        <div className="rating-right">
                            <div className="rating-stars">
                          {[...Array(5)].map((_, i) => (
                            <img src={star} alt="" key={i} />
                          ))}
                        </div>
                        <div className="rating-text">From 125k reviews</div>
                        </div>
                      </div>
                      
                      <div className="rating-breakdown">
                        <div className="rating-row">
                          <div className="stars-label">
                            <img src={star} alt="" />
                            <span>5</span>
                          </div>
                          <div className="progress-bar">
                            <div className="progress-fill" style={{width: '85%'}}></div>
                          </div>
                        </div>
                        <div className="rating-row">
                          <div className="stars-label">
                            <img src={star} alt="" />
                            <span>4</span>
                          </div>
                          <div className="progress-bar">
                            <div className="progress-fill" style={{width: '10%'}}></div>
                          </div>
                        </div>
                        <div className="rating-row">
                          <div className="stars-label">
                            <img src={star} alt="" />
                            <span>3</span>
                          </div>
                          <div className="progress-bar">
                            <div className="progress-fill" style={{width: '3%'}}></div>
                          </div>
                        </div>
                        <div className="rating-row">
                          <div className="stars-label">
                            <img src={star} alt="" />
                            <span>2</span>
                          </div>
                          <div className="progress-bar">
                            <div className="progress-fill" style={{width: '1%'}}></div>
                          </div>
                        </div>
                        <div className="rating-row">
                          <div className="stars-label">
                            <img src={star} alt="" />
                            <span>1</span>
                          </div>
                          <div className="progress-bar">
                            <div className="progress-fill" style={{width: '1%'}}></div>
                          </div>
                        </div>
                      </div>
                      
                      <button className="write-review-btn">Write a Review</button>
                    </div>
                  </div>
                  
                  {/* Right side - Reviews List */}
                  <div className="col-12 col-lg-12">
                    <div className="reviews-section">
                        <div className="left">
                              <div className="reviews-left-filters">
                        <h5>Reviews Filter</h5>
                        <div className="hr"></div>
                        <div className="rating-filters">
                          <h6>Rating</h6>
                          <div className="hr"></div>
                          <div className="rating-checkboxes">
                            <label>
                              <input type="checkbox" />
                              <span className="rating-stars-small">
                                {[...Array(5)].map((_, i) => (
                                  <img src={star} alt="" key={i} />
                                ))}
                              </span>
                              <span>5</span>
                            </label>
                            <label>
                              <input type="checkbox" />
                              <span className="rating-stars-small">
                                {[...Array(4)].map((_, i) => (
                                  <img src={star} alt="" key={i} />
                                ))}
                              </span>
                              <span>4</span>
                            </label>
                            <label>
                              <input type="checkbox" />
                              <span className="rating-stars-small">
                                {[...Array(3)].map((_, i) => (
                                  <img src={star} alt="" key={i} />
                                ))}
                              </span>
                              <span>3</span>
                            </label>
                            <label>
                              <input type="checkbox" />
                              <span className="rating-stars-small">
                                {[...Array(2)].map((_, i) => (
                                  <img src={star} alt="" key={i} />
                                ))}
                              </span>
                              <span>2</span>
                            </label>
                            <label>
                              <input type="checkbox" />
                              <span className="rating-stars-small">
                                {[...Array(1)].map((_, i) => (
                                  <img src={star} alt="" key={i} />
                                ))}
                              </span>
                              <span>1</span>
                            </label>
                          </div>
                        </div>
                      </div>
                        </div>
                        <div className="right">
 <div className="reviews-header">
                        <h4>Review Lists</h4>
                        <div className="review-filters">
                          {reviewFilters.map((filter) => (
                            <button 
                              key={filter}
                              className={`filter-btn ${activeReviewFilter === filter ? 'active' : ''}`}
                              onClick={() => setActiveReviewFilter(filter)}
                            >
                              {filter}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                    
                      
                      <div className="reviews-list">
                        {[1, 2, 3, 4].map((review, idx) => (
                          <div key={idx} className="review-item">
                            <div className="review-stars">
                              {[...Array(5)].map((_, i) => (
                                <img src={star} alt="" key={i} />
                              ))}
                            </div>
                            <h6 className="review-title">This is amazing product I have.</h6>
                            <div className="review-date">July 2, 2020 03:26 PM</div>
                            <div className="reviewer-info">
                              <div className="reviewer-avatar">
                                <img src={User1} alt="" />
                              </div>
                              <span className="reviewer-name">Darrel Steward</span>
                            </div>
                          </div>
                        ))}
                      </div>
                        </div>
                     
                      
                    
                    </div>
                      <div className="pagination">
                        <button className="page-btn">&lt;</button>
                        <button className="page-btn">1</button>
                        <button className="page-btn active">2</button>
                        <button className="page-btn">3</button>
                        <button className="page-btn">4</button>
                        <button className="page-btn">&gt;</button>
                      </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="related-products-section padding-40 dark-bg">
          <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-24">
              <h3 className="title-medium">You may also like</h3>
              <a href="/products" className="view-all" onClick={(e) => { e.preventDefault(); navigate('/products'); }}>
                View All
              </a>
            </div>
            <div className="row">
              {relatedProducts.slice(0, 4).map((relatedProduct) => {
                const prodImage = relatedProduct.image_url 
                  ? getFullImageUrl(relatedProduct.image_url)
                  : (relatedProduct.gallery_images && relatedProduct.gallery_images.length > 0
                    ? getFullImageUrl(typeof relatedProduct.gallery_images[0] === 'object' ? relatedProduct.gallery_images[0].image_url : relatedProduct.gallery_images[0])
                    : null);
                
                return (
                  <div className="col-12 col-md-6 col-lg-3" key={relatedProduct.id}>
                    <div className="product-card" style={{ cursor: 'pointer' }} onClick={() => navigate(`/product/${relatedProduct.guid}`)}>
                      <div className="image">
                        {prodImage ? (
                          <img 
                            src={prodImage} 
                            alt={relatedProduct.name}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentElement.innerHTML = '<div style="fontSize: 48px; textAlign: center; padding: 30px 0;">📦</div>';
                            }}
                          />
                        ) : (
                          <div style={{ fontSize: '48px', textAlign: 'center', padding: '30px 0' }}>
                            📦
                          </div>
                        )}
                      </div>
                      <h3 className="name">{relatedProduct.name}</h3>
                      <p className="desc">
                        {relatedProduct.description ? relatedProduct.description.substring(0, 60) + '...' : 'Quality fitness product'}
                      </p>
                      <div className="bottom">
                        <div className="price">{formatPrice(relatedProduct.discount_price && parseFloat(relatedProduct.discount_price) > 0 ? relatedProduct.discount_price : relatedProduct.price)}</div>
                        <button className="button" onClick={(e) => { e.stopPropagation(); navigate(`/product/${relatedProduct.guid}`); }}>
                          View Details
                          <img src={CartImg} alt="" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;