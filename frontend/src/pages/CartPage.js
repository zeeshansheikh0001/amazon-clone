import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCartItems, updateCartItem, removeFromCart, clearCart, reset } from '../redux/slices/cartSlice';
import '../assets/css/CartPage.css';
import { FaTrash, FaLock, FaTag, FaShippingFast, FaCheck } from 'react-icons/fa';

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { cartItems, totalAmount, isLoading, isError, isSuccess, message } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  
  const [quantities, setQuantities] = useState({});
  const [updateMessage, setUpdateMessage] = useState({ show: false, id: null });
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Always fetch the latest cart data when the component mounts
    dispatch(getCartItems());
    
    // Cleanup on unmount
    return () => {
      // Reset any error states if needed
      dispatch(reset());
    };
  }, [dispatch, navigate, user]);

  // Show success message when cart is updated successfully
  useEffect(() => {
    if (isSuccess && updateMessage.show) {
      // Hide the message after 2 seconds
      const timer = setTimeout(() => {
        setUpdateMessage({ show: false, id: null });
        dispatch(reset());
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isSuccess, updateMessage, dispatch]);
  
  useEffect(() => {
    // Initialize quantities state from cart items
    const initialQuantities = {};
    if (cartItems && cartItems.length > 0) {
      cartItems.forEach(item => {
        initialQuantities[item.id] = item.quantity;
      });
    }
    setQuantities(initialQuantities);
  }, [cartItems]);
  
  const handleQuantityChange = (itemId, quantity) => {
    if (quantity > 0 && quantity <= 10) { // Assuming max quantity is 10
      setQuantities({
        ...quantities,
        [itemId]: quantity
      });
    }
  };
  
  const handleQuantityUpdate = (itemId, newQuantity) => {
    // Update the local state
    handleQuantityChange(itemId, newQuantity);
    
    // Only update cart on the server if the quantity has changed
    const currentItem = cartItems.find(item => item.id === itemId);
    if (currentItem && newQuantity !== currentItem.quantity) {
      dispatch(updateCartItem({
        cartItemId: itemId,
        quantity: newQuantity
      }));
      
      // Show success message
      setUpdateMessage({ show: true, id: itemId });
    }
  };
  
  const handleRemoveItem = (itemId) => {
    dispatch(removeFromCart(itemId));
  };
  
  const handleClearCart = () => {
    dispatch(clearCart());
  };
  
  const handleCheckout = () => {
    navigate('/checkout');
  };
  
  if (isLoading) {
    return <div className="loading">Loading cart...</div>;
  }
  
  if (isError) {
    return <div className="error">Error loading cart. Please try again later.</div>;
  }
  
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="cart-empty">
            <div className="cart-empty-icon">
              <i className="fas fa-shopping-cart"></i>
            </div>
            <h2>Your Amazon Cart is empty</h2>
            <p className="cart-empty-text">Shop today's deals</p>
            <div className="cart-empty-actions">
              {user ? (
                <button 
                  onClick={() => navigate('/products')}
                  className="btn-primary"
                >
                  Continue Shopping
                </button>
              ) : (
                <>
                  <button 
                    onClick={() => navigate('/login')}
                    className="btn-primary"
                  >
                    Sign in to your account
                  </button>
                  <button 
                    onClick={() => navigate('/register')}
                    className="btn-secondary"
                  >
                    Sign up now
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Calculate total amount if it's not provided from the backend
  const calculatedTotal = cartItems.reduce((sum, item) => {
    if (!item.product) return sum;
    // Convert price to number to avoid issues
    const price = item.product.price ? parseFloat(item.product.price) : 0;
    return sum + (price * (quantities[item.id] || item.quantity));
  }, 0);

  // Use calculated total if totalAmount is not provided
  const displayTotal = totalAmount || calculatedTotal;

  // Count total items in cart
  const itemCount = cartItems.reduce((count, item) => {
    return count + (quantities[item.id] || item.quantity);
  }, 0);
  
  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-container">
          <div className="cart-left">
            <div className="cart-header">
              <h1>Shopping Cart</h1>
              <button 
                className="deselect-all-btn"
                onClick={handleClearCart}
              >
                Deselect all items
              </button>
            </div>
            
            <div className="price-header">Price</div>
            
            <div className="cart-items-container">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="item-image">
                    <img 
                      src={(item.product?.imageUrl) || 'https://images.unsplash.com/photo-1599709702874-a8ac2e25c538?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8RWxlY3Ryb25pY3N8ZW58MHx8MHx8fDA%3D'} 
                      alt={(item.product?.name) || 'Product'} 
                    />
                  </div>
                  
                  <div className="item-details">
                    <div className="item-name">
                      <Link to={`/products/${item.product?.id}`}>
                        {(item.product?.name) || 'Unknown Product'}
                      </Link>
                    </div>
                    
                    <div className="stock-status">
                      {item.product?.stock > 0 ? (
                        <span className="in-stock">In Stock</span>
                      ) : (
                        <span className="out-of-stock">Out of Stock</span>
                      )}
                    </div>
                    
                    <div className="item-shipping">
                      <FaShippingFast /> 
                      <span className="shipping-text">
                        <span className="free-shipping">FREE Shipping</span> by E-Commerce
                      </span>
                    </div>
                    
                    <div className="item-actions">
                      <div className="quantity-selector">
                        <select
                          value={quantities[item.id] || item.quantity}
                          onChange={(e) => {
                            const newQuantity = parseInt(e.target.value);
                            handleQuantityUpdate(item.id, newQuantity);
                          }}
                        >
                          {[...Array(10).keys()].map(i => (
                            <option key={i+1} value={i+1}>Qty: {i+1}</option>
                          ))}
                        </select>
                        {updateMessage.show && updateMessage.id === item.id && (
                          <div className="update-success">
                            <FaCheck /> Updated
                          </div>
                        )}
                      </div>
                      
                      <span className="action-divider">|</span>
                      
                      <button 
                        onClick={() => handleRemoveItem(item.id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                      
                      <span className="action-divider">|</span>
                      
                      <button className="save-btn">Save for later</button>
                    </div>
                  </div>
                  
                  <div className="item-price">
                    ${item.product?.price ? parseFloat(item.product.price).toFixed(2) : '0.00'}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="subtotal-bottom">
              Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'}): <span className="subtotal-amount">${displayTotal.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="cart-right">
            <div className="cart-summary">
              <div className="secure-transaction">
                <FaLock /> <span>Secure transaction</span>
              </div>
              
              <div className="subtotal">
                Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'}): <span className="subtotal-amount">${displayTotal.toFixed(2)}</span>
              </div>
              
              <div className="gift-option">
                <input type="checkbox" id="gift" name="gift" />
                <label htmlFor="gift">This order contains a gift</label>
              </div>
              
              <button 
                onClick={handleCheckout}
                className="checkout-btn"
                disabled={cartItems.length === 0}
              >
                Proceed to checkout
              </button>
              
              <div className="coupon-section">
                <div className="coupon-header">
                  <FaTag />
                  <span>Add a coupon</span>
                </div>
                <input type="text" placeholder="Enter code" className="coupon-input" />
                <button className="apply-coupon-btn">Apply</button>
              </div>
            </div>
            
            <div className="saved-items">
              <h3>Your Items</h3>
              <div className="saved-items-links">
                <a href="#">Saved for later (0)</a>
                <a href="#">Buy it again</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage; 