import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, reset } from '../redux/slices/authSlice';
import { getUserOrders } from '../redux/slices/orderSlice';
import '../assets/css/ProfilePage.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user, isLoading, isSuccess, isError, message } = useSelector((state) => state.auth);
  const { orders, isLoading: ordersLoading } = useSelector((state) => state.order);
  
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    phone: ''
  });
  
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Load user data into form
    setFormData({
      name: user.name || '',
      email: user.email || '',
      password: '',
      confirmPassword: '',
      address: user.address || '',
      phone: user.phone || ''
    });
    
    // Get user orders
    dispatch(getUserOrders());
  }, [user, navigate, dispatch]);
  
  useEffect(() => {
    if (isError) {
      setFormError(message);
      setFormSuccess('');
    }
    
    if (isSuccess) {
      setFormSuccess('Profile updated successfully');
      setFormError('');
    }
    
    dispatch(reset());
  }, [isError, isSuccess, message, dispatch]);
  
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };
  
  const onSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name) {
      setFormError('Name is required');
      return;
    }
    
    if (formData.password && formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    
    // Update profile
    const userData = {
      name: formData.name,
      address: formData.address,
      phone: formData.phone
    };
    
    // Only include password if provided
    if (formData.password) {
      userData.password = formData.password;
    }
    
    dispatch(updateProfile(userData));
  };
  
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
  
  if (!user) {
    return null;
  }
  
  return (
    <div className="profile-page">
      <div className="container">
        <h1>My Account</h1>
        
        <div className="profile-tabs">
          <button 
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button 
            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            My Orders
          </button>
        </div>
        
        <div className="tab-content">
          {activeTab === 'profile' && (
            <div className="profile-content">
              <h2>Personal Information</h2>
              
              {formError && <div className="alert alert-danger">{formError}</div>}
              {formSuccess && <div className="alert alert-success">{formSuccess}</div>}
              
              <form onSubmit={onSubmit} className="profile-form">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={onChange}
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    readOnly
                    disabled
                    className="readonly"
                  />
                  <small>Email cannot be changed</small>
                </div>
                
                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={onChange}
                    placeholder="Enter your address"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={onChange}
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <h3>Change Password</h3>
                <p className="password-info">Leave blank to keep current password</p>
                
                <div className="form-group">
                  <label htmlFor="password">New Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={onChange}
                    placeholder="Enter new password"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={onChange}
                    placeholder="Confirm new password"
                  />
                </div>
                
                <div className="form-actions">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Updating...' : 'Update Profile'}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {activeTab === 'orders' && (
            <div className="orders-content">
              <h2>Order History</h2>
              
              {ordersLoading ? (
                <div className="loading">Loading orders...</div>
              ) : orders && orders.length > 0 ? (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 