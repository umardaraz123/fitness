import React from 'react';

const WorkoutPlans = () => {
  const workoutPlans = [
    {
      id: 1,
      name: 'Beginner Strength Training',
      description: 'Full body strength training for beginners',
      duration: '8 weeks',
      status: 'Active',
      image: '/src/assets/react.svg',
      startDate: 'December 1, 2023',
      endDate: 'January 26, 2024',
      frequency: '3 days/week',
      price: 'Rs 1,999.00'
    },
    {
      id: 2,
      name: 'Advanced HIIT Program',
      description: 'High intensity interval training',
      duration: '12 weeks',
      status: 'Active',
      image: '/src/assets/react.svg',
      startDate: 'November 1, 2023',
      endDate: 'January 24, 2024',
      frequency: '4 days/week',
      price: 'Rs 2,999.00'
    },
    {
      id: 3,
      name: 'Cardio Blast',
      description: 'Fat burning cardio workouts',
      duration: '6 weeks',
      status: 'Complete',
      image: '/src/assets/react.svg',
      startDate: 'October 1, 2023',
      endDate: 'November 12, 2023',
      frequency: '5 days/week',
      price: 'Rs 1,499.00'
    }
  ];

  const handleStartWorkout = (planId) => {
    console.log('Start workout:', planId);
  };

  const handleDownloadPlan = (planId) => {
    console.log('Download workout plan:', planId);
  };

  return (
    <div className="my-orders-section">
      <h2 className="orders-title">My Workout Plans</h2>
      
      <div className="orders-list">
        {workoutPlans.map((plan) => (
          <div key={plan.id} className="order-group">
            <div className="order-header">
              <div className="order-info">
                <div className="order-id">Plan #: WP{plan.id.toString().padStart(3, '0')}</div>
                <div className="order-details">
                  <span className="order-date">{plan.startDate} - {plan.endDate}</span>
                  <span className="order-separator">|</span>
                  <span className="buy-again-text">{plan.duration} • {plan.frequency}</span>
                </div>
              </div>
              <div className="order-total">
                <span className="total-label">Price: </span>
                <span className="total-amount">{plan.price}</span>
              </div>
            </div>
            
            <div className="order-items">
              <div className="order-item">
                <div className="item-image">
                  <img src={plan.image} alt={plan.name} />
                </div>
                
                <div className="item-details">
                  <h4 className="item-name">{plan.name}</h4>
                  <p className="item-description">{plan.description}</p>
                  <div className="item-status">
                    <span className={`status-badge ${plan.status.toLowerCase()}`}>{plan.status}</span>
                  </div>
                </div>
                
                <div className="item-price">
                  <span className="price">{plan.frequency}</span>
                </div>
                
                <div className="item-actions">
                  {plan.status === 'Active' ? (
                    <button 
                      className="action-btn primary"
                      onClick={() => handleStartWorkout(plan.id)}
                    >
                      Start Workout
                    </button>
                  ) : (
                    <button 
                      className="action-btn primary"
                      onClick={() => handleDownloadPlan(plan.id)}
                    >
                      Download Plan
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutPlans;