import React from 'react';

const MealPlans = () => {
  const [showModal, setShowModal] = React.useState(false);
  const [modalData, setModalData] = React.useState({});

  const mealPlans = [
    {
      id: 1,
      name: 'Greek Salad with Feta',
      description: 'Crisp cucumbers, tomatoes, olives, and feta cheese tossed in olive oil for a light yet filling option.',
      duration: '30 days',
      status: 'Beginner',
      badge: 'Dinner',
      tags: ['Monday', 'Tuesday'],
      image: '/src/assets/images/meal1.png',
      calories: '338 kcal',
      price: 'Rs 2,999.00',
      ingredients: [
        '2 large eggs',
        '6 slices of turkey bacon',
        '1 lb baby spinach',
        '1/2 cup diced tomatoes',
        '1 tablespoon olive oil',
        'Salt and pepper to taste'
      ],
      directions: [
        'Crack the eggs into a mixing bowl, add a pinch of salt and pepper, and whisk until fully blended.',
        'Heat the skillet over medium heat and cook the turkey bacon until crispy, about 3-4 minutes on each side. Remove and set aside.',
        'In the same skillet, add olive oil and spinach. Saute until the spinach is wilted, about 2-3 minutes. Remove and set aside.',
        'Pour the egg mixture into the skillet and cook, stirring gently with a spatula, until the eggs are fully cooked but still soft, about 3-5 minutes.',
        'Plate the scrambled eggs with turkey bacon and sautéed spinach. Serve immediately.'
      ],
      tools: [
        'Non - stick skillet',
        'Spatula',
        'Mixing bowl',
        'Fork',
        'Measuring spoons'
      ],
      notes: [
        'For a lower-calorie option, substitute olive oil with a cooking spray and reduce the amount of turkey bacon.',
        'Add a sprinkle of cheese or herbs like chives or parsley for extra flavor.'
      ]
    },
    {
      id: 2,
      name: 'Grilled Chicken & Quinoa Bowl',
      description: 'A lean protein packed meal with fluffy quinoa, fresh greens, and a light dressing for all-day energy.',
      duration: '60 days',
      status: 'Intermediate',
      badge: 'Lunch',
      tags: ['Monday', 'Tuesday'],
      image: '/src/assets/images/meal2.png',
      calories: '425 kcal',
      price: 'Rs 4,999.00',
      ingredients: [
        '1 chicken breast',
        '1 cup quinoa',
        '2 cups mixed greens',
        '1 cucumber diced',
        '1 tbsp olive oil',
        'Lemon juice'
      ],
      directions: [
        'Cook quinoa according to package directions',
        'Season and grill chicken breast',
        'Prepare fresh vegetables',
        'Combine all ingredients',
        'Add dressing and serve'
      ],
      tools: [
        'Grill pan',
        'Mixing bowl',
        'Knife',
        'Cutting board'
      ],
      notes: [
        'Can be made ahead for meal prep',
        'Store dressing separately'
      ]
    },
    {
      id: 3,
      name: 'PRO Steamed Salmon with Veggies',
      description: 'Omega-3 rich salmon paired with broccoli, carrots, and a squeeze of lemon for clean nutrition.',
      duration: '90 days',
      status: 'Pro',
      badge: 'Lunch',
      tags: ['Monday', 'Tuesday'],
      image: '/src/assets/images/meal3.png',
      calories: '380 kcal',
      price: 'Rs 3,999.00',
      ingredients: [
        '1 salmon fillet',
        '1 cup broccoli',
        '1 cup carrots',
        'Lemon',
        'Olive oil',
        'Salt and pepper'
      ],
      directions: [
        'Steam salmon for 12-15 minutes',
        'Steam vegetables until tender',
        'Season with lemon and herbs',
        'Serve immediately'
      ],
      tools: [
        'Steamer',
        'Knife',
        'Plate'
      ],
      notes: [
        'High in omega-3 fatty acids',
        'Perfect for heart health'
      ]
    }
  ];

  const openModal = (plan) => {
    setModalData(plan);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowModal(false);
    document.body.style.overflow = 'auto';
  };

  const handleViewPlan = (planId) => {
    const plan = mealPlans.find(p => p.id === planId);
    if (plan) {
      openModal(plan);
    }
  };

  const getBadgeClass = (badge) => {
    switch(badge.toLowerCase()) {
      case 'beginner': return 'badge-beginner';
      case 'intermediate': return 'badge-intermediate';
      case 'pro': return 'badge-pro';
      case 'dinner': return 'badge-dinner';
      case 'lunch': return 'badge-lunch';
      default: return 'badge-beginner';
    }
  };

  return (
    <div className="meal-plans-section">
      <div className="container">
        <div className="row">
          {mealPlans.map((plan) => (
            <div key={plan.id} className="col-lg-4 col-md-6 col-sm-12">
              <div className="product-card meal-plan-card">
                <div className="image">
                  <img src={plan.image} alt={plan.name} />
                </div>
                
                <div className="meal-content">
                  <div className="meal-header">
                    <div className={`meal-badge ${getBadgeClass(plan.badge)}`}>
                      {plan.badge}
                    </div>
                    <div className="meal-tags">
                      {plan.tags.map((tag, index) => (
                        <span key={index} className="meal-tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                  
                  <h3 className="name">{plan.name}</h3>
                  <p className="desc">{plan.description}</p>
                  
                  <div className="bottom">
                    <button 
                      className="view-plan-btn max"
                      onClick={() => handleViewPlan(plan.id)}
                    >
                      View Plan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Meal Plan Modal */}
      {showModal && (
        <div className="fitness-modal-overlay" onClick={closeModal}>
          <div className="meal-modal-container" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeModal}>×</button>
            
            <div className="modal-content-wrapper">
              {/* First Row - Image and Info */}
              <div className="modal-top-row">
                {/* Left Side - Big Image */}
                <div className="modal-image-column">
                  <img src={modalData.image} alt={modalData.name} className="modal-main-image" />
                </div>
                
                {/* Right Side - Info */}
                <div className="modal-info-column">
                  {/* Badges and Title */}
                  <div className="modal-header-info">
                    <div className="meal-badges">
                      <span className={`meal-badge ${getBadgeClass(modalData.badge)}`}>
                        {modalData.badge}
                      </span>
                      <div className="meal-tags">
                        {modalData.tags?.map((tag, index) => (
                          <span key={index} className="meal-tag">{tag}</span>
                        ))}
                      </div>
                    </div>
                    <h3 className="meal-title">{modalData.name}</h3>
                    <p className="meal-desc">{modalData.description}</p>
                  </div>
                  
                  {/* Info Stats */}
                  <div className="info-stats">
                    <div className="stat-row">
                      <div className="stat-item">
                        <span className="stat-icon">🍽️</span>
                        <div className="stat-info">
                          <span className="stat-label">Eat Time</span>
                          <span className="stat-value">8:00 AM</span>
                        </div>
                      </div>
                      <div className="stat-item">
                        <span className="stat-icon">✏️</span>
                        <div className="stat-info">
                          <span className="stat-label">Prep Time</span>
                          <span className="stat-value">5 minutes</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="stat-row">
                      <div className="stat-item">
                        <span className="stat-icon">👥</span>
                        <div className="stat-info">
                          <span className="stat-label">Health Score</span>
                          <span className="stat-value">90/100</span>
                        </div>
                      </div>
                      <div className="stat-item">
                        <span className="stat-icon">�</span>
                        <div className="stat-info">
                          <span className="stat-label">Cook Time</span>
                          <span className="stat-value">10 minutes</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Ingredients Section */}
                  <div className="ingredients-section">
                    <h4 className="section-title">INGREDIENTS</h4>
                    <div className="ingredients-list">
                      {modalData.ingredients?.map((ingredient, index) => (
                        <div key={index} className="ingredient-item">
                          <span className="ingredient-bullet">•</span>
                          <span>{ingredient}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Second Row - Directions and Tools */}
              <div className="modal-bottom-row">
                {/* Left Side - Directions */}
                <div className="directions-column">
                  <h4 className="section-title">Directions</h4>
                  <div className="directions-list">
                    {modalData.directions?.map((direction, index) => (
                      <div key={index} className="direction-item">
                        <div className="step-number">{index + 1}</div>
                        <div className="step-content">
                          <h5 className="step-title">Step {index + 1}</h5>
                          <p className="step-description">{direction}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Right Side - Tools and Equipment */}
                <div className="tools-column">
                  <h4 className="section-title">Tools and Equipment</h4>
                  <div className="tools-list">
                    {modalData.tools?.map((tool, index) => (
                      <div key={index} className="tool-item">
                        <span className="tool-icon">✓</span>
                        <span>{tool}</span>
                      </div>
                    ))}
                  </div>
                  
                  {modalData.notes && modalData.notes.length > 0 && (
                    <>
                      <h4 className="section-title notes-title">Notes</h4>
                      <div className="notes-list">
                        {modalData.notes?.map((note, index) => (
                          <div key={index} className="note-item">
                            <span className="note-icon">✓</span>
                            <span>{note}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealPlans;