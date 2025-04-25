import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../redux/slices/cartSlice';
import { FaCheck, FaShippingFast, FaListAlt } from 'react-icons/fa';
import '../assets/css/OrderConfirmationPage.css';

const OrderConfirmationPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Clear the cart when the confirmation page loads
    dispatch(clearCart());
  }, [user, navigate, dispatch]);
  
  // Generate a random order number
  const orderNumber = Math.floor(100000000 + Math.random() * 900000000);
  
  return (
    <div className="confirmation-page">
      <div className="container">
        <div className="confirmation-container">
          <div className="confirmation-header">
            <div className="success-icon">
              <FaCheck />
            </div>
            <h1>Order Confirmed!</h1>
            <p className="order-number">Order #{orderNumber}</p>
          </div>
          
          <div className="confirmation-details">
            <p className="thank-you">
              Thank you for your order! We've received your order and will begin processing it right away.
            </p>
            
            <div className="order-info">
              <div className="info-item">
                <FaShippingFast className="info-icon" />
                <div className="info-content">
                  <h3>Shipping Information</h3>
                  <p>You will receive a shipping confirmation email with tracking details once your order ships.</p>
                </div>
              </div>
              
              <div className="info-item">
                <FaListAlt className="info-icon" />
                <div className="info-content">
                  <h3>Order Details</h3>
                  <p>You can view your order details in the Orders section of your account.</p>
                </div>
              </div>
            </div>
            
            <div className="next-steps">
              <h3>What's Next?</h3>
              <ul>
                <li>You will receive an order confirmation email shortly.</li>
                <li>Your items will be prepared for shipping.</li>
                <li>You'll receive tracking information when your order ships.</li>
              </ul>
            </div>
          </div>
          
          <div className="confirmation-actions">
            <Link to="/orders" className="btn-primary">
              View My Orders
            </Link>
            <Link to="/products" className="btn-secondary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage; 