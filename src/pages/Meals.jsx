import React from "react";
import { useState } from "react";
import Meal1 from '../assets/images/meal1.png';
import Meal2 from '../assets/images/meal2.png';
import Meal3 from '../assets/images/meal3.png';
import Meal4 from '../assets/images/meal4.png';
import Meal5 from '../assets/images/meal5.png';
import Meal6 from '../assets/images/meal6.png';
import Meal7 from '../assets/images/meal7.png';
import Meal8 from '../assets/images/meal8.png';
import Meal9 from '../assets/images/meal9.png';


const meals = [
  {
    image: Meal1,
    name: 'Greek Salad with Feta',
    desc: 'Crisp cucumbers, tomatoes, olives, and feta cheese tossed in olive oil for a light yet filling option.',
    price: 'Rs.1200',
  },
  {
    image: Meal2,
    name: 'Grilled Chicken & Quinoa Bowl',
    desc: 'A lean protein-packed meal with fluffy quinoa, fresh greens, and a light dressing for all-day energy.',
    price: 'Rs.1500',
  },
  {
    image: Meal3,
    name: 'PRO Steamed Salmon with Veggies',
    desc: 'Omega-3 rich salmon paired with broccoli, carrots, and a squeeze of lemon for clean nutrition.',
    price: 'Rs.1700',
  },
  {
    image: Meal4,
    name: 'Paneer Tikka Salad',
    desc: 'High-protein paneer tikka served on a bed of crisp salad for vegetarians.',
    price: 'Rs.1100',
  },
  {
    image: Meal5,
    name: 'Egg White Omelette',
    desc: 'Fluffy egg white omelette loaded with veggies for a light, protein-rich meal.',
    price: 'Rs.900',
  },
  {
    image: Meal6,
    name: 'Tofu Stir Fry',
    desc: 'Tofu and mixed vegetables stir-fried in a savory sauce for a vegan delight.',
    price: 'Rs.1000',
  },
  {
    image: Meal7,
    name: 'Veggie Omelette Wrap',
    desc: 'Fluffy eggs with spinach, peppers, and mushrooms, wrapped in a whole-wheat tortilla for a quick meal',
    price: 'Rs.1100',
  },
  {
    image: Meal8,
    name: 'Tropical Energy Mix',
    desc: 'Pineapple, mango, and kiwi slices packed with vitamin C to keep you refreshed and energized.',
    price: 'Rs.950',
  },
  {
    image: Meal9,
    name: 'Protein Pancake Mix',
    desc: 'A hearty, fiber-rich soup loaded with lentils, spinach, and spices to keep you full and fueled.',
    price: 'Rs.1300',
  },
];

const Meals = () => {
      const [activeTab, setActiveTab] =useState('keto');
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
<h3 className="title-medium mb-32">Categories</h3>
          <div className="custom-tabs mb-40">
            <div
              className={`tab${activeTab === 'keto' ? ' active' : ''}`}
              onClick={() => setActiveTab('keto')}
              style={{ cursor: 'pointer' }}
            >
             Keto Diet Membership
            </div>
            <div
              className={`tab${activeTab === 'fat-loss' ? ' active' : ''}`}
              onClick={() => setActiveTab('fat-loss')}
              style={{ cursor: 'pointer' }}
            >
              Fat Loss Diet Membership
            </div>
            <div
              className={`tab${activeTab === 'muscle-gain' ? ' active' : ''}`}
              onClick={() => setActiveTab('muscle-gain')}
              style={{ cursor: 'pointer' }}
            >
              Muscle Gain Diet Membership
            </div>
           
            <div
              className={`tab${activeTab === 'student' ? ' active' : ''}`}
              onClick={() => setActiveTab('student')}
              style={{ cursor: 'pointer' }}
            >
              Student Diet Membership
            </div>
          </div>
       
      <h2 className="Fat Loss Diets mb-32">Healthy Meals</h2>
      <div className="row">
        {meals.map((meal, idx) => (
          <div className="col-12 col-md-6 col-lg-4 mb-4" key={idx}>
            <div className="product-card">
              <div className="image lg">
                <img src={meal.image} alt={meal.name} />
              </div>
              <h3 className="name">{meal.name}</h3>
              <p className="desc">{meal.desc}</p>
              <div className="bottom">
                <div className="price">{meal.price}</div>
                <button className="button">Add to Cart</button>
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

export default Meals;
