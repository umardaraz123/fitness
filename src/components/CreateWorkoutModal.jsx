import React, { useState } from 'react';

const CreateWorkoutModal = ({ isOpen, onClose, clientName = "Ernest Houston" }) => {
  const [formData, setFormData] = useState({
    planName: 'Summer Shred 2025',
    goal: 'Weight Loss',
    difficulty: 'Beginner',
    duration: '45 minutes',
    trainingType: {
      strength: true,
      cardio: false,
      hit: false,
      yoga: false
    },
    frequency: '4 Days/Week',
    warmUpRequired: true,
    selectWarmUpExercise: 'Double Hold',
    coolDownRequired: true,
    selectCoolDownExercise: 'Select stretches',
    caloriesBurn: true,
    weightLifted: true,
    workoutDuration: true,
    personalRecords: true,
    addNotes: 'Focus on form over weight'
  });

  const [selectedExercises, setSelectedExercises] = useState([
    {
      id: 1,
      name: 'Long Jumps Alternated',
      reps: '30s',
      isSelected: true,
      image: '/src/assets/images/exercise1.jpg'
    },
    {
      id: 2,
      name: 'Squats',
      reps: '30s',
      isSelected: true,
      image: '/src/assets/images/exercise2.jpg'
    }
  ]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTrainingTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      trainingType: {
        ...prev.trainingType,
        [type]: !prev.trainingType[type]
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Workout plan created:', formData);
    onClose();
  };

  const toggleExerciseSelection = (exerciseId) => {
    setSelectedExercises(prev =>
      prev.map(exercise =>
        exercise.id === exerciseId
          ? { ...exercise, isSelected: !exercise.isSelected }
          : exercise
      )
    );
  };

  if (!isOpen) return null;

  return (
    <div className="create-workout-modal-overlay" onClick={onClose}>
      <div className="create-workout-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="create-workout-modal-header">
          <h3 className="modal-title">Create Workout Plan</h3>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="create-workout-modal-content">
          <form onSubmit={handleSubmit}>
            <div className="workout-form-grid">
              {/* Left Column - General Information */}
              <div className="workout-form-col">
                <div className="form-section">
                  <h4 className="section-title">General Information</h4>
                  
                  <div className="form-group">
                    <label>Plan Name</label>
                    <input
                      type="text"
                      placeholder="Summer Shred 2025"
                      value={formData.planName}
                      onChange={(e) => handleInputChange('planName', e.target.value)}
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label>Goal</label>
                    <div className="radio-group">
                      {['Weight Loss', 'Strength', 'Endurance'].map((option) => (
                        <label key={option} className="radio-label">
                          <input
                            type="radio"
                            name="goal"
                            checked={formData.goal === option}
                            onChange={() => handleInputChange('goal', option)}
                          />
                          <span className="radio-custom"></span>
                          {option}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Difficulty</label>
                    <div className="radio-group">
                      {['Beginner', 'Intermediate', 'Advanced'].map((option) => (
                        <label key={option} className="radio-label">
                          <input
                            type="radio"
                            name="difficulty"
                            checked={formData.difficulty === option}
                            onChange={() => handleInputChange('difficulty', option)}
                          />
                          <span className="radio-custom"></span>
                          {option}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Duration</label>
                    <select
                      value={formData.duration}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                      className="form-control"
                    >
                      <option value="30 minutes">30 minutes</option>
                      <option value="45 minutes">45 minutes</option>
                      <option value="60 minutes">60 minutes</option>
                      <option value="90 minutes">90 minutes</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Training Type</label>
                    <div className="checkbox-group">
                      {Object.entries({
                        strength: 'Strength',
                        cardio: 'Cardio',
                        hit: 'HIT',
                        yoga: 'Yoga'
                      }).map(([key, label]) => (
                        <label key={key} className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={formData.trainingType[key]}
                            onChange={() => handleTrainingTypeChange(key)}
                          />
                          <span className="checkbox-custom"></span>
                          {label}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Frequency</label>
                    <select
                      value={formData.frequency}
                      onChange={(e) => handleInputChange('frequency', e.target.value)}
                      className="form-control"
                    >
                      <option value="2 Days/Week">2 Days/Week</option>
                      <option value="3 Days/Week">3 Days/Week</option>
                      <option value="4 Days/Week">4 Days/Week</option>
                      <option value="5 Days/Week">5 Days/Week</option>
                      <option value="6 Days/Week">6 Days/Week</option>
                    </select>
                  </div>

                  {/* Warm-Up Section */}
                  <div className="form-group">
                    <div className="toggle-section">
                      <label className="toggle-label">
                        <span>Warm-Up Required?</span>
                        <div className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={formData.warmUpRequired}
                            onChange={(e) => handleInputChange('warmUpRequired', e.target.checked)}
                          />
                          <span className="toggle-slider"></span>
                        </div>
                      </label>
                    </div>
                    {formData.warmUpRequired && (
                      <div className="sub-form-group">
                        <label>Select Warm-Up Exercise</label>
                        <select
                          value={formData.selectWarmUpExercise}
                          onChange={(e) => handleInputChange('selectWarmUpExercise', e.target.value)}
                          className="form-control"
                        >
                          <option value="Double Hold">Double Hold</option>
                          <option value="Light Cardio">Light Cardio</option>
                          <option value="Dynamic Stretching">Dynamic Stretching</option>
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Cool-Down Section */}
                  <div className="form-group">
                    <div className="toggle-section">
                      <label className="toggle-label">
                        <span>Cool-Down Required?</span>
                        <div className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={formData.coolDownRequired}
                            onChange={(e) => handleInputChange('coolDownRequired', e.target.checked)}
                          />
                          <span className="toggle-slider"></span>
                        </div>
                      </label>
                    </div>
                    {formData.coolDownRequired && (
                      <div className="sub-form-group">
                        <label>Select Warm-Up Exercise</label>
                        <select
                          value={formData.selectCoolDownExercise}
                          onChange={(e) => handleInputChange('selectCoolDownExercise', e.target.value)}
                          className="form-control"
                        >
                          <option value="Select stretches">Select stretches</option>
                          <option value="Static Stretching">Static Stretching</option>
                          <option value="Meditation">Meditation</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Middle Column - Add Exercises */}
              <div className="workout-form-col">
                <div className="form-section">
                  <div className="exercises-header">
                    <h4 className="section-title">Add Exercises</h4>
                    <button type="button" className="add-exercise-btn">+ Add</button>
                  </div>
                  
                  <div className="exercises-list">
                    {selectedExercises.map((exercise) => (
                      <div key={exercise.id} className="exercise-item">
                        <div className="exercise-content">
                          <div className="exercise-image">
                            <img src={exercise.image} alt={exercise.name} />
                          </div>
                          <div className="exercise-info">
                            <h5 className="exercise-name">{exercise.name}</h5>
                            <span className="exercise-reps">{exercise.reps}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          className={`exercise-toggle ${exercise.isSelected ? 'selected' : ''}`}
                          onClick={() => toggleExerciseSelection(exercise.id)}
                        >
                          {exercise.isSelected ? '✓' : '+'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Progress Tracking */}
              <div className="workout-form-col">
                <div className="form-section">
                  <h4 className="section-title">Progress Tracking Settings</h4>
                  
                  <div className="progress-settings">
                    {[
                      { key: 'caloriesBurn', label: 'Calories Burn', checked: formData.caloriesBurn },
                      { key: 'weightLifted', label: 'Weight Lifted', checked: formData.weightLifted },
                      { key: 'workoutDuration', label: 'Workout Duration', checked: formData.workoutDuration },
                      { key: 'personalRecords', label: 'Personal Records (PRs)', checked: formData.personalRecords }
                    ].map((setting) => (
                      <div key={setting.key} className="progress-setting-item">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={setting.checked}
                            onChange={(e) => handleInputChange(setting.key, e.target.checked)}
                          />
                          <span className="checkbox-custom"></span>
                          {setting.label}
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="form-group">
                    <label>Add Notes</label>
                    <textarea
                      placeholder="Focus on form over weight"
                      value={formData.addNotes}
                      onChange={(e) => handleInputChange('addNotes', e.target.value)}
                      className="form-control textarea"
                      rows="3"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="create-workout-modal-footer">
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="button" className="btn-accent">
                Schedule Calendar
              </button>
              <button type="submit" className="btn-primary">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateWorkoutModal;