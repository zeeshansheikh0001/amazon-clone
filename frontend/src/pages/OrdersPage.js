import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserOrders } from '../redux/slices/orderSlice';
import '../assets/css/OrdersPage.css';

const OrdersPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { orders, isLoading, isError } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.auth);
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    dispatch(getUserOrders());
  }, [dispatch, navigate, user]);
  
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
    return <div className="loading">Loading orders...</div>;
  }
  
  if (isError) {
    return <div className="error">Error loading orders. Please try again later.</div>;
  }
  
  return (
    <div className="orders-page">
      <div className="container">
        <h1>My Orders</h1>
        
        {orders && orders.length > 0 ? (
          <div className="orders-list">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="order-item">
                    <td className="order-id">#{order.id}</td>
                    <td className="order-date">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="order-total">${order.totalAmount.toFixed(2)}</td>
                    <td className="order-status">
                      <span className={`status-badge ${getStatusClass(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="order-actions">
                      <button 
                        onClick={() => navigate(`/orders/${order.id}`)}
                        className="btn btn-outline btn-sm"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-orders">
            <h2>No Orders Found</h2>
            <p>You haven't placed any orders yet.</p>
            <button 
              onClick={() => navigate('/products')}
              className="btn btn-primary"
            >
              Start Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage; 