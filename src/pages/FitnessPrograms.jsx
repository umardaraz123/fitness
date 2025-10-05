import React from "react";
import Image1 from '../assets/images/fp.png';
import Image2 from '../assets/images/fp2.jpg';
import Image3 from '../assets/images/fp3.jpg';
import Image4 from '../assets/images/fp4.jpg';
import Image5 from '../assets/images/fp5.jpg';
import Image6 from '../assets/images/fp6.jpg';
import Image7 from '../assets/images/fp7.jpg';
import Image8 from '../assets/images/fp8.jpg';
import Image9 from '../assets/images/fp9.jpg';
import Prod1 from '../assets/images/p1.png';
import Prod2 from '../assets/images/p2.png';
import Prod3 from '../assets/images/p3.png';
import Prod4 from '../assets/images/p4.png';
import star from '../assets/images/star.png';

import CartImg from "../assets/images/cart1.svg";

const membershipPlans = Array.from({ length: 9 }, (_, i) => ({
  id: i + 1,
  title: 'PROTINE JAR',
  image: [Prod1, Prod2, Prod3, Prod4][i % 4],
  desc: 'Fuel your workouts and speed up recovery with high-quality whey protein isolate. Packed with essential amino acids, it helps build lean muscle, reduce soreness, and keep you energized...'
}));



const plans = [
  { id: 1, title: 'Weight Gain Plan 1', image: Image1, desc: 'Fuel your workouts and speed up recovery with high-quality whey protein isolate. Packed with essential amino acids, it helps build lean muscle, reduce soreness, and keep you energized...' },
  { id: 2, title: 'Weight Gain Plan 2', image: Image2, desc: 'Fuel your workouts and speed up recovery with high-quality whey protein isolate. Packed with essential amino acids, it helps build lean muscle, reduce soreness, and keep you energized...' },
  { id: 3, title: 'Weight Gain Plan 3', image: Image3, desc: 'Fuel your workouts and speed up recovery with high-quality whey protein isolate. Packed with essential amino acids, it helps build lean muscle, reduce soreness, and keep you energized...' },
  { id: 4, title: 'Weight Gain Plan 4', image: Image4, desc: 'Fuel your workouts and speed up recovery with high-quality whey protein isolate. Packed with essential amino acids, it helps build lean muscle, reduce soreness, and keep you energized...' },
  { id: 5, title: 'Weight Gain Plan 5', image: Image5, desc: 'Fuel your workouts and speed up recovery with high-quality whey protein isolate. Packed with essential amino acids, it helps build lean muscle, reduce soreness, and keep you energized...' },
  { id: 6, title: 'Weight Gain Plan 6', image: Image6, desc: 'Fuel your workouts and speed up recovery with high-quality whey protein isolate. Packed with essential amino acids, it helps build lean muscle, reduce soreness, and keep you energized...' },
  { id: 7, title: 'Weight Gain Plan 7', image: Image7, desc: 'Fuel your workouts and speed up recovery with high-quality whey protein isolate. Packed with essential amino acids, it helps build lean muscle, reduce soreness, and keep you energized...' },
  { id: 8, title: 'Weight Gain Plan 8', image: Image8, desc: 'Fuel your workouts and speed up recovery with high-quality whey protein isolate. Packed with essential amino acids, it helps build lean muscle, reduce soreness, and keep you energized...' },
  { id: 9, title: 'Weight Gain Plan 9', image: Image9, desc: 'Fuel your workouts and speed up recovery with high-quality whey protein isolate. Packed with essential amino acids, it helps build lean muscle, reduce soreness, and keep you energized...' },
];

const FitnessPrograms = () => {
  const [activeTab, setActiveTab] = React.useState('one-time');
  const [activePlan, setActivePlan] = React.useState('diet');
  const [selectedGoal, setSelectedGoal] = React.useState('weight-gain');
  const [membershipButton, setMembershipButton] = React.useState('gym');
  const [membershipRadio, setMembershipRadio] = React.useState('weight-gain');
  const [showModal, setShowModal] = React.useState(false);
  const [modalData, setModalData] = React.useState({});

  // Modal form states
  const [formData, setFormData] = React.useState({
    height: '',
    age: '',
    currentWeight: '',
    targetWeight: '',
    medicalConditions: '',
    weightLossGoal: '2-5 kg',
    biggestChallenge: 'Lack of time',
    activityLevel: 'Sedentary (office work, little movement)',
    workoutType: 'Home workouts (minimal equipment)',
    planDuration: '4 Weeks',
    supplementRecommendations: 'Yes',
    progressTracking: 'Yes'
  });

  const openModal = (plan) => {
    setModalData(plan);
    setShowModal(true);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  const closeModal = () => {
    setShowModal(false);
    document.body.style.overflow = 'auto'; // Restore scrolling
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddToCart = () => {
    console.log('Adding to cart with data:', formData);
    // Add your cart logic here
    closeModal();
  };

  return (
    <div className="fitness-programs-page">
      <div className="fitness-page top-100">
        <div className="content">
          <h3 className="title mb-8">
            Gain the Right Way
            <br />
            Not the Wrong Way
          </h3>
        </div>
      </div>
      <div className="dark-bg padding-60">
        <div className="container">
          <h3 className="title-medium mb-32">Categories</h3>
          <div className="custom-tabs">
            <div
              className={`tab${activeTab === 'one-time' ? ' active' : ''}`}
              onClick={() => setActiveTab('one-time')}
              style={{ cursor: 'pointer' }}
            >
              One-Time Plans
            </div>
            <div
              className={`tab${activeTab === 'membership' ? ' active' : ''}`}
              onClick={() => setActiveTab('membership')}
              style={{ cursor: 'pointer' }}
            >
              Membership Plans
            </div>
          </div>
          {/* Tab Content */}
          {activeTab === 'one-time' && (
            
              <div className="tab-content padding-40">
                <div className="buttons">
                  <button
                    className={`button-border${activePlan === 'diet' ? ' active' : ''}`}
                    onClick={() => setActivePlan('diet')}
                  >
                    Diet Plans
                  </button>
                  <button
                    className={`button-border${activePlan === 'workout' ? ' active' : ''}`}
                    onClick={() => setActivePlan('workout')}
                  >
                    Workout Plans
                  </button>
                </div>
                <div className="custom-radio-wrapper">
                  <div className="radio-item">
                    <input
                      type="radio"
                      name="one-time-plans"
                      id="weight-gain"
                      checked={selectedGoal === 'weight-gain'}
                      onChange={() => setSelectedGoal('weight-gain')}
                    />
                    <label htmlFor="weight-gain">Weight Gain</label>
                  </div>
                  <div className="radio-item">
                    <input
                      type="radio"
                      name="one-time-plans"
                      id="weight-loss"
                      checked={selectedGoal === 'weight-loss'}
                      onChange={() => setSelectedGoal('weight-loss')}
                    />
                    <label htmlFor="weight-loss"> Weight Loss</label>
                  </div>
                  <div className="radio-item">
                    <input
                      type="radio"
                      name="one-time-plans"
                      id="balanced"
                      checked={selectedGoal === 'balanced'}
                      onChange={() => setSelectedGoal('balanced')}
                    />
                    <label htmlFor="balanced">  Balanced</label>
                  </div>
                </div>
                <div className="padding-40">
                  <h3 className="title-medium mb-32">One - Time Plans (9/20)</h3>
                  <div className="row">
                    {plans.map((plan, idx) => (
                      <div className="col-12 col-md-6 col-lg-4" key={plan.id}>
                        <div className="product-card">
                          <div className="image lg">
                            <img src={plan.image} alt={`Plan ${plan.id}`} />
                          </div>
                          <h3 className="name">{plan.title}</h3>
                          <div className="reviews-container">
                            <div className="reviews">
                              {[...Array(5)].map((_, i) => (
                                <img src={star} alt="" key={i} />
                              ))}
                            </div>
                            <div className="text">
                                (230)
                            </div>
                          </div>
                          <p className="desc">{plan.desc}</p>
                          <div className="bottom">
                            <div className="price">
                                Rs.2000
                            </div>
                            <button className="button" onClick={() => openModal(plan)}>
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
            
          )}
          {activeTab === 'membership' && (
            <div className="tab-content padding-40">
              <div className="buttons mb-32">
                <button
                  className={`button-border${membershipButton === 'gym' ? ' active' : ''}`}
                  onClick={() => setMembershipButton('gym')}
                >
                  Gym Membership
                </button>
                <button
                  className={`button-border${membershipButton === 'trainer' ? ' active' : ''}`}
                  onClick={() => setMembershipButton('trainer')}
                >
                  Fitness Plan (Trainer)
                </button>
                <button
                  className={`button-border${membershipButton === 'ultimate' ? ' active' : ''}`}
                  onClick={() => setMembershipButton('ultimate')}
                >
                  Ultimate Fitness Plan
                </button>
              </div>
              <div className="custom-radio-wrapper mb-32">
                <div className="radio-item">
                  <input
                    type="radio"
                    name="membership-plans"
                    id="weight-gain-mem"
                    checked={membershipRadio === 'weight-gain'}
                    onChange={() => setMembershipRadio('weight-gain')}
                  />
                  <label htmlFor="weight-gain-mem">Weight Gain</label>
                </div>
                <div className="radio-item">
                  <input
                    type="radio"
                    name="membership-plans"
                    id="weight-loss-mem"
                    checked={membershipRadio === 'weight-loss'}
                    onChange={() => setMembershipRadio('weight-loss')}
                  />
                  <label htmlFor="weight-loss-mem">Weight Loss</label>
                </div>
                <div className="radio-item">
                  <input
                    type="radio"
                    name="membership-plans"
                    id="balanced-mem"
                    checked={membershipRadio === 'balanced'}
                    onChange={() => setMembershipRadio('balanced')}
                  />
                  <label htmlFor="balanced-mem">Balanced</label>
                </div>
              </div>
               
                 <div className="padding-40">
                     <h3 className="title-medium mb-32">Membership Plans (9/20)</h3>
              <div className="row">
                {membershipPlans.map((plan, idx) => (
                  <div className="col-12 col-md-6 col-lg-4" key={plan.id}>
                    <div className="product-card">
                      <div className="image lg">
                        <img src={plan.image} alt={`Membership Plan ${plan.id}`} />
                      </div>
                      <h3 className="name">{plan.title}</h3>
                      <p className="desc">{plan.desc}</p>
                      <div className="bottom">
                        <button className="button" onClick={() => openModal(plan)}>
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
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fitness-modal-overlay" onClick={closeModal}>
          <div className="fitness-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="fitness-modal-header">
              <h3 className="modal-title">Weight Loss Plan - Pre-Checkout Questionnaire</h3>
              <button className="modal-close-btn" onClick={closeModal}>×</button>
            </div>
            
            <div className="fitness-modal-content">
              <div className="row">
                {/* Left Column - General Information */}
                <div className="col-12 col-md-6">
                  <div className="form-section">
                    <h4 className="section-title">General Information</h4>
                    
                    <div className="form-group">
                      <label>Height</label>
                      <input
                        type="text"
                        placeholder="6 ft"
                        value={formData.height}
                        onChange={(e) => handleInputChange('height', e.target.value)}
                        className="form-control"
                      />
                    </div>

                    <div className="form-group">
                      <label>Age</label>
                      <input
                        type="number"
                        placeholder="25"
                        value={formData.age}
                        onChange={(e) => handleInputChange('age', e.target.value)}
                        className="form-control"
                      />
                    </div>

                    <div className="form-group">
                      <label>Current Weight (kg)</label>
                      <input
                        type="number"
                        placeholder="40"
                        value={formData.currentWeight}
                        onChange={(e) => handleInputChange('currentWeight', e.target.value)}
                        className="form-control"
                      />
                    </div>

                    <div className="form-group">
                      <label>Target Weight (kg)</label>
                      <input
                        type="number"
                        placeholder="50"
                        value={formData.targetWeight}
                        onChange={(e) => handleInputChange('targetWeight', e.target.value)}
                        className="form-control"
                      />
                    </div>

                    <div className="form-group">
                      <label>Do you have any medical conditions? (Diabetes, Heart issues, Thyroid issue, etc)</label>
                      <div className="radio-group">
                        <label className="radio-label">
                          <input
                            type="radio"
                            name="medical"
                            checked={formData.medicalConditions === 'Yes'}
                            onChange={() => handleInputChange('medicalConditions', 'Yes')}
                          />
                          <span className="radio-custom"></span>
                          Yes
                        </label>
                        <label className="radio-label">
                          <input
                            type="radio"
                            name="medical"
                            checked={formData.medicalConditions === 'No'}
                            onChange={() => handleInputChange('medicalConditions', 'No')}
                          />
                          <span className="radio-custom"></span>
                          No
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Lifestyle & Preferences */}
                  <div className="form-section">
                    <h4 className="section-title">Lifestyle & Preferences</h4>
                    
                    <div className="form-group">
                      <label>1. What is your daily activity level?</label>
                      <div className="radio-group">
                        {['Sedentary (office work, little movement)', 'Lightly active (walks, light exercise)', 'Moderately active (exercise 3-4 days/week)', 'Very active (exercise 5+ days/week)'].map((option) => (
                          <label key={option} className="radio-label">
                            <input
                              type="radio"
                              name="activityLevel"
                              checked={formData.activityLevel === option}
                              onChange={() => handleInputChange('activityLevel', option)}
                            />
                            <span className="radio-custom"></span>
                            {option}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="form-group">
                      <label>2. What type of workouts do you prefer?</label>
                      <div className="radio-group">
                        {['Home workouts (minimal equipment)', 'Gym workouts (machines & weights)', 'Moderately active (3-4 workouts/week)', 'Mixed (both home + gym)'].map((option) => (
                          <label key={option} className="radio-label">
                            <input
                              type="radio"
                              name="workoutType"
                              checked={formData.workoutType === option}
                              onChange={() => handleInputChange('workoutType', option)}
                            />
                            <span className="radio-custom"></span>
                            {option}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Weight Loss Goals */}
                <div className="col-12 col-md-6">
                  <div className="form-section">
                    <h4 className="section-title">Weight Loss Goals</h4>
                    
                    <div className="form-group">
                      <label>1. How much weight do you want to lose?</label>
                      <div className="radio-group">
                        {['2-5 kg', '5-10 kg', '10-15 kg', '15+ kg'].map((option) => (
                          <label key={option} className="radio-label">
                            <input
                              type="radio"
                              name="weightLossGoal"
                              checked={formData.weightLossGoal === option}
                              onChange={() => handleInputChange('weightLossGoal', option)}
                            />
                            <span className="radio-custom"></span>
                            {option}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="form-group">
                      <label>2. What's your biggest challenge in losing weight?</label>
                      <div className="radio-group">
                        {['Lack of time', 'Cravings & diet control', 'Staying consistent', 'Not knowing what works'].map((option) => (
                          <label key={option} className="radio-label">
                            <input
                              type="radio"
                              name="biggestChallenge"
                              checked={formData.biggestChallenge === option}
                              onChange={() => handleInputChange('biggestChallenge', option)}
                            />
                            <span className="radio-custom"></span>
                            {option}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="form-group">
                      <label>3. Preferred plan duration:</label>
                      <div className="radio-group">
                        {['4 Weeks', '8 Weeks', '12 Weeks'].map((option) => (
                          <label key={option} className="radio-label">
                            <input
                              type="radio"
                              name="planDuration"
                              checked={formData.planDuration === option}
                              onChange={() => handleInputChange('planDuration', option)}
                            />
                            <span className="radio-custom"></span>
                            {option}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="form-group">
                      <label>4. Would you like supplement recommendations with your plan?</label>
                      <div className="radio-group">
                        {['Yes', 'No'].map((option) => (
                          <label key={option} className="radio-label">
                            <input
                              type="radio"
                              name="supplementRecommendations"
                              checked={formData.supplementRecommendations === option}
                              onChange={() => handleInputChange('supplementRecommendations', option)}
                            />
                            <span className="radio-custom"></span>
                            {option}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="form-group">
                      <label>5. Do you want progress tracking tips & reminders?</label>
                      <div className="radio-group">
                        {['Yes', 'No'].map((option) => (
                          <label key={option} className="radio-label">
                            <input
                              type="radio"
                              name="progressTracking"
                              checked={formData.progressTracking === option}
                              onChange={() => handleInputChange('progressTracking', option)}
                            />
                            <span className="radio-custom"></span>
                            {option}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="fitness-modal-footer">
              <button className="modal-add-btn" onClick={handleAddToCart}>
                Add to Cart
                <img src={CartImg} alt="" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FitnessPrograms;
