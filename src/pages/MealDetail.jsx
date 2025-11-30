import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mealAPI } from "../services/api.service";
import { useToast } from "../context/ToastContext";
import Meal1 from "../assets/images/meal1.png";
import Meal2 from "../assets/images/meal2.png";
import Meal3 from "../assets/images/meal3.png";
import Meal4 from "../assets/images/meal4.png";
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

const mealImages = [Meal1, Meal2, Meal3, Meal4];

const MealDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showError } = useToast();
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedMeals, setRelatedMeals] = useState([]);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [closed, setClosed] = useState(false);
  const [activeReviewFilter, setActiveReviewFilter] = useState('All Reviews');

  useEffect(() => {
    if (id) {
      fetchMealDetails();
      fetchRelatedMeals();
    }
  }, [id]);

  const fetchRelatedMeals = async () => {
    try {
      const response = await mealAPI.getMeals({ page: 1, per_page: 4 });
      if (response.success) {
        setRelatedMeals((response.data || []).filter(m => m.guid !== id));
      }
    } catch (error) {
      console.error('Error fetching related meals:', error);
    }
  };

  const fetchMealDetails = async () => {
    setLoading(true);
    try {
      const response = await mealAPI.getMealById(id);
      if (response.success) {
        setMeal(response.data);
      }
    } catch (error) {
      console.error('Error fetching meal:', error);
      showError('Failed to load meal details');
    } finally {
      setLoading(false);
    }
  };

  const mealImagesArray = [];
  if (meal) {
    // Use image_url first
    if (meal.image_url) {
      mealImagesArray.push(getFullImageUrl(meal.image_url));
    }
    // Use gallery images - each object has image_url property
    if (meal.gallery_images && meal.gallery_images.length > 0) {
      meal.gallery_images.forEach(img => {
        // Handle both object with image_url and direct string
        const imgUrl = typeof img === 'object' ? img.image_url : img;
        if (imgUrl) {
          const fullUrl = getFullImageUrl(imgUrl);
          if (fullUrl && !mealImagesArray.includes(fullUrl)) {
            mealImagesArray.push(fullUrl);
          }
        }
      });
    }
  }

  // Use placeholder images if no meal images
  const displayImages = mealImagesArray.length > 0 ? mealImagesArray : [Meal1, Meal2, Meal3, Meal4];

  const formatPrice = (price) => {
    return `Rs.${parseFloat(price).toLocaleString()}`;
  };

  // Parse nutrition facts
  const getNutritionFacts = () => {
    if (!meal || !meal.nutrition_facts) return null;
    try {
      return typeof meal.nutrition_facts === 'string' 
        ? JSON.parse(meal.nutrition_facts) 
        : meal.nutrition_facts;
    } catch (e) {
      return null;
    }
  };

  // Parse ingredients
  const getIngredients = () => {
    if (!meal || !meal.ingredients) return [];
    try {
      return typeof meal.ingredients === 'string' 
        ? JSON.parse(meal.ingredients) 
        : meal.ingredients;
    } catch (e) {
      return [];
    }
  };

  const nutritionFacts = getNutritionFacts();
  const ingredients = getIngredients();

  const reviewFilters = ['All Reviews', 'With Photo & Video', 'With Description'];

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'ingredients', label: 'Ingredients' },
    { id: 'nutrition', label: 'Nutritional Information' },
    { id: 'allergens', label: 'Allergens' },
    { id: 'reviews', label: 'Reviews' },
  ];

  if (loading) {
    return (
      <div className="product-detail-page top-100 dark-bg" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="loader"></div>
          <p style={{ marginTop: '20px' }}>Loading meal...</p>
        </div>
      </div>
    );
  }

  if (!meal) {
    return (
      <div className="product-detail-page top-100 dark-bg" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h2>Meal not found</h2>
          <button className="button" onClick={() => navigate('/meals')} style={{ marginTop: '20px' }}>
            Browse Meals
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-page top-100">
      {/* Info Bar */}
      <div className="empty-page dark-bg">
        {!closed && (
          <div className="info-bar bg-gray ">
            <div className="icon" onClick={() => setClosed(true)} style={{ cursor: 'pointer' }}>
              <img src={Close} alt="" />
            </div>
            Limited time offer: 40% off on first order of $65+ 
          </div>
        )}
      </div>

      {/* Meal Details Section */}
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
                    <img src={img} alt={`${meal.name} ${idx + 1}`} />
                  </div>
                ))}
              </div>
            </div>

            {/* Center - Main Image */}
            <div className="col-12 col-md-5">
              <div className="main-image">
                <img src={displayImages[selectedImage]} alt={meal.name} />
              </div>
            </div>

            {/* Right - Meal Info */}
            <div className="col-12 col-md-5">
              <div className="product-info">
                <div className="reviews-container mb-16">
                  <div className="reviews">
                    {[...Array(5)].map((_, i) => (
                      <img src={star} alt="" key={i} />
                    ))}
                  </div>
                  <span className="text">35,000+ 5 stars for our meals on Trustpilot</span>
                </div>

                <h1 className="product-title mb-16">{meal.name}</h1>

                <div className="price-section mb-16">
                  {meal.has_discount && meal.sale_price ? (
                    <>
                      <span className="original-price">{formatPrice(meal.price)}</span>
                      <span className="current-price">{formatPrice(meal.sale_price)}</span>
                    </>
                  ) : (
                    <span className="current-price">{formatPrice(meal.current_price || meal.price)}</span>
                  )}
                </div>

                {(meal.calories || nutritionFacts) && (
                  <div className="calories-section mb-24">
                    <h4 className="mb-8 title-small">Nutritional Info</h4>
                    <p style={{ opacity: 0.8 }}>
                      {meal.calories && <>Calories: <strong>{meal.calories} kcal</strong></>}
                      {nutritionFacts?.protein && ` | Protein: ${nutritionFacts.protein}g`}
                      {nutritionFacts?.carbs && ` | Carbs: ${nutritionFacts.carbs}g`}
                      {nutritionFacts?.fat && ` | Fat: ${nutritionFacts.fat}g`}
                    </p>
                    {meal.serving_size && (
                      <p style={{ opacity: 0.8, marginTop: '8px' }}>
                        Serving Size: <strong>{meal.serving_size}</strong>
                      </p>
                    )}
                    {meal.preparation_time_formatted && (
                      <p style={{ opacity: 0.8, marginTop: '8px' }}>
                        Preparation Time: <strong>{meal.preparation_time_formatted}</strong>
                      </p>
                    )}
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
                <h3 className="mb-24">Meal Description</h3>
                <p className="mb-16">
                  {meal.description || 'No description available for this meal.'}
                </p>
              </div>
            )}
            
            {activeTab === 'ingredients' && (
              <div className="ingredients-content">
                <h3 className="mb-24">Ingredients</h3>
                {ingredients.length > 0 ? (
                  <ul style={{ paddingLeft: '20px' }}>
                    {ingredients.map((ingredient, idx) => (
                      <li key={idx} style={{ marginBottom: '8px', fontSize: '16px' }}>
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No ingredients information available.</p>
                )}
              </div>
            )}
            
            {activeTab === 'nutrition' && (
              <div className="nutrition-content">
                <h3 className="mb-24">Nutritional Information</h3>
                {nutritionFacts ? (
                  <div style={{ fontSize: '16px' }}>
                    <table style={{ width: '100%', maxWidth: '500px', borderCollapse: 'collapse' }}>
                      <tbody>
                        {meal.calories && (
                          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <td style={{ padding: '12px 0', fontWeight: 'bold' }}>Calories</td>
                            <td style={{ padding: '12px 0', textAlign: 'right' }}>{meal.calories} kcal</td>
                          </tr>
                        )}
                        {nutritionFacts.protein && (
                          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <td style={{ padding: '12px 0', fontWeight: 'bold' }}>Protein</td>
                            <td style={{ padding: '12px 0', textAlign: 'right' }}>{nutritionFacts.protein}g</td>
                          </tr>
                        )}
                        {nutritionFacts.carbs && (
                          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <td style={{ padding: '12px 0', fontWeight: 'bold' }}>Carbohydrates</td>
                            <td style={{ padding: '12px 0', textAlign: 'right' }}>{nutritionFacts.carbs}g</td>
                          </tr>
                        )}
                        {nutritionFacts.fat && (
                          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <td style={{ padding: '12px 0', fontWeight: 'bold' }}>Fat</td>
                            <td style={{ padding: '12px 0', textAlign: 'right' }}>{nutritionFacts.fat}g</td>
                          </tr>
                        )}
                        {meal.serving_size && (
                          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <td style={{ padding: '12px 0', fontWeight: 'bold' }}>Serving Size</td>
                            <td style={{ padding: '12px 0', textAlign: 'right' }}>{meal.serving_size}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p>No nutritional information available.</p>
                )}
              </div>
            )}

            {activeTab === 'allergens' && (
              <div className="allergens-content">
                <h3 className="mb-24">Allergens & Dietary Info</h3>
                {meal.type_label && (
                  <div style={{ marginBottom: '16px' }}>
                    <p><strong>Type:</strong> {meal.type_label}</p>
                  </div>
                )}
                {meal.badges && meal.badges.length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <p><strong>Dietary Labels:</strong></p>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                      {meal.badges.map((badge, idx) => (
                        <span 
                          key={idx} 
                          style={{ 
                            padding: '6px 12px', 
                            borderRadius: '4px', 
                            background: 'rgba(255,255,255,0.1)',
                            fontSize: '14px'
                          }}
                        >
                          {badge.label}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <p style={{ opacity: 0.7, fontSize: '14px', marginTop: '16px' }}>
                  Please consult with a healthcare professional if you have specific dietary restrictions or allergies.
                </p>
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
                              <h6 className="review-title">This meal is amazing!</h6>
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

      {/* Related Meals Section */}
      {relatedMeals.length > 0 && (
        <div className="related-products-section padding-40 dark-bg">
          <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-24">
              <h3 className="title-medium">You may also like</h3>
              <a href="/meals" className="view-all" onClick={(e) => { e.preventDefault(); navigate('/meals'); }}>
                View All
              </a>
            </div>
            <div className="row">
              {relatedMeals.slice(0, 4).map((relatedMeal) => {
                const mealImage = relatedMeal.image_url 
                  ? getFullImageUrl(relatedMeal.image_url)
                  : (relatedMeal.gallery_images && relatedMeal.gallery_images.length > 0
                    ? getFullImageUrl(typeof relatedMeal.gallery_images[0] === 'object' ? relatedMeal.gallery_images[0].image_url : relatedMeal.gallery_images[0])
                    : null);
                
                return (
                  <div className="col-12 col-md-6 col-lg-3" key={relatedMeal.id}>
                    <div className="product-card" style={{ cursor: 'pointer' }} onClick={() => navigate(`/meal/${relatedMeal.guid}`)}>
                      <div className="image">
                        {mealImage ? (
                          <img 
                            src={mealImage} 
                            alt={relatedMeal.name}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentElement.innerHTML = '<div style="fontSize: 48px; textAlign: center; padding: 30px 0;">🍽️</div>';
                            }}
                          />
                        ) : (
                          <div style={{ fontSize: '48px', textAlign: 'center', padding: '30px 0' }}>
                            🍽️
                          </div>
                        )}
                      </div>
                      <h3 className="name">{relatedMeal.name}</h3>
                      <p className="desc">
                        {relatedMeal.description ? relatedMeal.description.substring(0, 60) + '...' : 'Delicious healthy meal'}
                      </p>
                      <div className="bottom">
                        <div className="price">{formatPrice(relatedMeal.current_price || relatedMeal.price)}</div>
                        <button className="button" onClick={(e) => { e.stopPropagation(); navigate(`/meal/${relatedMeal.guid}`); }}>
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

export default MealDetail;
