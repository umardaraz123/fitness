import React, { useState } from 'react';

const QuestionnaireModal = ({ isOpen, onClose, clientName = "Ernest Houston" }) => {
  const [formData, setFormData] = useState({
    height: '6 ft',
    age: '26',
    currentWeight: '40',
    targetWeight: '50',
    medicalConditions: 'No',
    activityLevel: 'Sedentary (office work, little movement)',
    workoutType: 'Home workouts (minimal equipment)',
    weightLossGoal: '2-5 kg',
    biggestChallenge: 'Lack of time',
    planDuration: '4 Weeks',
    supplements: 'Yes',
    progressTracking: 'Yes'
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Questionnaire submitted:', formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="questionnaire-modal-overlay" onClick={onClose}>
      <div className="questionnaire-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="questionnaire-modal-header">
          <h3 className="modal-title">Weight Loss Plan - Pre-Checkout Questionnaire</h3>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="questionnaire-modal-content">
          <form onSubmit={handleSubmit}>
            <div className="questionnaire-row">
              {/* Left Column - General Information */}
              <div className="questionnaire-col">
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
                      placeholder="26"
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
                      {[
                        'Sedentary (office work, little movement)',
                        'Lightly active (walks, light exercise)',
                        'Moderately active (exercise 3-4 days/week)',
                        'Very active (exercise 5+ days/week)'
                      ].map((option) => (
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
                      {[
                        'Home workouts (minimal equipment)',
                        'Gym workouts (machines & weights)',
                        'Moderately active (3-4 workouts/week)',
                        'Mixed (both home + gym)'
                      ].map((option) => (
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
              <div className="questionnaire-col">
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
                      {[
                        'Lack of time',
                        'Lack of motivation',
                        'Unhealthy eating habits',
                        'Lack of knowledge about exercise'
                      ].map((option) => (
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
                      {['4 Weeks', '8 Weeks', '12 Weeks', '16+ Weeks'].map((option) => (
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
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="supplements"
                          checked={formData.supplements === 'Yes'}
                          onChange={() => handleInputChange('supplements', 'Yes')}
                        />
                        <span className="radio-custom"></span>
                        Yes
                      </label>
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="supplements"
                          checked={formData.supplements === 'No'}
                          onChange={() => handleInputChange('supplements', 'No')}
                        />
                        <span className="radio-custom"></span>
                        No
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>5. Do you want progress tracking tips & reminders?</label>
                    <div className="radio-group">
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="progressTracking"
                          checked={formData.progressTracking === 'Yes'}
                          onChange={() => handleInputChange('progressTracking', 'Yes')}
                        />
                        <span className="radio-custom"></span>
                        Yes
                      </label>
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="progressTracking"
                          checked={formData.progressTracking === 'No'}
                          onChange={() => handleInputChange('progressTracking', 'No')}
                        />
                        <span className="radio-custom"></span>
                        No
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="questionnaire-modal-footer">
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Save Questionnaire
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireModal;