import React, { useState } from 'react';
import Prod1 from "../assets/images/p1.png";

const Checkout = () => {
  const [formData, setFormData] = useState({
    // Contact
    email: '',
    emailOffers: true,
    // Delivery
    country: 'India',
    firstName: '',
    lastName: '',
    company: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    saveInfo: false,
    // Shipping Method
    shippingMethod: 'free',
    // Payment
    paymentMethod: 'cod',
    cardNumber: '',
    expiryDate: '',
    securityCode: '',
    nameOnCard: '',
    // Billing Address
    sameAsShipping: true,
    billingAddress: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const orderItems = [
    {
      id: 1,
      name: 'One Time Whey Protein',
      image: Prod1,
      price: 2500,
      quantity: 1
    }
  ];

  const subtotal = 2500;
  const shipping = 0;
  const total = subtotal + shipping;

  return (
    <div className="checkout-container dark-bg top-100 pt-100">
      <div className="container">
        <div className="row">
          {/* Left Column - Forms */}
          <div className="col-12 col-lg-6">
            <div className="checkout-forms">
              {/* Contact Section */}
              <div className="checkout-section">
                <h2 className="section-title">Contact</h2>
                <div className="form-group">
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="form-control"
                  />
                </div>
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.emailOffers}
                      onChange={(e) => handleInputChange('emailOffers', e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    Email me with news and offers
                  </label>
                </div>
              </div>

              {/* Delivery Section */}
              <div className="checkout-section">
                <h2 className="section-title">Delivery</h2>
                
                <div className="form-group">
                  <select
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className="form-control"
                  >
                    <option value="India">India</option>
                    <option value="USA">USA</option>
                    <option value="UK">UK</option>
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group half">
                    <input
                      type="text"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group half">
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Company (optional)"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Apartment, suite, etc. (optional)"
                    value={formData.apartment}
                    onChange={(e) => handleInputChange('apartment', e.target.value)}
                    className="form-control"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group third">
                    <input
                      type="text"
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group third">
                    <select
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className="form-control"
                    >
                      <option value="">State</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Bangalore">Bangalore</option>
                    </select>
                  </div>
                  <div className="form-group third">
                    <input
                      type="text"
                      placeholder="PIN code"
                      value={formData.pincode}
                      onChange={(e) => handleInputChange('pincode', e.target.value)}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="form-control"
                  />
                </div>

                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.saveInfo}
                      onChange={(e) => handleInputChange('saveInfo', e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    Save this information for next time
                  </label>
                </div>
              </div>

              {/* Shipping Method Section */}
              <div className="checkout-section">
                <h2 className="section-title">Shipping Method</h2>
                <div className="shipping-options">
                  <label className="shipping-option">
                    <input
                      type="radio"
                      name="shipping"
                      value="free"
                      checked={formData.shippingMethod === 'free'}
                      onChange={(e) => handleInputChange('shippingMethod', e.target.value)}
                    />
                    <span className="radio-custom"></span>
                    <div className="shipping-info">
                      <span className="shipping-name">Free</span>
                      <span className="shipping-price">Free</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Payment Section */}
              <div className="checkout-section">
                <h2 className="section-title">Payment</h2>
                <p className="payment-subtitle">All transactions are secure and encrypted.</p>
                
                <div className="payment-options">
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                    />
                    <span className="radio-custom"></span>
                    <span>Cash on Delivery (COD)</span>
                  </label>
                  
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                    />
                    <span className="radio-custom"></span>
                    <span>Credit / Debit Card</span>
                  </label>
                </div>

                {formData.paymentMethod === 'card' && (
                  <div className="card-details">
                    <div className="card-section">
                      <h4 className="card-title">Credit or Debit Card Number</h4>
                      <div className="form-group">
                        <div className="card-input-wrapper">
                          <div className="card-icon">
                            <div className="card-brand">💳</div>
                          </div>
                          <input
                            type="text"
                            placeholder="xxxx xxxx xxxx xxxx"
                            value={formData.cardNumber}
                            onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                            className="form-control card-number"
                          />
                        </div>
                      </div>
                      
                      <div className="form-row">
                        <div className="form-group half">
                          <label>Expiry Date</label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            value={formData.expiryDate}
                            onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                            className="form-control"
                          />
                        </div>
                        <div className="form-group half">
                          <label>CVV/CVC</label>
                          <input
                            type="text"
                            placeholder="CVV"
                            value={formData.securityCode}
                            onChange={(e) => handleInputChange('securityCode', e.target.value)}
                            className="form-control"
                          />
                        </div>
                      </div>

                      <div className="payment-methods">
                        <span className="payment-label">Payment Method</span>
                        <div className="payment-icons">
                          <div className="payment-icon mastercard">MC</div>
                          <div className="payment-icon visa">VISA</div>
                          <div className="payment-icon amex">AMEX</div>
                          <div className="payment-icon discover">DISC</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Billing Address Section */}
              <div className="checkout-section">
                <h2 className="section-title">Billing Address</h2>
                <div className="billing-options">
                  <label className="billing-option">
                    <input
                      type="radio"
                      name="billing"
                      value="same"
                      checked={formData.sameAsShipping}
                      onChange={(e) => handleInputChange('sameAsShipping', e.target.value === 'same')}
                    />
                    <span className="radio-custom"></span>
                    <span>Same as shipping address</span>
                  </label>
                  <label className="billing-option">
                    <input
                      type="radio"
                      name="billing"
                      value="different"
                      checked={!formData.sameAsShipping}
                      onChange={(e) => handleInputChange('sameAsShipping', e.target.value !== 'different')}
                    />
                    <span className="radio-custom"></span>
                    <span>Use a different billing address</span>
                  </label>
                </div>

                {!formData.sameAsShipping && (
                  <div className="billing-address-form">
                    <div className="form-group">
                      <select
                        value={formData.billingCountry || 'India'}
                        onChange={(e) => handleInputChange('billingCountry', e.target.value)}
                        className="form-control"
                      >
                        <option value="India">India</option>
                        <option value="USA">USA</option>
                        <option value="UK">UK</option>
                      </select>
                    </div>

                    <div className="form-row">
                      <div className="form-group half">
                        <input
                          type="text"
                          placeholder="First Name"
                          value={formData.billingFirstName || ''}
                          onChange={(e) => handleInputChange('billingFirstName', e.target.value)}
                          className="form-control"
                        />
                      </div>
                      <div className="form-group half">
                        <input
                          type="text"
                          placeholder="Last Name"
                          value={formData.billingLastName || ''}
                          onChange={(e) => handleInputChange('billingLastName', e.target.value)}
                          className="form-control"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="Company (optional)"
                        value={formData.billingCompany || ''}
                        onChange={(e) => handleInputChange('billingCompany', e.target.value)}
                        className="form-control"
                      />
                    </div>

                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="Address"
                        value={formData.billingAddress || ''}
                        onChange={(e) => handleInputChange('billingAddress', e.target.value)}
                        className="form-control"
                      />
                    </div>

                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="Apartment, suite, etc. (optional)"
                        value={formData.billingApartment || ''}
                        onChange={(e) => handleInputChange('billingApartment', e.target.value)}
                        className="form-control"
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group third">
                        <input
                          type="text"
                          placeholder="City"
                          value={formData.billingCity || ''}
                          onChange={(e) => handleInputChange('billingCity', e.target.value)}
                          className="form-control"
                        />
                      </div>
                      <div className="form-group third">
                        <select
                          value={formData.billingState || ''}
                          onChange={(e) => handleInputChange('billingState', e.target.value)}
                          className="form-control"
                        >
                          <option value="">State</option>
                          <option value="Delhi">Delhi</option>
                          <option value="Mumbai">Mumbai</option>
                          <option value="Bangalore">Bangalore</option>
                        </select>
                      </div>
                      <div className="form-group third">
                        <input
                          type="text"
                          placeholder="PIN code"
                          value={formData.billingPincode || ''}
                          onChange={(e) => handleInputChange('billingPincode', e.target.value)}
                          className="form-control"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Complete Order Button */}
              <div className="complete-order-section">
                <button className="complete-order-btn">
                  Complete order
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="col-12 col-lg-6">
            <div className="order-summary">
              <div className="order-items">
                {orderItems.map((item) => (
                  <div key={item.id} className="order-item">
                    <div className="item-image">
                      <img src={item.image} alt={item.name} />
                      <span className="item-quantity">{item.quantity}</span>
                    </div>
                    <div className="item-details">
                      <h4 className="item-name">{item.name}</h4>
                    </div>
                    <div className="item-price">
                      Rs.{item.price.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <div className="promo-code">
                <div className="promo-input-group">
                  <input
                    type="text"
                    placeholder="Discount code"
                    className="promo-input"
                  />
                  <button className="apply-btn">Apply</button>
                </div>
              </div>

              <div className="order-totals">
                <div className="total-line">
                  <span>Subtotal</span>
                  <span>Rs.{subtotal.toLocaleString()}</span>
                </div>
                <div className="total-line">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `Rs.${shipping}`}</span>
                </div>
                <div className="total-line final-total">
                  <span>Total</span>
                  <span>Rs.{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;