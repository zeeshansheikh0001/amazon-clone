import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import '../assets/css/ProductCard.css';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  const handleAddToCart = () => {
    if (!user) {
      // Redirect to login if not logged in
      window.location.href = '/login';
      return;
    }
    
    dispatch(addToCart({
      productId: product.id,
      quantity: 1
    }));
  };

  // Format price into whole and decimal parts
  const formatPrice = (price) => {
    const priceStr = Number(price).toFixed(2);
    const [whole, fraction] = priceStr.split('.');
    return { whole, fraction };
  };

  const { whole, fraction } = formatPrice(product.price);
  
  // Determine rating (for demo, using a random rating if not available)
  const rating = product.rating || Math.floor(Math.random() * 5) + 1;
  const reviewCount = product.reviewCount || Math.floor(Math.random() * 100) + 5;
  
  // Generate stars based on rating
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="fas fa-star"></i>);
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt"></i>);
    }
    
    // Add empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star"></i>);
    }
    
    return stars;
  };
  
  return (
    <div className="product-card">
      <div className="product-image">
        <Link to={`/products/${product.id}`}>
          <img src={product.imageUrl || 'https://via.placeholder.com/300'} alt={product.name} />
        </Link>
        {product.featured && <span className="badge featured">Featured</span>}
        {product.stock <= 0 && <span className="badge out-of-stock">Out of Stock</span>}
        {product.discount && <span className="badge discount">{product.discount}% OFF</span>}
      </div>
      
      <div className="product-info">
        <h3 className="product-name">
          <Link to={`/products/${product.id}`}>{product.name}</Link>
        </h3>
        
        <div className="product-rating">
          <div className="stars">{renderStars(rating)}</div>
          <span className="rating-count">{reviewCount}</span>
        </div>
        
        <div className="product-price">
          <span className="price-symbol">$</span>
          <span className="price-whole">{whole}</span>
          <span className="price-fraction">{fraction}</span>
          {product.originalPrice && (
            <span className="original-price">${Number(product.originalPrice).toFixed(2)}</span>
          )}
        </div>
        
        <div className="product-category">{product.category}</div>
        
        {product.isPrime && (
          <img 
            src="https://m.media-amazon.com/images/G/01/prime/marketing/slashPrime/amazon-prime-delivery-checkmark._CB659998231_.png" 
            alt="Prime" 
            className="prime-icon"
          />
        )}
      </div>
      
      <div className="product-actions">
        <button 
          className="add-to-cart"
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
        >
          {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
        <Link to={`/products/${product.id}`} className="view-details">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard; 