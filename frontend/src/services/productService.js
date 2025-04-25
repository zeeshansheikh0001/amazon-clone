import axios from 'axios';

const API_URL = 'http://localhost:5000/api/products/';

// Get all products with pagination and filtering
const getProducts = async (params = {}) => {
  let queryString = '';
  
  if (params) {
    const queryParams = [];
    
    if (params.page) queryParams.push(`page=${params.page}`);
    if (params.limit) queryParams.push(`limit=${params.limit}`);
    if (params.category) queryParams.push(`category=${params.category}`);
    if (params.search) queryParams.push(`search=${params.search}`);
    if (params.minPrice) queryParams.push(`minPrice=${params.minPrice}`);
    if (params.maxPrice) queryParams.push(`maxPrice=${params.maxPrice}`);
    
    if (queryParams.length > 0) {
      queryString = `?${queryParams.join('&')}`;
    }
  }
  
  const response = await axios.get(API_URL + queryString);
  return response.data;
};

// Get featured products
const getFeaturedProducts = async () => {
  const response = await axios.get(API_URL + 'featured');
  return response.data;
};

// Get product by ID
const getProductById = async (productId) => {
  const response = await axios.get(API_URL + productId);
  return response.data;
};

const productService = {
  getProducts,
  getFeaturedProducts,
  getProductById
};

export default productService; 