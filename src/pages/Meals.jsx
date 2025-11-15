import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { mealAPI } from "../services/api.service";
import { useToast } from "../context/ToastContext";
import CartImg from "../assets/images/cart1.svg";

// Helper function to get full image URL
const getFullImageUrl = (imagePath) => {
  if (!imagePath) return null;
  // Check if imagePath is a string
  if (typeof imagePath !== 'string') return null;
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  // Handle file system paths (e.g., /home/himaqjjt/startuppakistan.himalayatool.com/storage/uploads/...)
  if (imagePath.includes('/storage/uploads/')) {
    const baseUrl = 'https://startuppakistan.himalayatool.com';
    const storagePath = imagePath.substring(imagePath.indexOf('/storage/uploads/'));
    return `${baseUrl}${storagePath}`;
  }
  // Construct full URL from base domain for relative paths
  const baseUrl = 'https://startuppakistan.himalayatool.com';
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${baseUrl}${cleanPath}`;
};

const Meals = () => {
  const navigate = useNavigate();
  const { categoryName } = useParams();
  const { showError } = useToast();
  const [activeTab, setActiveTab] = useState('all');
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 12;

  useEffect(() => {
    fetchMeals();
  }, [currentPage, categoryName]);

  const fetchMeals = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        per_page: perPage
      };
      
      // Add category filter if present in URL
      if (categoryName) {
        params.category = categoryName;
      }
      
      const response = await mealAPI.getMeals(params);
      
      if (response.success) {
        setMeals(response.data || []);
        setTotalPages(response.pagination?.last_page || 1);
      }
    } catch (error) {
      console.error('Error fetching meals:', error);
      showError('Failed to load meals');
    } finally {
      setLoading(false);
    }
  };

  const handleMealClick = (mealGuid) => {
    navigate(`/meal/${mealGuid}`);
  };

  const getMealImage = (meal) => {
    // Try image_url first (already a full URL from API)
    if (meal.image_url) {
      console.log('Meal image_url:', meal.image_url);
      return getFullImageUrl(meal.image_url);
    }
    // Try image property as fallback
    if (meal.image) {
      console.log('Meal image:', meal.image);
      return getFullImageUrl(meal.image);
    }
    // Try gallery images
    if (meal.gallery_images && meal.gallery_images.length > 0) {
      const firstImg = meal.gallery_images[0];
      const imageUrl = typeof firstImg === 'object' ? firstImg.image_url : firstImg;
      console.log('Meal gallery image:', imageUrl);
      return getFullImageUrl(imageUrl);
    }
    // Fallback to emoji if no images
    console.log('No image found for meal:', meal.name);
    return null;
  };

  const formatPrice = (price) => {
    return `Rs.${parseFloat(price).toLocaleString()}`;
  };

  return (
    <div className="meals-page-container">
         <div className="meals-page top-100">
        <div className="content">
          <h3 className="title mb-8">
            From Diet to Workouts 
            <br />
           Everything You Need to Transform
          </h3>
        </div>
      </div>
      <div className="dark-bg padding-60">
        <div className="container">
          <h3 className="title-medium mb-32">Categories</h3>
          <div className="custom-tabs mb-40">
            <div
              className={`tab${!categoryName ? ' active' : ''}`}
              onClick={() => navigate('/meals')}
              style={{ cursor: 'pointer' }}
            >
              All Meals
            </div>
            <div
              className={`tab${categoryName === 'keto' ? ' active' : ''}`}
              onClick={() => navigate('/meals/category/keto')}
              style={{ cursor: 'pointer' }}
            >
              Keto Diet Membership
            </div>
            <div
              className={`tab${categoryName === 'fat-loss' ? ' active' : ''}`}
              onClick={() => navigate('/meals/category/fat-loss')}
              style={{ cursor: 'pointer' }}
            >
              Fat Loss Diet Membership
            </div>
            <div
              className={`tab${categoryName === 'muscle-gain' ? ' active' : ''}`}
              onClick={() => navigate('/meals/category/muscle-gain')}
              style={{ cursor: 'pointer' }}
            >
              Muscle Gain Diet Membership
            </div>
            <div
              className={`tab${categoryName === 'student' ? ' active' : ''}`}
              onClick={() => navigate('/meals/category/student')}
              style={{ cursor: 'pointer' }}
            >
              Student Diet Membership
            </div>
          </div>
       
          <h2 className="mb-32">
            {categoryName ? `${categoryName} Meals` : 'Healthy Meals'} ({meals.length} meals)
          </h2>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div className="loader"></div>
              <p style={{ marginTop: '20px' }}>Loading meals...</p>
            </div>
          ) : meals.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <h3>No meals found</h3>
              <p style={{ marginTop: '12px', opacity: 0.7 }}>Check back later for new meals</p>
            </div>
          ) : (
            <>
              <div className="row">
                {meals.map((meal) => (
                  <div className="col-12 col-md-6 col-lg-4 mb-4" key={meal.id}>
                    <div className="product-card" style={{ cursor: 'pointer' }}>
                      <div className="image lg" onClick={() => handleMealClick(meal.guid)}>
                        {getMealImage(meal) ? (
                          <img 
                            src={getMealImage(meal)} 
                            alt={meal.name}
                            onError={(e) => {
                              console.error('Image failed to load:', getMealImage(meal));
                              e.target.style.display = 'none';
                              e.target.parentElement.innerHTML = '<div style="fontSize: 60px; textAlign: center; padding: 40px 0;">🍽️</div>';
                            }}
                          />
                        ) : (
                          <div style={{ fontSize: '60px', textAlign: 'center', padding: '40px 0' }}>
                            🍽️
                          </div>
                        )}
                      </div>
                      <h3 className="name">{meal.name}</h3>
                      <p className="desc">
                        {meal.description ? meal.description.substring(0, 80) + '...' : 'Delicious and healthy meal option'}
                      </p>
                      <div className="bottom">
                        <div className="price-section">
                          {meal.has_discount && meal.sale_price ? (
                            <>
                              <span style={{ textDecoration: 'line-through', opacity: 0.6, marginRight: '8px' }}>
                                {formatPrice(meal.price)}
                              </span>
                              <div className="price">{formatPrice(meal.sale_price)}</div>
                            </>
                          ) : (
                            <div className="price">{formatPrice(meal.current_price || meal.price)}</div>
                          )}
                        </div>
                        <button className="button" onClick={() => handleMealClick(meal.guid)}>
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

export default Meals;
