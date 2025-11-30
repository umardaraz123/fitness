import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { mealAPI } from "../services/api.service";
import { useToast } from "../context/ToastContext";
import CartImg from "../assets/images/cart1.svg";

// Helper function to get full image URL
const getFullImageUrl = (imagePath) => {

  const baseUrl = import.meta.env.VITE_APP_BASE_URL

  if (!imagePath) return null;
  // Check if imagePath is a string
  if (typeof imagePath !== 'string') return null;
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  // Handle file system paths (e.g., /home/himaqjjt/startuppakistan.himalayatool.com/storage/uploads/...)
  if (imagePath.includes('/storage/uploads/')) {
    const storagePath = imagePath.substring(imagePath.indexOf('/storage/uploads/'));
    return `${baseUrl}${storagePath}`;
  }
  // Construct full URL from base domain for relative paths
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${baseUrl}${cleanPath}`;
};

const Meals = () => {
  const navigate = useNavigate();
  const { showError } = useToast();
  const [selectedType, setSelectedType] = useState('all');
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 12;

  useEffect(() => {
    fetchMeals();
  }, [currentPage, selectedType]);

  const fetchMeals = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        per_page: perPage
      };
      
      // Add type filter if selected
      if (selectedType && selectedType !== 'all') {
        params.type = selectedType;
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

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
    setCurrentPage(1);
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
          <div className="d-flex justify-content-between align-items-center mb-32">
            <h3 className="title-medium">Filter by Type</h3>
            <div className="filters" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <label style={{ marginRight: '8px', fontSize: '14px' }}>Meal Type:</label>
              <select 
                value={selectedType}
                onChange={handleTypeChange}
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: '#2c2c2c',
                  color: '#fff',
                  fontSize: '14px',
                  cursor: 'pointer',
                  minWidth: '180px'
                }}
              >
                <option value="all">All Meals</option>
                <option value="VEG">Vegetarian</option>
                <option value="NON_VEG">Non-Vegetarian</option>
                <option value="VEGAN">Vegan</option>
              </select>
            </div>
          </div>
       
          <h2 className="mb-32">
            {selectedType !== 'all' 
              ? `${selectedType === 'VEG' ? 'Vegetarian' : selectedType === 'NON_VEG' ? 'Non-Vegetarian' : 'Vegan'} Meals` 
              : 'All Meals'} ({meals.length} meals)
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
