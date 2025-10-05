import React, { useState } from "react";
import Prod1 from "../assets/images/p1.png";
import Prod2 from "../assets/images/p2.png";
import Prod3 from "../assets/images/p3.png";
import Prod4 from "../assets/images/p4.png";
import star from "../assets/images/star.png";
import Close from "../assets/images/close.svg";
import CartImg from "../assets/images/cart1.svg";
import User1 from "../assets/images/user1.jpg";
import User2 from "../assets/images/user2.jpg";

const productImages = [Prod1, Prod2, Prod3, Prod4];
const relatedProducts = Array.from({ length: 4 }, (_, i) => ({
  id: i + 1,
  name: "Protein Jar Premium",
  price: "Rs.3000",
  desc: "High-quality protein supplement for muscle building and recovery. Perfect for post-workout nutrition.",
  reviews: 150 + i * 10,
  image: productImages[i % 4],
}));

const ProductDetail = () => {
  const [activeTab, setActiveTab] = useState('description');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [closed, setClosed] = useState(false);
  const [selectedFlavor, setSelectedFlavor] = useState('Glacial Grape');
  const [activeReviewFilter, setActiveReviewFilter] = useState('All Reviews');

  const flavors = ['Glacial Grape', 'Blue Raspberry'];
  const reviewFilters = ['All Reviews', 'With Photo & Video', 'With Description'];

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'benefits', label: 'Benefits' },
    { id: 'suggested', label: 'Suggested Use' },
    { id: 'nutrition', label: 'Nutritional Information' },
     { id: 'reviews', label: 'Reviews' },
  ];

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
                {productImages.map((img, idx) => (
                  <div 
                    key={idx} 
                    className={`thumbnail ${selectedImage === idx ? 'active' : ''}`}
                    onClick={() => setSelectedImage(idx)}
                  >
                    <img src={img} alt={`Product ${idx + 1}`} />
                  </div>
                ))}
              </div>
            </div>

            {/* Center - Main Image */}
            <div className="col-12 col-md-5">
              <div className="main-image">
                <img src={productImages[selectedImage]} alt="Clear Whey Protein Powder" />
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

                <h1 className="product-title mb-16">Clear Whey Protein Powder</h1>
                

                <div className="price-section mb-16">
                     <span className="original-price">Rs.2500</span>
                  <span className="current-price">Rs.2000</span>
                 
                </div>

                <div className="flavor-section mb-24">
                  <h4 className="mb-16 title-small">Flavor</h4>
                  <div className="flavor-options">
                    {flavors.map((flavor) => (
                      <button 
                        key={flavor}
                        className={`flavor-btn ${selectedFlavor === flavor ? 'active' : ''}`}
                        onClick={() => setSelectedFlavor(flavor)}
                      >
                        {flavor}
                      </button>
                    ))}
                  </div>
                </div>

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
                  Clear whey protein isolate is a ground-based protein supplement with excellent 
                  amino acid composition. Its typical amino acid composition contains all essential amino acids, including high levels 
                  of branched-chain amino acids (BCAAs) such as leucine, isoleucine, and valine.
                </p>
                <p className="mb-16">
                  Clear whey isolate typically contains a higher protein content compared to 
                  regular whey concentrate. The protein powder typically contains 90-95% protein by weight with 
                  minimal carbohydrates and fats, making it an ideal choice for those looking to build lean muscle.
                </p>
                <h4 className="mb-16">Suitable For:</h4>
                <ul className="feature-list">
                  <li>Athletes and fitness enthusiasts</li>
                  <li>Anyone looking to increase protein intake</li>
                  <li>Post-workout recovery</li>
                  <li>Weight management support</li>
                </ul>
                <h4 className="mb-16">Key Features:</h4>
                <ul className="feature-list">
                  <li>100% whey protein isolate</li>
                  <li>24g protein per serving</li>
                  <li>Fast absorption</li>
                  <li>Great taste and mixability</li>
                  <li>Third-party tested for purity</li>
                </ul>
              </div>
            )}
            
            {activeTab === 'suggested' && (
              <div className="suggested-content">
                <h3 className="mb-24">Suggested Use</h3>
                <p>Suggested use content will be displayed here...</p>
              </div>
            )}

            {activeTab === 'benefits' && (
              <div className="ingredients-content">
                <h3 className="mb-24">Ingredients</h3>
                <p>Ingredients list will be displayed here...</p>
              </div>
            )}
            
            {activeTab === 'nutrition' && (
              <div className="nutrition-content">
                <h3 className="mb-24">Nutrition Facts</h3>
                <p>Nutrition information will be displayed here...</p>
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
      <div className="related-products-section padding-40 dark-bg">
        <div className="container">
       <div class="d-flex justify-content-between align-items-center mb-24"><h3 class="title-medium">You may also like </h3><a href="#" class="view-all">View All</a></div>
          <div className="row">
            {relatedProducts.map((product, idx) => (
              <div className="col-12 col-md-6 col-lg-3" key={product.id}>
                <div className="product-card">
                  <div className="image">
                    <img src={product.image} alt={`Product ${product.id}`} />
                  </div>
                  <h3 className="name">{product.name}</h3>
                  <div className="reviews-container">
                    <div className="reviews">
                      {[...Array(5)].map((_, i) => (
                        <img src={star} alt="" key={i} />
                      ))}
                    </div>
                    <div className="text">({product.reviews})</div>
                  </div>
                  <p className="desc">{product.desc}</p>
                  <div className="bottom">
                    <div className="price">{product.price}</div>
                    <button className="button">
                      Add to Cart
                      <img src={CartImg} alt="" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;