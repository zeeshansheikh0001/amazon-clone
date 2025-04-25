import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getCartItems } from '../redux/slices/cartSlice';
import { FaLock, FaShippingFast, FaCreditCard, FaArrowLeft } from 'react-icons/fa';
import '../assets/css/CheckoutPage.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.auth);
  const { cartItems, isLoading } = useSelector((state) => state.cart);
  
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState({
    // Shipping info
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    phone: '',
    
    // Payment info
    cardNumber: '',
    nameOnCard: '',
    expiryDate: '',
    cvv: '',
    saveCard: false
  });
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    dispatch(getCartItems());
  }, [dispatch, navigate, user]);
  
  // Calculate order summary
  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => {
      if (!item.product) return sum;
      const price = item.product.price ? parseFloat(item.product.price) : 0;
      return sum + (price * item.quantity);
    }, 0);
  };
  
  const subtotal = calculateSubtotal();
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.07; // Assuming 7% tax
  const total = subtotal + shipping + tax;
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: ''
      }));
    }
  };
  
  const validateForm = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      // Shipping validation
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!formData.addressLine1.trim()) newErrors.addressLine1 = 'Address is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.state.trim()) newErrors.state = 'State is required';
      if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    } else if (step === 2) {
      // Payment validation
      if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
      if (!formData.nameOnCard.trim()) newErrors.nameOnCard = 'Name on card is required';
      if (!formData.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required';
      if (!formData.cvv.trim()) newErrors.cvv = 'CVV is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const goToNextStep = () => {
    if (validateForm(activeStep)) {
      setActiveStep(activeStep + 1);
    }
  };
  
  const goToPreviousStep = () => {
    setActiveStep(activeStep - 1);
  };
  
  const handlePlaceOrder = () => {
    if (validateForm(activeStep)) {
      // Here you would normally call an API to process the order
      alert('Order placed successfully!');
      navigate('/order-confirmation');
    }
  };
  
  if (isLoading || !cartItems) {
    return <div className="loading">Loading checkout information...</div>;
  }
  
  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="empty-cart-message">
            <h2>Your cart is empty</h2>
            <p>Add some items to your cart before proceeding to checkout.</p>
            <button 
              onClick={() => navigate('/products')}
              className="btn-primary"
            >
              Go Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-header">
          <h1>Checkout</h1>
        </div>
        
        <div className="checkout-content">
     
          
          <div className="checkout-main">
            {activeStep === 1 && (
              <div className="shipping-section">
                <h2>Shipping Information</h2>
                <div className="form-group">
                  <label htmlFor="fullName">Full Name *</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={errors.fullName ? 'error' : ''}
                  />
                  {errors.fullName && <div className="error-message">{errors.fullName}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="addressLine1">Address Line 1 *</label>
                  <input
                    type="text"
                    id="addressLine1"
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleChange}
                    className={errors.addressLine1 ? 'error' : ''}
                  />
                  {errors.addressLine1 && <div className="error-message">{errors.addressLine1}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="addressLine2">Address Line 2</label>
                  <input
                    type="text"
                    id="addressLine2"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">City *</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={errors.city ? 'error' : ''}
                    />
                    {errors.city && <div className="error-message">{errors.city}</div>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="state">State/Province *</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className={errors.state ? 'error' : ''}
                    />
                    {errors.state && <div className="error-message">{errors.state}</div>}
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="zipCode">ZIP/Postal Code *</label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className={errors.zipCode ? 'error' : ''}
                    />
                    {errors.zipCode && <div className="error-message">{errors.zipCode}</div>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="country">Country *</label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={errors.phone ? 'error' : ''}
                  />
                  {errors.phone && <div className="error-message">{errors.phone}</div>}
                </div>
                
                <div className="btn-row">
                  <button className="btn-back" onClick={() => navigate('/cart')}>
                    <FaArrowLeft /> Back to Cart
                  </button>
                  <button className="btn-primary" onClick={goToNextStep}>
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}
            
            {activeStep === 2 && (
              <div className="payment-section">
                <h2>Payment Information</h2>
                <div className="secure-transaction-notice">
                  <FaLock /> <span>Secure transaction - Your payment information is protected</span>
                </div>
                
                <div className="form-group">
                  <label htmlFor="cardNumber">Card Number *</label>
                  <div className="card-input">
                    <FaCreditCard className="card-icon" />
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      placeholder="XXXX XXXX XXXX XXXX"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      className={errors.cardNumber ? 'error' : ''}
                    />
                  </div>
                  {errors.cardNumber && <div className="error-message">{errors.cardNumber}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="nameOnCard">Name on Card *</label>
                  <input
                    type="text"
                    id="nameOnCard"
                    name="nameOnCard"
                    value={formData.nameOnCard}
                    onChange={handleChange}
                    className={errors.nameOnCard ? 'error' : ''}
                  />
                  {errors.nameOnCard && <div className="error-message">{errors.nameOnCard}</div>}
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="expiryDate">Expiry Date (MM/YY) *</label>
                    <input
                      type="text"
                      id="expiryDate"
                      name="expiryDate"
                      placeholder="MM/YY"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      className={errors.expiryDate ? 'error' : ''}
                    />
                    {errors.expiryDate && <div className="error-message">{errors.expiryDate}</div>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="cvv">Security Code (CVV) *</label>
                    <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      placeholder="XXX"
                      value={formData.cvv}
                      onChange={handleChange}
                      className={errors.cvv ? 'error' : ''}
                    />
                    {errors.cvv && <div className="error-message">{errors.cvv}</div>}
                  </div>
                </div>
                
                <div className="form-group checkbox">
                  <input
                    type="checkbox"
                    id="saveCard"
                    name="saveCard"
                    checked={formData.saveCard}
                    onChange={handleChange}
                  />
                  <label htmlFor="saveCard">Save this card for future purchases</label>
                </div>
                
                <div className="btn-row">
                  <button className="btn-back" onClick={goToPreviousStep}>
                    <FaArrowLeft /> Back to Shipping
                  </button>
                  <button className="btn-primary" onClick={goToNextStep}>
                    Continue to Review
                  </button>
                </div>
              </div>
            )}
            
            {activeStep === 3 && (
              <div className="review-section">
                <h2>Review Your Order</h2>
                
                <div className="review-block">
                  <h3>Shipping Address</h3>
                  <div className="review-content">
                    <p>{formData.fullName}</p>
                    <p>{formData.addressLine1}</p>
                    {formData.addressLine2 && <p>{formData.addressLine2}</p>}
                    <p>{formData.city}, {formData.state} {formData.zipCode}</p>
                    <p>{formData.country}</p>
                    <p>{formData.phone}</p>
                  </div>
                  <button className="btn-edit" onClick={() => setActiveStep(1)}>Edit</button>
                </div>
                
                <div className="review-block">
                  <h3>Payment Method</h3>
                  <div className="review-content">
                    <p><FaCreditCard /> Card ending in {formData.cardNumber.slice(-4)}</p>
                    <p>Name: {formData.nameOnCard}</p>
                    <p>Expiry: {formData.expiryDate}</p>
                  </div>
                  <button className="btn-edit" onClick={() => setActiveStep(2)}>Edit</button>
                </div>
                
                <div className="review-items">
                  <h3>Order Items</h3>
                  {cartItems.map(item => (
                    <div className="review-item" key={item.id}>
                      <div className="item-img">
                        <img 
                          src={(item.product?.imageUrl) || 'https://images.unsplash.com/photo-1599709702874-a8ac2e25c538?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8RWxlY3Ryb25pY3N8ZW58MHx8MHx8fDA%3D'} 
                          alt={(item.product?.name) || 'Product'} 
                        />
                      </div>
                      <div className="item-details">
                        <div className="item-name">{(item.product?.name) || 'Unknown Product'}</div>
                        <div className="item-qty">Qty: {item.quantity}</div>
                      </div>
                      <div className="item-price">
                        ${(item.product?.price ? parseFloat(item.product.price) * item.quantity : 0).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="btn-row">
                  <button className="btn-back" onClick={goToPreviousStep}>
                    <FaArrowLeft /> Back to Payment
                  </button>
                  <button className="btn-primary place-order" onClick={handlePlaceOrder}>
                    Place Your Order
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="order-summary">
            <div className="summary-header">
              <h2>Order Summary</h2>
            </div>
            
            <div className="summary-body">
              <div className="summary-row">
                <span>Items ({cartItems.length}):</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="summary-row">
                <span>Shipping & handling:</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              
              <div className="summary-row">
                <span>Estimated tax:</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              
              <div className="summary-divider"></div>
              
              <div className="summary-row total">
                <span>Order total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              
              {activeStep === 3 && (
                <button 
                  className="btn-primary place-order-sm" 
                  onClick={handlePlaceOrder}
                >
                  Place Your Order
                </button>
              )}
              
              <div className="secure-transaction-notice">
                <FaLock /> <span>Secure transaction</span>
              </div>
              
              <div className="shipping-note">
                <FaShippingFast /> <span>Free delivery on orders over $50</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage; 