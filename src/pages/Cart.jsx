import React, { useState } from 'react';
import Prod1 from "../assets/images/p1.png";
import Prod2 from "../assets/images/p2.png";
import Prod3 from "../assets/images/p3.png";
import Prod4 from "../assets/images/p4.png";
import DeleteIcon from "../assets/images/del.svg";

const cartItems = [
  {
    id: 1,
    name: "Protein 01",
    image: Prod1,
    price: 2500,
    quantity: 1,
    total: 3000
  },
  {
    id: 2,
    name: "Protein 01",
    image: Prod2,
    price: 2500,
    quantity: 1,
    total: 3000
  },
  {
    id: 3,
    name: "Protein 01",
    image: Prod3,
    price: 2500,
    quantity: 1,
    total: 3000
  },
  {
    id: 4,
    name: "Protein 01",
    image: Prod4,
    price: 2500,
    quantity: 1,
    total: 3000
  }
];

const Cart = () => {
  const [items, setItems] = useState(cartItems);
  const [selectAll, setSelectAll] = useState(true);
  const [selectedItems, setSelectedItems] = useState(cartItems.map(item => item.id));

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setItems(items.map(item => 
      item.id === id 
        ? { ...item, quantity: newQuantity, total: item.price * newQuantity }
        : item
    ));
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
    setSelectedItems(selectedItems.filter(itemId => itemId !== id));
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items.map(item => item.id));
    }
    setSelectAll(!selectAll);
  };

  const toggleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const totalAmount = items
    .filter(item => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="cart-wrapper dark-bg pt-100 top-100 ">
      <div className="container ">
        <div className="cart-header my-5">
          <h1 className="cart-title">My Cart</h1>
          <button className="to-pay-btn">To Pay</button>
        </div>

        <div className="cart-controls mb-24">
          <div className="select-all">
            <input 
              type="checkbox" 
              id="selectAll"
              checked={selectAll}
              onChange={toggleSelectAll}
            />
            <label htmlFor="selectAll">Select All ({items.length} items)</label>
          </div>
          <button className="delete-selected">
            <img src={DeleteIcon} alt="Delete" />
            Delete
          </button>
        </div>

        <div className="cart-table">
          <div className="cart-table-header">
            <div className="header-item">PRODUCT</div>
            <div className="header-item">PRICE</div>
            <div className="header-item">QTY</div>
            <div className="header-item">TOTAL</div>
            <div className="header-item">ACTION</div>
          </div>

          <div className="cart-table-body">
            {items.map((item) => (
              <div key={item.id} className="cart-row">
                <div className="cart-cell product-cell">
                  <input 
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => toggleSelectItem(item.id)}
                  />
                  <div className="product-info">
                    <img src={item.image} alt={item.name} />
                    <span className="product-name">{item.name}</span>
                  </div>
                </div>
                
                <div className="cart-cell price-cell">
                  <div className="price-info">
                    <span className="current-price">Rs.{item.price}</span>
                    <span className="original-price">Rs.{item.price + 500}</span>
                  </div>
                </div>
                
                <div className="cart-cell quantity-cell">
                  <div className="quantity-controls">
                    <button 
                      className="qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="qty-display">{item.quantity}</span>
                    <button 
                      className="qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div className="cart-cell total-cell">
                  <span className="total-price">Rs.{item.total}</span>
                </div>
                
                <div className="cart-cell action-cell">
                  <button 
                    className="delete-btn"
                    onClick={() => removeItem(item.id)}
                  >
                    <img src={DeleteIcon} alt="Delete" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="cart-footer">
         
            <span className="total-label">TOTAL AMOUNT:</span>
            <span className="total-amount">Rs.{totalAmount.toLocaleString()}</span>
          
        </div>
      </div>
    </div>
  );
};

export default Cart;