import React, { useState } from 'react';

const PaymentDetails = () => {
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const handlePaymentInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSavePayment = () => {
    console.log('Save payment:', paymentData);
  };

  const formatCardNumber = (value) => {
    return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiryDate = (value) => {
    return value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
  };

  return (
    <div className="payment-detail-section">
      <h2 className="payment-title">Update Payment Detail</h2>
      
      <div className="payment-form-container">
        <div className="payment-form">
          <div className="form-group">
            <label className="form-label">Credit or Debit Card Number</label>
            <div className="card-input-wrapper">
              <input
                type="text"
                name="cardNumber"
                value={formatCardNumber(paymentData.cardNumber)}
                onChange={(e) => handlePaymentInputChange({
                  target: { name: 'cardNumber', value: e.target.value.replace(/\s/g, '') }
                })}
                placeholder="XXXX XXXX XXXX XXXX"
                className="form-input card-input"
                maxLength="19"
              />
              <div className="card-icons">
                <div className="visa-icon"></div>
                <div className="mastercard-icon"></div>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label className="form-label">Expiry Date</label>
              <input
                type="text"
                name="expiryDate"
                value={formatExpiryDate(paymentData.expiryDate)}
                onChange={(e) => handlePaymentInputChange({
                  target: { name: 'expiryDate', value: e.target.value.replace(/\D/g, '') }
                })}
                placeholder="MM/YY"
                className="form-input"
                maxLength="5"
              />
            </div>

            <div className="form-group half">
              <label className="form-label">CVV/CVC</label>
              <input
                type="text"
                name="cvv"
                value={paymentData.cvv}
                onChange={handlePaymentInputChange}
                placeholder="CVV"
                className="form-input"
                maxLength="4"
              />
            </div>
          </div>

          <button 
            className="save-payment-btn"
            onClick={handleSavePayment}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;