import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { FaSearch, FaShoppingCart, FaUserCircle, FaMapMarkerAlt, FaBars } from 'react-icons/fa';
import '../assets/css/Header.css';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryDropdown, setCategoryDropdown] = useState(false);
  
  const onLogout = () => {
    dispatch(logout());
    navigate('/');
  };
  
  const cartItemCount = cartItems?.reduce((total, item) => total + item.quantity, 0) || 0;
  
  const categories = [
    'Electronics', 'Clothing', 'Home & Kitchen', 'Books', 'Beauty',
    'Toys & Games', 'Sports & Outdoors', 'Automotive', 'Grocery'
  ];
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${searchTerm.trim()}`);
    }
  };
  
  return (
    <header className="header">
      <div className="header-top">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <Link to="/">
                <span className="logo-text">e<span className="logo-highlight">Commerce</span></span>
              </Link>
            </div>
            
            <div className="location-selector">
              <Link to="/profile" className="location-link">
                <div className="icon">
                  <FaMapMarkerAlt />
                </div>
                <div className="location-text">
                  <span className="deliver-to">Deliver to</span>
                  <span className="location">{user ? user.name : 'Sign in for location'}</span>
                </div>
              </Link>
            </div>
            
            <div className="search-bar">
              <form onSubmit={handleSearch}>
                <div className="category-dropdown">
                  <button 
                    type="button" 
                    className="category-toggle"
                    onClick={() => setCategoryDropdown(!categoryDropdown)}
                  >
                    All
                  </button>
                  {categoryDropdown && (
                    <div className="dropdown-menu category-menu">
                      {categories.map((category) => (
                        <Link 
                          key={category} 
                          to={`/products?category=${category}`}
                          className="dropdown-item"
                          onClick={() => setCategoryDropdown(false)}
                        >
                          {category}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="search-button">
                  <FaSearch />
                </button>
              </form>
            </div>
            
            <div className="header-actions">
              <div className="account-dropdown">
                <button className="dropdown-toggle">
                  <div className="dropdown-label">
                    <div className="small-text">Hello, {user ? user.name : 'Sign in'}</div>
                    <div className="bold-text">Account & Lists</div>
                  </div>
                </button>
                
                <div className="dropdown-menu account-menu">
                  {!user ? (
                    <div className="sign-in-section">
                      <Link to="/login" className="btn-sign-in">Sign in</Link>
                      <div className="new-customer">
                        New customer? <Link to="/register">Start here</Link>
                      </div>
                    </div>
                  ) : (
                    <div className="account-section">
                      <div className="account-heading">Your Account</div>
                      <Link to="/profile" className="dropdown-item">Account</Link>
                      <Link to="/orders" className="dropdown-item">Orders</Link>
                      <Link to="/profile" className="dropdown-item">Wish List</Link>
                      <Link to="/profile" className="dropdown-item">Recommendations</Link>
                      <button onClick={onLogout} className="dropdown-item logout">Sign Out</button>
                    </div>
                  )}
                </div>
              </div>
              
              <Link to="/orders" className="returns-orders">
                <div className="small-text">Returns</div>
                <div className="bold-text">& Orders</div>
              </Link>
              
              <Link to="/cart" className="cart-link">
                <div className="cart-icon">
                  <FaShoppingCart />
                  <span className="cart-count">{cartItemCount}</span>
                </div>
                <div className="bold-text">Cart</div>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="header-bottom">
        <div className="container">
          <button className="all-menu">
            <FaBars /> All
          </button>
          
          <nav className="nav">
            <ul className="nav-list">
              {categories.slice(0, 6).map((category) => (
                <li key={category} className="nav-item">
                  <Link to={`/products?category=${category}`} className="nav-link">
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="deals-link">
            <Link to="/products?deals=true">Today's Deals</Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 