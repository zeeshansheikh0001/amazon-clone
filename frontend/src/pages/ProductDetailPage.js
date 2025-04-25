import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProductById } from '../redux/slices/productSlice';
import { addToCart, getCartItems } from '../redux/slices/cartSlice';
import '../assets/css/ProductDetailPage.css';
import { FaShippingFast, FaStar, FaStarHalfAlt, FaLock, FaSearch, FaArrowLeft, FaArrowRight, FaCartPlus, FaBolt } from 'react-icons/fa';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { product, isLoading, isError } = useSelector((state) => state.product);
  const { user } = useSelector((state) => state.auth);
  
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  
  useEffect(() => {
    if (id) {
      dispatch(getProductById(id));
    }
    
    // Cleanup function
    return () => {
      // Reset product when component unmounts
    };
  }, [dispatch, id]);
  
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= (product?.stock || 10)) {
      setQuantity(value);
    }
  };
  
  const incrementQuantity = () => {
    if (quantity < (product?.stock || 10)) {
      setQuantity(quantity + 1);
    }
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    dispatch(addToCart({
      productId: product.id,
      quantity
    })).then(() => {
      // Show feedback message
      setAddedToCart(true);
      
      // Fetch updated cart data
      dispatch(getCartItems());
      
      // Clear the message after 3 seconds
      setTimeout(() => {
        setAddedToCart(false);
      }, 3000);
    });
  };
  
  const handleBuyNow = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    dispatch(addToCart({
      productId: product.id,
      quantity
    })).then(() => {
      navigate('/cart');
    });
  };
  
  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`star-${i}`} />);
    }
    
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half-star" />);
    }
    
    return stars;
  };
  
  const formatPrice = (price) => {
    if (!price) return "$0.00";
    // Convert price to number if it's not already
    const numPrice = typeof price === 'number' ? price : parseFloat(price);
    // Check if conversion was successful
    if (isNaN(numPrice)) return "$0.00";
    
    const [whole, fraction] = numPrice.toFixed(2).split('.');
    return (
      <>
        <span className="price-symbol">$</span>
        <span className="price-whole">{whole}</span>
        <span className="price-fraction">{fraction}</span>
      </>
    );
  };
  
  // Generate mock product images
  const getProductImages = () => {
    const mainImage = product.imageUrl || 'https://via.placeholder.com/500';
    // Create 5 thumbnail variations (in a real app, you'd have actual different images)
    return [
      mainImage,
      mainImage.replace('500', '501'),
      mainImage.replace('500', '502'),
      mainImage.replace('500', '503'),
      mainImage.replace('500', '504'),
    ];
  };

  const nextImage = () => {
    const productImages = getProductImages();
    setSelectedImage((prev) => (prev === productImages.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    const productImages = getProductImages();
    setSelectedImage((prev) => (prev === 0 ? productImages.length - 1 : prev - 1));
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };
  
  if (isLoading) {
    return <div className="loading">Loading product details...</div>;
  }
  
  if (isError || !product) {
    return <div className="error">Error loading product. Please try again later.</div>;
  }
  
  const productImages = getProductImages();
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
  
  return (
    <div className="product-detail-page">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/">Home</Link> &gt; <Link to="/products">Products</Link> &gt; <Link to={`/products?category=${product.category}`}>{product.category}</Link> &gt; {product.name}
        </div>
        
        <div className="product-detail">
          <div className="product-gallery">
            <div className="thumbnails">
              {productImages.map((img, index) => (
                <img 
                  key={index}
                  src={img}
                  alt={`${product.name} - view ${index + 1}`}
                  className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                />
              ))}
            </div>
            
            <div className={`main-image ${isZoomed ? 'zoomed' : ''}`}>
              <div className="carousel-controls">
                <button className="carousel-control prev" onClick={prevImage}>
                  <FaArrowLeft />
                </button>
                <button className="carousel-control next" onClick={nextImage}>
                  <FaArrowRight />
                </button>
              </div>
              
              <img 
                src={productImages[selectedImage]} 
                alt={product.name}
                className={isZoomed ? 'zoomed-image' : ''}
                onClick={toggleZoom}
              />
              
              <div className="image-zoom" onClick={toggleZoom}>
                <FaSearch />
              </div>
              
              <div className="image-indicator">
                {productImages.map((_, index) => (
                  <span 
                    key={index} 
                    className={`indicator-dot ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  ></span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="product-info">
            <h1 className="product-name">{product.name}</h1>
            
            <div className="product-brand">
              <a href="#">Brand: {product.brand || 'Generic'}</a>
            </div>
            
            <div className="product-rating">
              <div className="stars">
                {renderRatingStars(product.rating || 4.5)}
              </div>
              <span className="rating-count">{product.reviews || 124} ratings</span>
            </div>
            
            <div className="product-divider"></div>
            
            <div className="product-price-container">
              <div className="price-label">Price:</div>
              <div className="product-price">
                {formatPrice(product.price)}
                {product.originalPrice && (
                  <>
                    <span className="original-price">${product.originalPrice.toFixed(2)}</span>
                    <span className="discount-percent">Save {discount}%</span>
                  </>
                )}
              </div>
            </div>
            
            <div className="product-delivery">
              <FaShippingFast /> <span className="delivery-highlight">FREE delivery</span> tomorrow if you order within 6 hrs 23 mins
            </div>
            
            <div className={`product-stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
              {product.stock > 0 ? `In Stock - ${product.stock} available` : 'Out of Stock'}
            </div>
            
            <div className="product-divider"></div>
            
            <div className="product-description">
              <h3>About this item</h3>
              <p>{product.description}</p>
            </div>
            
            {product.features && (
              <div className="product-features">
                <ul>
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {product.stock > 0 && (
              <>
                <div className="quantity-controls">
                  <span className="label">Quantity:</span>
                  <div className="quantity-input">
                    <button 
                      onClick={decrementQuantity}
                      className="quantity-btn"
                      type="button"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={handleQuantityChange}
                      min="1"
                      max={product.stock}
                    />
                    <button 
                      onClick={incrementQuantity}
                      className="quantity-btn"
                      type="button"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div className="product-actions">
                  <button 
                    className="add-to-cart-btn"
                    onClick={handleAddToCart}
                    disabled={product.countInStock === 0}
                  >
                    <FaCartPlus /> Add to Cart
                  </button>
                  
                  {addedToCart && (
                    <div className="cart-success-message">
                      Item added to your cart successfully!
                    </div>
                  )}
                  
                  <button 
                    className="buy-now-btn"
                    onClick={handleBuyNow}
                    disabled={product.countInStock === 0}
                  >
                    <FaBolt /> Buy Now
                  </button>
                  
                  <button 
                    onClick={() => navigate('/products')}
                    className="back-btn"
                  >
                    Back to Products
                  </button>
                </div>
                
                <div className="secure-transaction">
                  <FaLock /> Secure transaction
                </div>
              </>
            )}
            
            {product.stock <= 0 && (
              <div className="product-actions">
                <button className="add-to-cart-btn" disabled>Out of Stock</button>
                <button 
                  onClick={() => navigate('/products')}
                  className="back-btn"
                >
                  Back to Products
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isZoomed && (
        <div className="image-modal" onClick={toggleZoom}>
          <div className="modal-content">
            <img src={productImages[selectedImage]} alt={product.name} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage; 