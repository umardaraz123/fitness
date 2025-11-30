import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProducts, useMeals, usePlans } from "../hooks/reduxHooks";
import ShopIcon from "../assets/images/shop.svg";

// Helper function to get full image URL
const getFullImageUrl = (imagePath) => {
  const baseUrl = import.meta.env.VITE_APP_BASE_URL;

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

import Cat1 from "../assets/images/cat1.png";
import Cat2 from "../assets/images/cat2.png";
import Cat3 from "../assets/images/cat3.png";
import Prod1 from "../assets/images/p1.png";
import Prod2 from "../assets/images/p2.png";
import Prod3 from "../assets/images/p3.png";
import Prod4 from "../assets/images/p4.png";
import Featured1 from "../assets/images/f1.jpg";
import Featured2 from "../assets/images/f2.jpg";
import Featured3 from "../assets/images/f3.jpg";
import Featured4 from "../assets/images/f4.jpg";
import Featured5 from "../assets/images/f5.jpg";
import star from "../assets/images/star.png";
import Meal1 from "../assets/images/meal1.png";
import Meal2 from "../assets/images/meal2.png";
import Meal3 from "../assets/images/meal3.png";
import Meal4 from "../assets/images/meal4.png";
import Meal5 from "../assets/images/meal5.png";
import Meal6 from "../assets/images/meal6.png";
import logo1 from "../assets/images/logo1.png";
import logo2 from "../assets/images/logo2.png";
import logo3 from "../assets/images/logo3.png";
import logo4 from "../assets/images/logo4.png";
import logo5 from "../assets/images/logo5.png";
import user1 from "../assets/images/user1.jpg";
import user2 from "../assets/images/user2.jpg";
import user3 from "../assets/images/user3.jpg";
import WhyImage from "../assets/images/why.png";

import CartImg from "../assets/images/cart1.svg";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Landing = () => {
  const navigate = useNavigate();
  
  // Redux hooks
  const { 
    products, 
    isLoading: loadingProducts, 
    getProducts,
    clearError: clearProductsError 
  } = useProducts();
  
  const { 
    meals, 
    isLoading: loadingMeals, 
    getMeals,
    clearError: clearMealsError 
  } = useMeals();
  
  const { 
    plans: fitnessPlans, 
    isLoading: loadingFitnessPlans, 
    getPlans,
    clearError: clearPlansError 
  } = usePlans();

  const [featuredPlans, setFeaturedPlans] = useState([]);
  const [loadingFeaturedPlans, setLoadingFeaturedPlans] = useState(false);

  useEffect(() => {
    fetchBestSellingProducts();
    fetchMeals();
    fetchFitnessPlans();
    fetchFeaturedPlans();

    // Clear errors on component unmount
    return () => {
      clearProductsError();
      clearMealsError();
      clearPlansError();
    };
  }, []);

  const fetchBestSellingProducts = async () => {
    try {
      await getProducts({
        page: 1,
        per_page: 8
      });
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchMeals = async () => {
    try {
      await getMeals({
        page: 1,
        per_page: 6
      });
    } catch (error) {
      console.error('Error fetching meals:', error);
    }
  };

  const fetchFitnessPlans = async () => {
    try {
      await getPlans({
        page: 1,
        per_page: 5
      });
    } catch (error) {
      console.error('Error fetching fitness plans:', error);
    }
  };

  const fetchFeaturedPlans = async () => {
    setLoadingFeaturedPlans(true);
    try {
      const response = await getPlans({
        page: 1,
        per_page: 10
      });
      
      if (response.payload?.data?.data || response.payload?.data) {
        const plansData = response.payload.data.data || response.payload.data || [];
        setFeaturedPlans(Array.isArray(plansData) ? plansData : []);
      }
    } catch (error) {
      console.error('Error fetching featured plans:', error);
    } finally {
      setLoadingFeaturedPlans(false);
    }
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
    // Fallback to default image if no images
    return null;
  };

  const formatPrice = (price) => {
    return `Rs.${parseFloat(price).toLocaleString()}`;
  };

  const handleProductClick = (productGuid) => {
    navigate(`/product/${productGuid}`);
  };

  const handleMealClick = (mealGuid) => {
    navigate(`/meal/${mealGuid}`);
  };

  const getMealImage = (meal) => {
    // Use image_url first
    if (meal.image_url) {
      return getFullImageUrl(meal.image_url);
    }
    // Use gallery images - each object has image_url property
    if (meal.gallery_images && meal.gallery_images.length > 0) {
      const firstImg = meal.gallery_images[0];
      const imageUrl = typeof firstImg === 'object' ? firstImg.image_url : firstImg;
      return getFullImageUrl(imageUrl);
    }
    // Fallback to default image if no images
    return null;
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
    // Fallback to default image if no images
    return null;
  };

  const handlePlanClick = (planGuid) => {
    navigate(`/plan/${planGuid}`);
  };

  // Extract actual data from Redux state
  const productsData = products?.data?.data || products?.data || products || [];
  const mealsData = meals?.data?.data || meals?.data || meals || [];
  const fitnessPlansData = fitnessPlans?.data?.data || fitnessPlans?.data || fitnessPlans || [];

  return (
    <div className="landing-container">
      <div className="hero-section top-100">
        <div className="container">
          <h3 className="title">WHET PROTINE</h3>
          <div className="stats">
            <div className="stat">
              100%
              <br />
              TESTED
            </div>
            <div className="stat">
              24gr
              <br />
              PROTEIN
            </div>
          </div>
          <button className="button">
            Shop Now <img src={ShopIcon} alt="" />
          </button>
        </div>
      </div>
      <div className="anoucement">
        100% Authenticity Guaranteed | For Orders Call +92 3001234567
      </div>
      <div className="categories">
        <h3 className="title text-center mb-32">Explore By Categories</h3>
        <div className="items">
          <div className="item">
            <div className="image">
              <img src={Cat1} alt="Category 1" />
            </div>
            <h4 className="text">Supplements</h4>
          </div>
          <div className="item">
            <div className="image">
              <img src={Cat2} alt="Category 2" />
            </div>
            <h4 className="text">Workout Plans</h4>
          </div>
          <div className="item">
            <div className="image">
              <img src={Cat3} alt="Category 3" />
            </div>
            <h4 className="text">Meals Plans</h4>
          </div>
        </div>
      </div>
      
      {/* All Products  */}
      <div className="products-wrapper bg-gray">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-24">
            <h3 className="title-medium">Best Selling Supplements </h3>
            <a href="/products" className="view-all" onClick={(e) => { e.preventDefault(); navigate('/products'); }}>
              View All
            </a>
          </div>
          
          {loadingProducts ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div className="loader"></div>
              <p style={{ marginTop: '20px' }}>Loading products...</p>
            </div>
          ) : (
            <div className="row">
              {Array.isArray(productsData) && productsData.map((product) => (
                <div className="col-12 col-md-6 col-lg-3" key={product.id}>
                  <div className="product-card" style={{ cursor: 'pointer' }} onClick={() => handleProductClick(product.guid)}>
                    <div className="image">
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
                        <div style={{ fontSize: '60px', textAlign: 'center', padding: '40px 0' }}>📦</div>
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
                      {product.description ? product.description.substring(0, 80) + '...' : 'Fuel your workouts and speed up recovery with high-quality supplements...'}
                    </p>
                    <div className="bottom">
                      <div className="price-section">
                        {product.discount_price && parseFloat(product.discount_price) > 0 ? (
                          <>
                            <span style={{ textDecoration: 'line-through', opacity: 0.6, marginRight: '8px', fontSize: '14px' }}>
                              {formatPrice(product.price)}
                            </span>
                            <div className="price">{formatPrice(product.discount_price)}</div>
                          </>
                        ) : (
                          <div className="price">{formatPrice(product.price)}</div>
                        )}
                      </div>
                      <button className="button">
                        Add to Cart
                        <img src={CartImg} alt="" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Dark container  */}
      <div className="dark-bg padding-40">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-24">
            <h3 className="title-medium">Fitness Programs</h3>
            <a href="/plans" className="view-all" onClick={(e) => { e.preventDefault(); navigate('/plans'); }}>
              View All
            </a>
          </div>
          
          {loadingFitnessPlans ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div className="loader"></div>
              <p style={{ marginTop: '20px' }}>Loading plans...</p>
            </div>
          ) : fitnessPlansData.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <h3>No plans available</h3>
            </div>
          ) : (
            <div className="row mb-48">
              {/* Large card on the left - takes full height */}
              {fitnessPlansData[0] && (
                <div className="col-12 col-lg-6 mb-4">
                  <div 
                    className="large-card card-wrapper"
                    style={{ 
                      cursor: 'pointer',
                      backgroundImage: getPlanImage(fitnessPlansData[0]) ? `url(${getPlanImage(fitnessPlansData[0])})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      minHeight: '500px'
                    }}
                    onClick={() => handlePlanClick(fitnessPlansData[0].guid)}
                  >
                    <div className="content">
                      <div className="title">{fitnessPlansData[0].title}</div>
                      <div className="bottom">
                        <div className="left">
                          {fitnessPlansData[0].plan_type_label && (
                            <div className="tag">{fitnessPlansData[0].plan_type_label}</div>
                          )}
                          {fitnessPlansData[0].goal_label && (
                            <div className="tag">{fitnessPlansData[0].goal_label}</div>
                          )}
                        </div>
                        <button className="button" onClick={(e) => { e.stopPropagation(); }}>
                          Add to Cart <img src={CartImg} alt="" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* 4 small cards on the right - 2x2 grid */}
              <div className="col-12 col-lg-6">
                <div className="row">
                  {fitnessPlansData.slice(1, 5).map((plan) => (
                    <div className="col-6 mb-4" key={plan.id}>
                      <div 
                        className="small-card card-wrapper"
                        style={{ 
                          cursor: 'pointer',
                          backgroundImage: getPlanImage(plan) ? `url(${getPlanImage(plan)})` : 'none',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          minHeight: '240px'
                        }}
                        onClick={() => handlePlanClick(plan.guid)}
                      >
                        <div className="content">
                          <div className="title">{plan.title}</div>
                          <div className="bottom">
                            <div className="left">
                              {plan.plan_type_label && (
                                <div className="tag">{plan.plan_type_label}</div>
                              )}
                            </div>
                            <button className="button" onClick={(e) => { e.stopPropagation(); }}>
                              Add to Cart <img src={CartImg} alt="" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <div className="d-flex justify-content-between align-items-center mb-24">
            <h3 className="title-medium">Meals</h3>
            <a href="/meals" className="view-all" onClick={(e) => { e.preventDefault(); navigate('/meals'); }}>
              View All
            </a>
          </div>
          
          {loadingMeals ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div className="loader"></div>
              <p style={{ marginTop: '20px' }}>Loading meals...</p>
            </div>
          ) : (
            <div className="row">
              {Array.isArray(mealsData) && mealsData.map((meal) => (
                <div className="col-12 col-md-6 col-lg-4" key={meal.id}>
                  <div className="product-card" style={{ cursor: 'pointer' }} onClick={() => handleMealClick(meal.guid)}>
                    <div className="image lg">
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
                        <div style={{ fontSize: '60px', textAlign: 'center', padding: '40px 0' }}>🍽️</div>
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
                            <span style={{ textDecoration: 'line-through', opacity: 0.6, marginRight: '8px', fontSize: '14px' }}>
                              {formatPrice(meal.price)}
                            </span>
                            <div className="price">{formatPrice(meal.sale_price)}</div>
                          </>
                        ) : (
                          <div className="price">{formatPrice(meal.current_price || meal.price)}</div>
                        )}
                      </div>
                      <button className="button">
                        Add to Cart
                        <img src={CartImg} alt="" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Featured Programs */}
      <div className="bg-gray padding-40">
        <div className="container">
          <h3 className="title-medium mb-24">Featured Programs</h3>
          {loadingFeaturedPlans ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div className="loader"></div>
              <p style={{ marginTop: '20px' }}>Loading featured programs...</p>
            </div>
          ) : featuredPlans.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <h3>No featured programs available</h3>
            </div>
          ) : (
            <Slider
              dots={false}
              infinite={featuredPlans.length > 4}
              speed={500}
              slidesToShow={Math.min(4, featuredPlans.length)}
              slidesToScroll={1}
              arrows={true}
              cssEase="ease"
              responsive={[
                {
                  breakpoint: 1200,
                  settings: { slidesToShow: Math.min(3, featuredPlans.length), arrows: true },
                },
                {
                  breakpoint: 992,
                  settings: { slidesToShow: Math.min(2, featuredPlans.length), arrows: true },
                },
                {
                  breakpoint: 576,
                  settings: { slidesToShow: 1, arrows: true },
                },
              ]}
              className="featured-slider"
            >
              {featuredPlans.map((plan) => (
                <div key={plan.id}>
                  <div 
                    className="featured-card" 
                    style={{ cursor: 'pointer' }}
                    onClick={() => handlePlanClick(plan.guid)}
                  >
                    <div className="image">
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
                        <div style={{ fontSize: '60px', textAlign: 'center', padding: '40px 0' }}>🏋️</div>
                      )}
                    </div>
                    <div className="data">
                      <h3 className="title">{plan.title}</h3>
                      <p className="desc">
                        {plan.short_description ? plan.short_description.substring(0, 80) + '...' : 'Transform your fitness journey with this program'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          )}
        </div>
      </div>

      {/* Rest of the component remains the same */}
      {/* Trusted by 1000+ Customers WorldWide */}
      <div className="padding-40 dark-bg">
        <div className="container">
          <h3 className="title-medium text-center mb-32">
            <span>Trusted By</span> Leading Companies
          </h3>
          <div className="companies-logo">
            <img src={logo1} alt="" />
            <img src={logo2} alt="" />
            <img src={logo3} alt="" />
            <img src={logo4} alt="" />
            <img src={logo5} alt="" />
          </div>
        </div>
      </div>
      
      {/* Why Choose Us */}
      <div className="padding-40 bg-gray why-choose-us">
        <div className="container">
          <h3 className="title-medium text-center mb-32">Why Choose Us</h3>
          <div className="row align-items-center">
            <div className="col-12 col-md-6">
              <h3 className="title">
                From Day One to Your Personal Best Here's Why Our Gym Delivers Results That Last
              </h3>
              <div className="list-item">
                <div className="label">
                  The Gym That Gets You Results
                </div>
                <p className="text">
                  Lorem ipsum dolor sit amet consectetur. Habitasse lacus a sit ultrices sem nulla donec pulvinar.
                </p>
              </div>
              <div className="list-item">
                <div className="label">
                  Your Fitness Journey Starts Here
                </div>
                <p className="text">
                  Lorem ipsum dolor sit amet consectetur. Habitasse lacus a sit ultrices sem nulla donec pulvinar.
                </p>
              </div>
              <div className="list-item">
                <div className="label">
                 Train Smarter. Get Stronger.
                </div>
                <p className="text">
                  Lorem ipsum dolor sit amet consectetur. Habitasse lacus a sit ultrices sem nulla donec pulvinar.
                </p>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="image">
                <img src={WhyImage} alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Testimonials */}
      <div className="padding-40 dark-bg">
        <div className="container">
          <h3 className="title-medium mb-24">What everyone says</h3>
          <div className="testimonial-slider">
            <Slider
              dots={true}
              infinite={true}
              speed={500}
              slidesToShow={4}
              slidesToScroll={1}
              arrows={true}
              cssEase="ease"
              responsive={[{ breakpoint: 768, settings: { slidesToShow: 1 } }]}
              className="testimonial-slider"
            >
              {[
                {
                  text: "Lacus vestibulum ultricies mi risus, duis non, volutpat nullam non. Magna congue nisi maecenas elit aliquet eu sed consectetur. Vitae quis cras vitae praesent morb.",
                  user: user1,
                  name: "Hellen Jummy",
                  role: "Fitness Trainer",
                },
                {
                  text: "Amazing results! The trainers are very supportive and the plans are easy to follow. I achieved my goals faster than expected and felt motivated every step of the way.",
                  user: user2,
                  name: "Jason Smith",
                  role: "Gym Member",
                },
                {
                  text: "Best gym experience ever. Highly recommend to anyone serious about fitness. The staff is knowledgeable and the environment is always positive and encouraging.",
                  user: user3,
                  name: "Priya Patel",
                  role: "Athlete",
                },
                {
                  text: "Great atmosphere and excellent equipment. I love coming here every day! The trainers provide personalized attention and the community is very welcoming.",
                  user: user1,
                  name: "Hellen Jummy",
                  role: "Fitness Trainer",
                },
                {
                  text: "The meal plans are delicious and keep me energized throughout the day. I noticed a big improvement in my performance and overall health since joining.",
                  user: user2,
                  name: "Jason Smith",
                  role: "Gym Member",
                },
              ].map((testimonial, idx) => (
                <div className="testimonial-card" key={idx}>
                  <p className="text">{testimonial.text}</p>
                  <div className="profile">
                    <img src={testimonial.user} alt="" />
                    <div className="info">
                      <div className="name">{testimonial.name}</div>
                      <div className="role">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;