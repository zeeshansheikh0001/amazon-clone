import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderDetails } from '../redux/slices/orderSlice';
import '../assets/css/OrderDetailPage.css';

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { order, isLoading, isError } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.auth);
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (id) {
      dispatch(getOrderDetails(id));
    }
  }, [id, dispatch, navigate, user]);
  
  const getStatusClass = (status) => {
    switch (status) {
      case 'delivered':
        return 'status-delivered';
      case 'shipped':
        return 'status-shipped';
      case 'processing':
        return 'status-processing';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-pending';
    }
  };
  
  if (isLoading) {
    return <div className="loading">Loading order details...</div>;
  }
  
  if (isError || !order) {
    return <div className="error">Error loading order details. Please try again later.</div>;
  }
  
  return (
    <div className="order-detail-page">
      <div className="container">
        <div className="order-header">
          <h1>Order #{order.id}</h1>
          <div className="order-status">
            <span className={`status-badge ${getStatusClass(order.status)}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
        </div>
        
        <div className="order-date">
          Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
        </div>
        
        <div className="order-container">
          <div className="order-details">
            <div className="detail-section">
              <h3>Shipping Address</h3>
              <p>{order.shippingAddress}</p>
            </div>
            
            <div className="detail-section">
              <h3>Payment Method</h3>
              <p>{order.paymentMethod === 'cashOnDelivery' ? 'Cash on Delivery' : order.paymentMethod}</p>
              <p className="payment-status">
                Payment Status: {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
              </p>
            </div>
          </div>
          
          <div className="order-summary">
            <h3>Order Summary</h3>
            
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${order.totalAmount.toFixed(2)}</span>
            </div>
            
            <div className="summary-row">
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            
            <div className="summary-row total">
              <span>Total:</span>
              <span>${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <div className="order-items">
          <h2>Order Items</h2>
          
          <table className="items-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items && order.items.map((item) => (
                <tr key={item.id} className="order-item">
                  <td className="item-info">
                    <div className="item-image">
                      <img 
                        src={item.product?.imageUrl || 'https://via.placeholder.com/80'} 
                        alt={item.product?.name || 'Product'} 
                      />
                    </div>
                    <div className="item-name">
                      <h4>{item.product?.name || 'Product'}</h4>
                    </div>
                  </td>
                  <td className="item-price">${item.price.toFixed(2)}</td>
                  <td className="item-quantity">{item.quantity}</td>
                  <td className="item-total">${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="order-actions">
          <button 
            onClick={() => navigate('/orders')}
            className="btn btn-outline"
          >
            Back to My Orders
          </button>
          
          {order.status === 'pending' && (
            <button className="btn btn-danger">
              Cancel Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage; 