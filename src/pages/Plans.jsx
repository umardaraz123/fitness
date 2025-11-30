import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { planAPI } from "../services/api.service";
import { useToast } from "../context/ToastContext";
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

const Plans = () => {
  const navigate = useNavigate();
  const { showError } = useToast();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 12;

  // Filter states
  const [selectedPlanType, setSelectedPlanType] = useState('all'); // all, ONE_TIME or MEMBERSHIP
  const [selectedCategory, setSelectedCategory] = useState('all'); // all, DIET or WORKOUT
  const [selectedGoal, setSelectedGoal] = useState('all'); // all, WEIGHT_GAIN, WEIGHT_LOSS, MAINTENANCE

  useEffect(() => {
    fetchPlans();
  }, [currentPage, selectedPlanType, selectedCategory, selectedGoal]);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        per_page: perPage
      };

      // Add filters to API params (only if not 'all')
      if (selectedPlanType && selectedPlanType !== 'all') {
        params.plan_type = selectedPlanType;
      }
      if (selectedCategory && selectedCategory !== 'all') {
        params.plan_category = selectedCategory;
      }
      if (selectedGoal && selectedGoal !== 'all') {
        params.fitness_goal = selectedGoal;
      }

      const response = await planAPI.getPlans(params);
      
      if (response.success) {
        // Handle nested data structure from API
        const plansData = response.data?.data || response.data || [];
        setPlans(Array.isArray(plansData) ? plansData : []);
        setTotalPages(response.data?.pagination?.last_page || response.pagination?.last_page || 1);
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
      showError('Failed to load plans');
    } finally {
      setLoading(false);
    }
  };

  const handlePlanClick = (planGuid) => {
    navigate(`/plan/${planGuid}`);
  };

  const getPlanImage = (plan) => {
    // Use image_url first
    if (plan.image_url) {
      return getFullImageUrl(plan.image_url);
    }
    // Use gallery images - each object has image_url property
    if (plan.gallery_images && plan.gallery_images.length > 0) {
      const firstImg = plan.gallery_images[0];
      const imageUrl = typeof firstImg === 'object' ? firstImg.image_url : firstImg;
      return getFullImageUrl(imageUrl);
    }
    return null;
  };

  const formatPrice = (price) => {
    return `Rs.${parseFloat(price).toLocaleString()}`;
  };

  return (
    <div className="fitness-programs-page">
      <div className="fitness-page top-100">
        <div className="content">
          <h3 className="title mb-8">
            Transform Your Body
            <br />
            Achieve Your Fitness Goals
          </h3>
        </div>
      </div>
      <div className="dark-bg padding-60">
        <div className="container">
          {/* Categories Section */}
          <h3 className="title-medium mb-32">Categories</h3>
          
          {/* Plan Type Filter - All, One-Time vs Membership */}
          <div className="filter-section mb-32">
            <div className="custom-tabs mb-24">
              <div
                className={`tab${selectedPlanType === 'all' ? ' active' : ''}`}
                onClick={() => {
                  setSelectedPlanType('all');
                  setCurrentPage(1);
                }}
                style={{ cursor: 'pointer' }}
              >
                All Plans
              </div>
              <div
                className={`tab${selectedPlanType === 'ONE_TIME' ? ' active' : ''}`}
                onClick={() => {
                  setSelectedPlanType('ONE_TIME');
                  setCurrentPage(1);
                }}
                style={{ cursor: 'pointer' }}
              >
                One-Time Plans
              </div>
              <div
                className={`tab${selectedPlanType === 'MEMBERSHIP' ? ' active' : ''}`}
                onClick={() => {
                  setSelectedPlanType('MEMBERSHIP');
                  setCurrentPage(1);
                }}
                style={{ cursor: 'pointer' }}
              >
                Membership Plans
              </div>
            </div>

            {/* Plan Category Filter - All, Diet vs Workout */}
            <div className="buttons" style={{ display: 'flex', gap: '12px' }}>
              <button
                className={selectedCategory === 'all' ? 'button-border active' : 'button-border'}
                onClick={() => {
                  setSelectedCategory('all');
                  setCurrentPage(1);
                }}
                style={{ 
                  padding: '12px 32px',
                  borderRadius: '25px',
                  fontSize: '16px',
                  fontWeight: '500'
                }}
              >
                All Plans
              </button>
              <button
                className={selectedCategory === 'DIET' ? 'button-border active' : 'button-border'}
                onClick={() => {
                  setSelectedCategory('DIET');
                  setCurrentPage(1);
                }}
                style={{ 
                  padding: '12px 32px',
                  borderRadius: '25px',
                  fontSize: '16px',
                  fontWeight: '500'
                }}
              >
                Diet Plans
              </button>
              <button
                className={selectedCategory === 'WORKOUT' ? 'button-border active' : 'button-border'}
                onClick={() => {
                  setSelectedCategory('WORKOUT');
                  setCurrentPage(1);
                }}
                style={{ 
                  padding: '12px 32px',
                  borderRadius: '25px',
                  fontSize: '16px',
                  fontWeight: '500'
                }}
              >
                Workout Plans
              </button>
            </div>

            {/* Fitness Goal Filter */}
            <div className="goal-filter" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="goal"
                  value="all"
                  checked={selectedGoal === 'all'}
                  onChange={(e) => {
                    setSelectedGoal(e.target.value);
                    setCurrentPage(1);
                  }}
                  style={{ marginRight: '8px', cursor: 'pointer' }}
                />
                <span>All Goals</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="goal"
                  value="WEIGHT_GAIN"
                  checked={selectedGoal === 'WEIGHT_GAIN'}
                  onChange={(e) => {
                    setSelectedGoal(e.target.value);
                    setCurrentPage(1);
                  }}
                  style={{ marginRight: '8px', cursor: 'pointer' }}
                />
                <span>Weight Gain</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="goal"
                  value="WEIGHT_LOSS"
                  checked={selectedGoal === 'WEIGHT_LOSS'}
                  onChange={(e) => {
                    setSelectedGoal(e.target.value);
                    setCurrentPage(1);
                  }}
                  style={{ marginRight: '8px', cursor: 'pointer' }}
                />
                <span>Weight Loss</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="goal"
                  value="MAINTENANCE"
                  checked={selectedGoal === 'MAINTENANCE'}
                  onChange={(e) => {
                    setSelectedGoal(e.target.value);
                    setCurrentPage(1);
                  }}
                  style={{ marginRight: '8px', cursor: 'pointer' }}
                />
                <span>Maintenance</span>
              </label>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-32">
            <h3 className="title-medium">
              {selectedCategory === 'all' ? 'All' : selectedCategory === 'DIET' ? 'Diet' : 'Workout'} Plans ({plans.length} plans)
            </h3>
          </div>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div className="loader"></div>
              <p style={{ marginTop: '20px' }}>Loading plans...</p>
            </div>
          ) : plans.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <h3>No plans found</h3>
              <p style={{ marginTop: '12px', opacity: 0.7 }}>Check back later for new plans</p>
            </div>
          ) : (
            <>
              <div className="row">
                {plans.map((plan) => (
                  <div className="col-12 col-md-6 col-lg-4 mb-4" key={plan.id}>
                    <div className="product-card" style={{ cursor: 'pointer' }}>
                      <div className="image lg" onClick={() => handlePlanClick(plan.guid)} style={{ position: 'relative' }}>
                        {getPlanImage(plan) ? (
                          <img 
                            src={getPlanImage(plan)} 
                            alt={plan.title}
                            onError={(e) => {
                              console.error('Image failed to load:', getPlanImage(plan));
                              e.target.style.display = 'none';
                              e.target.parentElement.innerHTML = '<div style="fontSize: 60px; textAlign: center; padding: 40px 0;">🏋️</div>';
                            }}
                          />
                        ) : (
                          <div style={{ fontSize: '60px', textAlign: 'center', padding: '40px 0' }}>
                            🏋️
                          </div>
                        )}
                        {/* Plan Type Badge */}
                        {plan.plan_type_label && (
                          <div style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            background: plan.plan_type === 'MEMBERSHIP' ? '#ff6b35' : '#4caf50',
                            color: 'white',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                          }}>
                            {plan.plan_type_label}
                          </div>
                        )}
                      </div>
                      <h3 className="name">{plan.title}</h3>
                      <p className="desc">
                        {plan.short_description ? plan.short_description.substring(0, 80) + '...' : 'Transform your fitness journey with this program'}
                      </p>
                      <div className="bottom">
                        <div className="price-section">
                          {plan.has_discount && plan.sale_price ? (
                            <>
                              <span style={{ textDecoration: 'line-through', opacity: 0.6, marginRight: '8px' }}>
                                {formatPrice(plan.price)}
                              </span>
                              <div className="price">{formatPrice(plan.sale_price)}</div>
                            </>
                          ) : (
                            <div className="price">{formatPrice(plan.current_price || plan.price)}</div>
                          )}
                        </div>
                        <button className="button" onClick={() => handlePlanClick(plan.guid)}>
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

export default Plans;
