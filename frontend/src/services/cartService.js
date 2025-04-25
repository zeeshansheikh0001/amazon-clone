import axios from 'axios';

const API_URL = 'http://localhost:5000/api/cart/';

// Get cart items
const getCartItems = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  
  const response = await axios.get(API_URL, config);
  return response.data;
};

// Add item to cart
const addToCart = async (cartData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  
  const response = await axios.post(API_URL + 'add', cartData, config);
  return response.data;
};

// Update cart item
const updateCartItem = async (cartData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  
  const response = await axios.put(API_URL + 'update', cartData, config);
  return response.data;
};

// Remove from cart
const removeFromCart = async (cartItemId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  
  const response = await axios.delete(API_URL + `remove/${cartItemId}`, config);
  return response.data;
};

// Clear cart
const clearCart = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  
  const response = await axios.delete(API_URL + 'clear', config);
  return response.data;
};

const cartService = {
  getCartItems,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};

export default cartService; 