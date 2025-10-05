import React, { useState } from 'react';

const Membership = () => {
  const [billingCycle, setBillingCycle] = useState('Monthly');
  const [selectedPlan, setSelectedPlan] = useState('Professional');

  const billingOptions = ['Monthly', 'Yearly'];

  const membershipPlans = [
    {
      id: 'starter',
      name: 'Starter',
      price: { monthly: 19, yearly: 15 },
      originalPrice: { monthly: 25, yearly: 20 },
      description: 'Our Pro Plan offers advanced workouts and personalized nutrition coaching to help you reach your goals faster. Sign Up Right Now!',
      features: [
        'Access to All Of Our Exercise Videos',
        'Progress Tracking',
        'Supportive Online Community',
        'Advanced, Personalized Workout Plans',
        'Comprehensive Nutrition Coaching',
        'Access to Advanced Workout Programs',
        'MBody Composition Analysis',
        
      ],
      buttonText: 'Get Started',
      isPopular: false
    },
    {
      id: 'professional',
      name: 'Professional',
      price: { monthly: 54, yearly: 45 },
      originalPrice: { monthly: 70, yearly: 60 },
      description: 'Experience a fully tailored fitness experience with our Custom Plan. Work one-on-one with a dedicated trainer to achieve your goals.',
      features: [
        'Access to All Of Our Exercise Videos',
        'Progress Tracking',
        'Supportive Online Community',
        'Fully Customized Workout and Nutrition Plan',
        'Weekly Check-ins with Your Trainer',
        'Access to All Platform Features',
        'Exclusive Gear Discounts',
      ],
      buttonText: 'Get Started',
      isPopular: true
    },
    {
      id: 'premium',
      name: 'Premium',
      price: { monthly: 89, yearly: 75 },
      originalPrice: { monthly: 120, yearly: 100 },
      description: 'Experience a fully tailored fitness experience with our Custom Plan. Work one-on-one with a dedicated trainer to achieve your goals.',
      features: [
        'Access to All Of Our Exercise Videos ',
        'Progress Tracking',
        'Progress Tracking',
        'Supportive Online Community',
        'Unlimited Guest Passes',
        'Basic Nutrition Guidance',
        'Access to Group Fitness Classes',
        
      ],
      buttonText: 'Get Started',
      isPopular: false,
      isFeatured: true
    }
  ];

  const faqs = [
    {
      question: 'What supplements do you offer?',
      answer: 'At FitNation Form, we offer high-quality, nutrient-dense supplements conveniently packaged to fuel your on-the-go lifestyle. Our lineup includes Daily Greens, Whey Protein in chocolate and vanilla flavors, and Hydration Boost mixes in lemon lime, passionfruit guava, and orange yuzu flavors.'
    },
    {
      question: 'Can I cancel anytime?',
      answer: 'Yes, you can cancel your membership at any time. For monthly plans, cancellation takes effect at the end of your current billing cycle.'
    },
    {
      question: 'What if I don\'t like the product - can I get a refund?',
      answer: 'We offer a 30-day money-back guarantee on all our products and memberships. If you\'re not satisfied, we\'ll provide a full refund.'
    },
     {
      question: 'How long can I store my supplements, and how should I store them to maintain freshness?',
      answer: 'To maintain freshness, store your supplements in a cool, dry place away from direct sunlight. Most supplements have a shelf life of 1-2 years, but it\'s best to check the expiration date on the packaging.'
    },
    {
      question: 'Where are your products manufactured?',
      answer: 'All our products are manufactured in FDA-approved facilities with strict quality control measures and third-party testing for purity and potency.'
    }
  ];

  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="membership-container">
      {/* Plans & Pricing Section */}
      <div className="membership-header dark-bg top-100">
        <div className="container">
          <div className="empty-page">
            <h1 className="membership-title">Plans & Pricing</h1>
            
            {/* Billing Toggle */}
            <div className="billing-toggle">
              {billingOptions.map((option) => (
                <button
                  key={option}
                  className={`billing-btn ${billingCycle === option ? 'active' : ''}`}
                  onClick={() => setBillingCycle(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Membership Plans */}
          <div className="row justify-content-center member-ship-plans">
            {membershipPlans.map((plan) => (
              <div key={plan.id} className="col-12 col-md-6 col-lg-4" style={{marginBottom: '30px'}}>
                <div className={`membership-card ${plan.isPopular ? 'popular' : ''} ${plan.isFeatured ? 'featured' : ''}`}>
                  {plan.isPopular && <div className="popular-badge">Most Popular</div>}
                  {plan.isFeatured && <div className="featured-badge">Best Value</div>}
                  
                  <div className="plan-header">
                    <div className="plan-price">
                      <span className="currency">$</span>
                      <span className="amount">{plan.price[billingCycle.toLowerCase()]}</span>
                      <span className="period">/{billingCycle === 'Monthly' ? 'month' : 'year'}</span>
                    </div>
                    
                    
                    <h3 className="plan-name">{plan.name}</h3>
                    <p className="plan-description">{plan.description}</p>
                  </div>

                  <div className="plan-features">
                    <ul className="features-list">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="feature-item">
                          <span className="check-icon">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="plan-footer">
                    <button 
                      className={`plan-btn ${plan.isFeatured ? 'featured-btn' : ''}`}
                      onClick={() => setSelectedPlan(plan.name)}
                    >
                      {plan.buttonText}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="faq-section dark-bg padding-40">
        <div className="container">
          <div className="text-center mb-40">
            <h2 className="faq-title">Frequently Ask Questions</h2>
          </div>

          <div className="row justify-content-center">
            <div className="col-12 col-lg-8">
              <div className="faq-list">
                {faqs.map((faq, index) => (
                  <div key={index} className="faq-item">
                    <div 
                      className={`faq-question ${openFaq === index ? 'active' : ''}`}
                      onClick={() => toggleFaq(index)}
                    >
                      <h4>{faq.question}</h4>
                      <span className="faq-icon">{openFaq === index ? '−' : '+'}</span>
                    </div>
                    {openFaq === index && (
                      <div className="faq-answer">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

    
    </div>
  );
};

export default Membership;