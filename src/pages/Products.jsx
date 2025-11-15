import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productAPI } from '../services/api.service';
import { useToast } from '../context/ToastContext';
import star from '../assets/images/star.png';
import CartImg from '../assets/images/cart1.svg';

// Helper function to get full image URL
const getFullImageUrl = (imagePath) => {
  if (!imagePath) return null;
  // Check if imagePath is a string
  if (typeof imagePath !== 'string') return null;
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  // Handle file system paths
  if (imagePath.includes('/storage/uploads/')) {
    const baseUrl = 'https://startuppakistan.himalayatool.com';
    const storagePath = imagePath.substring(imagePath.indexOf('/storage/uploads/'));
    return `${baseUrl}${storagePath}`;
  }
  const baseUrl = 'https://startuppakistan.himalayatool.com';
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${baseUrl}${cleanPath}`;
};

const Products = () => {
  const navigate = useNavigate();
  const { showError } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 12;

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await productAPI.getProducts({
        page: currentPage,
        per_page: perPage
      });
      
      if (response.success) {
        setProducts(response.data || []);
        setTotalPages(response.pagination?.last_page || 1);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      showError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (productGuid) => {
    navigate(`/product/${productGuid}`);
  };

  const getProductImage = (product) => {
    // Use image_url first
    if (product.image_url) {
      return getFullImageUrl(product.image_url);
    }
    // Use gallery images - each object has image_url property
    if (product.gallery_images && product.gallery_images.length > 0) {
      const firstImg = product.gallery_images[0];
      const imageUrl = typeof firstImg === 'object' ? firstImg.image_url : firstImg;
      return getFullImageUrl(imageUrl);
    }
    // Fallback to emoji if no images
    return null;
  };

  const formatPrice = (price) => {
    return `Rs.${parseFloat(price).toLocaleString()}`;
  };

  return (
    <div className="products-page-container">
      <div className="products-page top-100">
        <div className="content">
          <h3 className="title mb-8">
            Premium Supplements
            <br />
            100% Authentic Products | Guaranteed Quality
          </h3>
        </div>
      </div>
      <div className="dark-bg padding-60">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-32">
            <h3 className="title-medium">All Supplements ({products.length} products)</h3>
            <div className="filters" style={{ display: 'flex', gap: '12px' }}>
              {/* Add filters here if needed */}
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div className="loader"></div>
              <p style={{ marginTop: '20px' }}>Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <h3>No products found</h3>
              <p style={{ marginTop: '12px', opacity: 0.7 }}>Check back later for new products</p>
            </div>
          ) : (
            <>
              <div className="row">
                {products.map((product) => (
                  <div className="col-12 col-md-6 col-lg-3" key={product.id}>
                  <div className="product-card" style={{ cursor: 'pointer' }}>
                    <div className="image" onClick={() => handleProductClick(product.guid)}>
                      {getProductImage(product) ? (
                        <img 
                          src={getProductImage(product)} 
                          alt={product.name}
                          onError={(e) => {
                            console.error('Image failed to load:', getProductImage(product));
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = '<div style="fontSize: 60px; textAlign: center; padding: 40px 0;">📦</div>';
                          }}
                        />
                      ) : (
                        <div style={{ fontSize: '60px', textAlign: 'center', padding: '40px 0' }}>
                          📦
                        </div>
                      )}
                    </div>
                    <h3 className="name">{product.name}</h3>
                      <div className="reviews-container">
                        <div className="reviews">
                          {[...Array(5)].map((_, i) => (
                            <img src={star} alt="" key={i} />
                          ))}
                        </div>
                        <div className="text">(250)</div>
                      </div>
                      <p className="desc">
                        {product.description ? product.description.substring(0, 80) + '...' : 'Premium quality supplement for your fitness goals'}
                      </p>
                      <div className="bottom">
                        <div className="price-section">
                          {product.discount_price && parseFloat(product.discount_price) > 0 ? (
                            <>
                              <span className="original-price" style={{ textDecoration: 'line-through', opacity: 0.6, marginRight: '8px' }}>
                                {formatPrice(product.price)}
                              </span>
                              <span className="price">{formatPrice(product.discount_price)}</span>
                            </>
                          ) : (
                            <div className="price">{formatPrice(product.price)}</div>
                          )}
                        </div>
                        <button className="button" onClick={() => handleProductClick(product.guid)}>
                          View Details
                          <img src={CartImg} alt="" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination" style={{ marginTop: '40px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                  <button
                    className="page-btn"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    style={{ opacity: currentPage === 1 ? 0.5 : 1 }}
                  >
                    &lt;
                  </button>
                  {[...Array(totalPages)].map((_, idx) => (
                    <button
                      key={idx}
                      className={`page-btn ${currentPage === idx + 1 ? 'active' : ''}`}
                      onClick={() => setCurrentPage(idx + 1)}
                    >
                      {idx + 1}
                    </button>
                  ))}
                  <button
                    className="page-btn"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    style={{ opacity: currentPage === totalPages ? 0.5 : 1 }}
                  >
                    &gt;
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

export default Products;
