import React from 'react';
import Prod1 from "../assets/images/p1.png";
import Prod2 from "../assets/images/p2.png";
import Prod3 from "../assets/images/p3.png";
import Prod4 from "../assets/images/p4.png";
import mealImage from "../assets/images/meal1.png";
import workoutImage from "../assets/images/fp.png";

const MyOrders = () => {
  const orders = [
    {
      id: '10234',
      date: 'Date of Purchase: 10:15 pm  Sept 15, 2023',
      buyAgainText: 'Buy Area shop',
      total: 'Rs. 50,000',
      items: [
        {
          id: 1,
          name: 'Supplement',
          description: 'for 7 Great Apple',
          image: Prod1,
          price: 'Rs 6,999.00',
          status: 'Delivered',
          buttonText: 'Buy Again',
          buttonType: 'primary'
        },
        {
          id: 2,
          name: 'Meal Plan 01',
          description: 'Serving 01',
          image: mealImage,
          price: 'Rs 6,999.00',
          status: 'Active',
          buttonText: 'View Plan',
          buttonType: 'primary'
        },
        {
          id: 3,
          name: 'Total War Pre Workout',
          description: 'Weight Loss',
          image: workoutImage,
          price: 'Rs 6,999.00',
          status: 'Complete',
          buttonText: 'Download Plan',
          buttonType: 'primary'
        }
      ]
    },
    {
      id: '10233',
      date: 'Date of Purchase: 10:15 pm  Sept 15, 2023',
      buyAgainText: 'Buy Area shop',
      total: 'Rs. 50,000',
      items: [
        {
          id: 4,
          name: 'Supplement',
          description: 'for 7 Great Apple',
          image: Prod2,
          price: 'Rs 6,999.00',
          status: 'Delivered',
          buttonText: 'Buy Again',
          buttonType: 'primary'
        },
        {
          id: 5,
          name: 'Meal Plan 01',
          description: 'Serving 01',
          image: mealImage,
          price: 'Rs 6,999.00',
          status: 'Active',
          buttonText: 'View Plan',
          buttonType: 'primary'
        },
        {
          id: 6,
          name: 'Total War Pre Workout',
          description: 'Weight Loss',
          image: workoutImage,
          price: 'Rs 9,999.00',
          status: 'Complete',
          buttonText: 'Download Plan',
          buttonType: 'primary'
        }
      ]
    }
  ];

  return (
    <div className="my-orders-section">
      <h2 className="orders-title">My Orders</h2>
      
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-group">
            <div className="order-header">
              <div className="order-info">
                <div className="order-id">Order #: {order.id}</div>
                <div className="order-details">
                  <span className="order-date">{order.date}</span>
                  <span className="order-separator">|</span>
                  <span className="buy-again-text">{order.buyAgainText}</span>
                </div>
              </div>
              <div className="order-total">
                <span className="total-label">Total: </span>
                <span className="total-amount">{order.total}</span>
              </div>
            </div>
            
            <div className="order-items">
              {order.items.map((item) => (
                <div key={item.id} className="order-item">
                  <div className="item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  
                  <div className="item-details">
                    <h4 className="item-name">{item.name}</h4>
                    <p className="item-description">{item.description}</p>
                    <div className="item-status">
                      <span className={`status-badge ${item.status.toLowerCase()}`}>{item.status}</span>
                    </div>
                  </div>
                  
                  <div className="item-price">
                    <span className="price">{item.price}</span>
                  </div>
                  
                  <div className="item-actions">
                    <button className={`action-btn ${item.buttonType}`}>
                      {item.buttonText}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;