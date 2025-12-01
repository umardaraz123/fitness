import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { planAPI } from "../services/api.service";
import { useToast } from "../context/ToastContext";
import { useCart } from "../context/CartContext";
import CartImg from "../assets/images/cart1.svg";

// Helper function to get full image URL
const getFullImageUrl = (imagePath) => {

  const baseUrl = import.meta.env.VITE_APP_BASE_URL

  if (!imagePath) return null;
  // Check if imagePath is a string
  if (typeof imagePath !== 'string') return null;
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  // Handle file system paths (e.g., /home/himaqjjt/startuppakistan.himalayatool.com/storage/uploads/...)
  if (imagePath.includes('/storage/uploads/')) {
    const storagePath = imagePath.substring(imagePath.indexOf('/storage/uploads/'));
    return `${baseUrl}${storagePath}`;
  }
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${baseUrl}${cleanPath}`;
};

const PlanDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();
  const { addToCart } = useCart();
  
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedImage, setSelectedImage] = useState('');
  const [relatedPlans, setRelatedPlans] = useState([]);

  useEffect(() => {
    fetchPlanDetail();
    fetchRelatedPlans();
  }, [id]);

  const fetchPlanDetail = async () => {
    setLoading(true);
    try {
      const response = await planAPI.getPlanById(id);
      
      if (response.success && response.data) {
        const planData = response.data;
        setPlan(planData);
        
        // Set initial selected image - API returns full URLs
        if (planData.image_url) {
          // Clean URL (remove escaped slashes if any)
          setSelectedImage(planData.image_url.replace(/\\\//g, '/'));
        } else if (planData.gallery_images && planData.gallery_images.length > 0) {
          const firstImage = planData.gallery_images[0];
          const imageUrl = firstImage.image_url || firstImage;
          setSelectedImage(typeof imageUrl === 'string' ? imageUrl.replace(/\\\//g, '/') : '');
        }
      }
    } catch (error) {
      console.error('Error fetching plan detail:', error);
      showError('Failed to load plan details');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedPlans = async () => {
    try {
      const response = await planAPI.getPlans({ page: 1, per_page: 4 });
      if (response.success) {
        setRelatedPlans(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching related plans:', error);
    }
  };

  const handleAddToCart = () => {
    if (!plan) return;
    
    addToCart({
      id: plan.id,
      guid: plan.guid,
      title: plan.title,
      price: plan.has_discount && plan.sale_price ? plan.sale_price : plan.current_price || plan.price,
      image: selectedImage,
      type: 'plan'
    });
    
    showSuccess('Plan added to cart!');
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  const formatPrice = (price) => {
    return `Rs.${parseFloat(price).toLocaleString()}`;
  };

  const getGalleryImages = () => {
    if (!plan) return [];
    const images = [];
    
    // Add main image first
    if (plan.image_url) {
      // Clean the URL (remove escaped slashes if any)
      const cleanUrl = plan.image_url.replace(/\\\//g, '/');
      images.push(cleanUrl);
    }
    
    // Add gallery images
    if (plan.gallery_images && plan.gallery_images.length > 0) {
      for (let i = 0; i < plan.gallery_images.length; i++) {
        const img = plan.gallery_images[i];
        const imageUrl = img.image_url;
        
        if (imageUrl) {
          // Clean the URL (remove escaped slashes if any)
          const cleanUrl = imageUrl.replace(/\\\//g, '/');
          if (!images.includes(cleanUrl)) {
            images.push(cleanUrl);
          }
        }
      }
    }
    
    return images;
  };

  if (loading) {
    return (
      <div className="dark-bg padding-60" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="loader"></div>
          <p style={{ marginTop: '20px' }}>Loading plan details...</p>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="dark-bg padding-60" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h2>Plan not found</h2>
          <button className="button" onClick={() => navigate('/plans')} style={{ marginTop: '20px' }}>
            Back to Plans
          </button>
        </div>
      </div>
    );
  }

  const galleryImages = getGalleryImages();

  return (
    <div className="plan-detail-page top-100">
      {/* Info Bar / Spacer */}
      <div className="empty-page dark-bg">
      </div>

      <div className="product-detail-section dark-bg padding-40">
        <div className="container">
          <div className="row mb-60">
            <div className="col-md-6">
              <div style={{ display: 'flex', gap: '16px' }}>
                {/* Thumbnail Gallery on Left */}
                {galleryImages.length > 0 && (
                  <div className="thumbnail-gallery" style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '500px', overflowY: 'auto' }}>
                    {galleryImages.map((img, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedImage(img)}
                        style={{
                          width: '80px',
                          height: '80px',
                          cursor: 'pointer',
                          border: selectedImage === img ? '2px solid #ff6b35' : '2px solid rgba(255,255,255,0.2)',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          flexShrink: 0,
                          background: 'rgba(255,255,255,0.05)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <img 
                          src={img} 
                          alt={`${plan.title} ${idx + 1}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            // Image failed to load (403 error), show placeholder
                            e.target.onerror = null;
                            e.target.style.display = 'none';
                            e.target.parentElement.style.fontSize = '28px';
                            e.target.parentElement.innerText = '🏋️';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Main Image on Right */}
                <div className="main-image" style={{ flex: 1 }}>
                  {selectedImage ? (
                    <img 
                      src={selectedImage} 
                      alt={plan.title}
                      style={{ width: '100%', height: '500px', objectFit: 'cover', borderRadius: '12px' }}
                      onError={(e) => {
                        console.error('Image failed to load:', selectedImage);
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<div style="width: 100%; height: 500px; display: flex; alignItems: center; justifyContent: center; fontSize: 80px; background: rgba(255,255,255,0.05); borderRadius: 12px;">🏋️</div>';
                      }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '80px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                      🏋️
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <h1 className="title-medium mb-3">{plan.title}</h1>
              
              {/* Badges */}
              <div className="badges mb-3" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {plan.plan_type_label && (
                  <span className="badge" style={{ padding: '6px 12px', background: 'rgba(255,107,53,0.2)', color: '#ff6b35', borderRadius: '20px', fontSize: '14px' }}>
                    {plan.plan_type_label}
                  </span>
                )}
                {plan.goal_label && (
                  <span className="badge" style={{ padding: '6px 12px', background: 'rgba(76,175,80,0.2)', color: '#4caf50', borderRadius: '20px', fontSize: '14px' }}>
                    {plan.goal_label}
                  </span>
                )}
                {plan.duration && (
                  <span className="badge" style={{ padding: '6px 12px', background: 'rgba(33,150,243,0.2)', color: '#2196f3', borderRadius: '20px', fontSize: '14px' }}>
                    {plan.duration}
                  </span>
                )}
              </div>

              {/* Short Description */}
              {plan.short_description && (
                <p className="desc mb-4" style={{ fontSize: '16px', lineHeight: '1.6' }}>
                  {plan.short_description}
                </p>
              )}

              {/* Price Section */}
              <div className="price-section mb-4">
                {plan.has_discount && plan.sale_price ? (
                  <div>
                    <span style={{ textDecoration: 'line-through', opacity: 0.6, marginRight: '12px', fontSize: '24px' }}>
                      {formatPrice(plan.price)}
                    </span>
                    <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#ff6b35' }}>
                      {formatPrice(plan.sale_price)}
                    </span>
                    <span style={{ marginLeft: '12px', padding: '4px 8px', background: '#ff6b35', borderRadius: '4px', fontSize: '14px' }}>
                      SAVE {Math.round(((plan.price - plan.sale_price) / plan.price) * 100)}%
                    </span>
                  </div>
                ) : (
                  <span style={{ fontSize: '32px', fontWeight: 'bold' }}>
                    {formatPrice(plan.current_price || plan.price)}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="action-buttons" style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
                <button className="button" onClick={handleAddToCart} style={{ flex: 1 }}>
                  Add to Cart
                  <img src={CartImg} alt="" />
                </button>
                <button className="button secondary" onClick={handleBuyNow} style={{ flex: 1 }}>
                  Buy Now
                </button>
              </div>

              {/* Quick Info */}
              <div className="quick-info" style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '8px' }}>
                <h4 style={{ marginBottom: '16px' }}>Plan Highlights</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {plan.features && Array.isArray(plan.features) ? (
                    plan.features.slice(0, 5).map((feature, idx) => (
                      <li key={idx} style={{ padding: '8px 0', display: 'flex', alignItems: 'center' }}>
                        <span style={{ color: '#4caf50', marginRight: '8px' }}>✓</span>
                        {typeof feature === 'string' ? feature : feature.name || feature.title}
                      </li>
                    ))
                  ) : (
                    <>
                      <li style={{ padding: '8px 0', display: 'flex', alignItems: 'center' }}>
                        <span style={{ color: '#4caf50', marginRight: '8px' }}>✓</span>
                        Personalized workout schedule
                      </li>
                      <li style={{ padding: '8px 0', display: 'flex', alignItems: 'center' }}>
                        <span style={{ color: '#4caf50', marginRight: '8px' }}>✓</span>
                        Professional guidance
                      </li>
                      <li style={{ padding: '8px 0', display: 'flex', alignItems: 'center' }}>
                        <span style={{ color: '#4caf50', marginRight: '8px' }}>✓</span>
                        Progress tracking
                      </li>
                      <li style={{ padding: '8px 0', display: 'flex', alignItems: 'center' }}>
                        <span style={{ color: '#4caf50', marginRight: '8px' }}>✓</span>
                        Nutrition guidance
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="custom-tabs mb-40" style={{ marginTop: '60px' }}>
            <div
              className={`tab${activeTab === 'description' ? ' active' : ''}`}
              onClick={() => setActiveTab('description')}
              style={{ cursor: 'pointer' }}
            >
              Description
            </div>
            <div
              className={`tab${activeTab === 'features' ? ' active' : ''}`}
              onClick={() => setActiveTab('features')}
              style={{ cursor: 'pointer' }}
            >
              Features
            </div>
            <div
              className={`tab${activeTab === 'schedule' ? ' active' : ''}`}
              onClick={() => setActiveTab('schedule')}
              style={{ cursor: 'pointer' }}
            >
              Schedule
            </div>
            <div
              className={`tab${activeTab === 'pricing' ? ' active' : ''}`}
              onClick={() => setActiveTab('pricing')}
              style={{ cursor: 'pointer' }}
            >
              Pricing Details
            </div>
            <div
              className={`tab${activeTab === 'reviews' ? ' active' : ''}`}
              onClick={() => setActiveTab('reviews')}
              style={{ cursor: 'pointer' }}
            >
              Reviews
            </div>
          </div>

          {/* Tab Content */}
          <div className="tab-content" style={{ marginBottom: '60px' }}>
            {activeTab === 'description' && (
              <div>
                <h3 className="mb-3">About This Plan</h3>
                <p style={{ lineHeight: '1.8', fontSize: '16px' }}>
                  {plan.long_description || plan.description || plan.short_description || 'No description available.'}
                </p>
              </div>
            )}

            {activeTab === 'features' && (
              <div>
                <h3 className="mb-3">Plan Features</h3>
                {plan.features && Array.isArray(plan.features) && plan.features.length > 0 ? (
                  <ul style={{ lineHeight: '2', fontSize: '16px' }}>
                    {plan.features.map((feature, idx) => (
                      <li key={idx}>
                        {typeof feature === 'string' ? feature : feature.name || feature.title || feature.description}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No features listed for this plan.</p>
                )}
              </div>
            )}

            {activeTab === 'schedule' && (
              <div>
                <h3 className="mb-3">Workout Schedule</h3>
                {plan.schedule ? (
                  <div style={{ lineHeight: '1.8', fontSize: '16px' }}>
                    {typeof plan.schedule === 'string' ? (
                      <p>{plan.schedule}</p>
                    ) : (
                      <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                        {JSON.stringify(plan.schedule, null, 2)}
                      </pre>
                    )}
                  </div>
                ) : (
                  <p>Schedule information will be provided upon enrollment.</p>
                )}
              </div>
            )}

            {activeTab === 'pricing' && (
              <div>
                <h3 className="mb-3">Pricing Details</h3>
                <div style={{ fontSize: '16px', lineHeight: '1.8' }}>
                  <p><strong>Plan Type:</strong> {plan.plan_type_label || 'Standard Plan'}</p>
                  <p><strong>Base Price:</strong> {formatPrice(plan.price)}</p>
                  {plan.has_discount && plan.sale_price && (
                    <>
                      <p><strong>Discounted Price:</strong> {formatPrice(plan.sale_price)}</p>
                      <p><strong>You Save:</strong> {formatPrice(plan.price - plan.sale_price)} ({Math.round(((plan.price - plan.sale_price) / plan.price) * 100)}%)</p>
                    </>
                  )}
                  {plan.duration && (
                    <p><strong>Duration:</strong> {plan.duration}</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h3 className="mb-3">Customer Reviews</h3>
                <p style={{ fontSize: '16px', opacity: 0.7 }}>
                  No reviews yet. Be the first to review this plan!
                </p>
              </div>
            )}
          </div>

          {/* Related Plans */}
          {relatedPlans.length > 0 && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-24">
                <h3 className="title-medium">You may also like</h3>
                <a href="/plans" className="view-all" onClick={(e) => { e.preventDefault(); navigate('/plans'); }}>
                  View All
                </a>
              </div>
              <div className="row">
                {relatedPlans.filter(p => p.guid !== id).slice(0, 3).map((relatedPlan) => (
                  <div className="col-12 col-md-4 mb-4" key={relatedPlan.id}>
                    <div className="product-card" style={{ cursor: 'pointer' }} onClick={() => navigate(`/plan/${relatedPlan.guid}`)}>
                      <div className="image">
                        {relatedPlan.image_url ? (
                          <img 
                            src={getFullImageUrl(relatedPlan.image_url)} 
                            alt={relatedPlan.title}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentElement.innerHTML = '<div style="fontSize: 48px; textAlign: center; padding: 30px 0;">🏋️</div>';
                            }}
                          />
                        ) : (
                          <div style={{ fontSize: '48px', textAlign: 'center', padding: '30px 0' }}>
                            🏋️
                          </div>
                        )}
                      </div>
                      <h3 className="name">{relatedPlan.title}</h3>
                      <p className="desc">
                        {relatedPlan.short_description ? relatedPlan.short_description.substring(0, 60) + '...' : 'Fitness plan'}
                      </p>
                      <div className="bottom">
                        <div className="price">{formatPrice(relatedPlan.current_price || relatedPlan.price)}</div>
                        <button className="button">
                          View Details
                          <img src={CartImg} alt="" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanDetail;
