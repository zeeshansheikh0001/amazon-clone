import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getFeaturedProducts } from '../redux/slices/productSlice';
import ProductCard from '../components/ProductCard';
import '../assets/css/HomePage.css';

const HomePage = () => {
  const dispatch = useDispatch();
  const { featuredProducts, isLoading } = useSelector((state) => state.product);
  const [currentPage, setCurrentPage] = useState(0);
  
  useEffect(() => {
    dispatch(getFeaturedProducts());
  }, [dispatch]);
  
  // Function to handle carousel scrolling
  const handleScrollLeft = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const handleScrollRight = () => {
    const maxPage = Math.ceil(featuredProducts.length / 5) - 1;
    if (currentPage < maxPage) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  // Get current items to display
  const productsPerPage = 5;
  const visibleProducts = featuredProducts.slice(
    currentPage * productsPerPage,
    (currentPage + 1) * productsPerPage
  );
  
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Welcome to Our E-Commerce Store</h1>
            <p>Discover amazing products at affordable prices</p>
            <Link to="/products" className="btn-primary">Shop Now</Link>
          </div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="featured-products">
        <div className="container">
          <div className="featured-header">
            <h2 className="section-title">Featured Products</h2>
            <Link to="/products" className="view-all-link">See more</Link>
          </div>
          
          {isLoading ? (
            <div className="loading">Loading featured products...</div>
          ) : featuredProducts.length > 0 ? (
            <div className="products-carousel">
              <div className="products-grid">
                {visibleProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              {featuredProducts.length > productsPerPage && (
                <div className="scroll-controls">
                  <button 
                    className="scroll-btn"
                    onClick={handleScrollLeft}
                    disabled={currentPage === 0}
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <button 
                    className="scroll-btn"
                    onClick={handleScrollRight}
                    disabled={currentPage >= Math.ceil(featuredProducts.length / productsPerPage) - 1}
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="no-products">No featured products available at the moment.</div>
          )}
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="categories">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          
          <div className="category-grid">
            <div className="category-card">
              <h3 className="category-title">Electronics</h3>
              <div className="category-content">
                <div className="category-item">
                  <div className="category-image-wrapper">
                    <img 
                      src="https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGVhZHBob25lc3xlbnwwfHwwfHx8MA%3D%3D" 
                      alt="Headphones" 
                      className="category-image"
                    />
                  </div>
                  <span className="category-name">Headphones</span>
                </div>
                <div className="category-item">
                  <div className="category-image-wrapper">
                    <img 
                      src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHNtYXJ0d2F0Y2h8ZW58MHx8MHx8fDA%3D" 
                      alt="Smartwatches" 
                      className="category-image"
                    />
                  </div>
                  <span className="category-name">Smartwatches</span>
                </div>
                <div className="category-item">
                  <div className="category-image-wrapper">
                    <img 
                      src="https://images.unsplash.com/photo-1544866092-1677b00ecf27?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8c21hcnRwaG9uZXxlbnwwfHwwfHx8MA%3D%3D" 
                      alt="Smartphones" 
                      className="category-image"
                    />
                  </div>
                  <span className="category-name">Smartphones</span>
                </div>
                <div className="category-item">
                  <div className="category-image-wrapper">
                    <img 
                      src="https://images.unsplash.com/photo-1527698266440-12104e498b76?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGxhcHRvcHxlbnwwfHwwfHx8MA%3D%3D" 
                      alt="Laptops" 
                      className="category-image"
                    />
                  </div>
                  <span className="category-name">Laptops</span>
                </div>
              </div>
              <Link to="/products?category=electronics" className="category-link">Shop all Electronics</Link>
            </div>
            
            <div className="category-card">
              <h3 className="category-title">Clothing</h3>
              <div className="category-content">
                <div className="category-item">
                  <div className="category-image-wrapper">
                    <img 
                      src="https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dHNoaXJ0fGVufDB8fDB8fHww" 
                      alt="T-shirts" 
                      className="category-image"
                    />
                  </div>
                  <span className="category-name">T-shirts</span>
                </div>
                <div className="category-item">
                  <div className="category-image-wrapper">
                    <img 
                      src="https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8amVhbnN8ZW58MHx8MHx8fDA%3D" 
                      alt="Jeans" 
                      className="category-image"
                    />
                  </div>
                  <span className="category-name">Jeans</span>
                </div>
                <div className="category-item">
                  <div className="category-image-wrapper">
                    <img 
                      src="https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8c2hvZXN8ZW58MHx8MHx8fDA%3D" 
                      alt="Shoes" 
                      className="category-image"
                    />
                  </div>
                  <span className="category-name">Shoes</span>
                </div>
                <div className="category-item">
                  <div className="category-image-wrapper">
                    <img 
                      src="https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGphY2tldHN8ZW58MHx8MHx8fDA%3D" 
                      alt="Jackets" 
                      className="category-image"
                    />
                  </div>
                  <span className="category-name">Jackets</span>
                </div>
              </div>
              <Link to="/products?category=clothing" className="category-link">Shop all Clothing</Link>
            </div>
            
            <div className="category-card">
              <h3 className="category-title">Home & Kitchen</h3>
              <div className="category-content">
                <div className="category-item">
                  <div className="category-image-wrapper">
                    <img 
                      src="https://images.unsplash.com/photo-1565731761817-6bde756d8d9f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Zmxvb3IlMjBsYW1wfGVufDB8fDB8fHww" 
                      alt="Lighting" 
                      className="category-image"
                    />
                  </div>
                  <span className="category-name">Lighting</span>
                </div>
                <div className="category-item">
                  <div className="category-image-wrapper">
                    <img 
                      src="https://images.unsplash.com/photo-1580821810660-5486b8e980a6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8a2l0Y2hlbiUyMGFwcGxpYW5jZXN8ZW58MHx8MHx8fDA%3D" 
                      alt="Appliances" 
                      className="category-image"
                    />
                  </div>
                  <span className="category-name">Appliances</span>
                </div>
                <div className="category-item">
                  <div className="category-image-wrapper">
                    <img 
                      src="https://images.unsplash.com/photo-1592789705501-f9ae4589c919?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGZ1cm5pdHVyZXxlbnwwfHwwfHx8MA%3D%3D" 
                      alt="Furniture" 
                      className="category-image"
                    />
                  </div>
                  <span className="category-name">Furniture</span>
                </div>
                <div className="category-item">
                  <div className="category-image-wrapper">
                    <img 
                      src="https://images.unsplash.com/photo-1594938328870-9623159c8c99?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGJlZGRpbmd8ZW58MHx8MHx8fDA%3D" 
                      alt="Bedding" 
                      className="category-image"
                    />
                  </div>
                  <span className="category-name">Bedding</span>
                </div>
              </div>
              <Link to="/products?category=home" className="category-link">Shop all Home & Kitchen</Link>
            </div>
            
            <div className="category-card">
              <h3 className="category-title">Books</h3>
              <div className="category-content">
                <div className="category-item">
                  <div className="category-image-wrapper">
                    <img 
                      src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGJvb2tzfGVufDB8fDB8fHww" 
                      alt="Fiction" 
                      className="category-image"
                    />
                  </div>
                  <span className="category-name">Fiction</span>
                </div>
                <div className="category-item">
                  <div className="category-image-wrapper">
                    <img 
                      src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGNvb2tib29rc3xlbnwwfHwwfHx8MA%3D%3D" 
                      alt="Cookbooks" 
                      className="category-image"
                    />
                  </div>
                  <span className="category-name">Cookbooks</span>
                </div>
                <div className="category-item">
                  <div className="category-image-wrapper">
                    <img 
                      src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzV8fGJvb2tzfGVufDB8fDB8fHww" 
                      alt="Self-help" 
                      className="category-image"
                    />
                  </div>
                  <span className="category-name">Self-help</span>
                </div>
                <div className="category-item">
                  <div className="category-image-wrapper">
                    <img 
                      src="https://images.unsplash.com/photo-1588580000645-f39ca9df2b75?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGNoaWxkcmVucyUyMGJvb2t8ZW58MHx8MHx8fDA%3D" 
                      alt="Children's" 
                      className="category-image"
                    />
                  </div>
                  <span className="category-name">Children's</span>
                </div>
              </div>
              <Link to="/products?category=books" className="category-link">Shop all Books</Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Why Choose Us */}
      <section className="why-choose-us">
        <div className="container">
          <h2 className="section-title">Why Shop With Us</h2>
          
          <div className="features-grid">
            <div className="feature">
              <i className="fas fa-shipping-fast"></i>
              <h3>Fast Delivery</h3>
              <p>Get your products delivered to your doorstep quickly</p>
            </div>
            
            <div className="feature">
              <i className="fas fa-undo-alt"></i>
              <h3>Easy Returns</h3>
              <p>Return products easily if you're not satisfied</p>
            </div>
            
            <div className="feature">
              <i className="fas fa-lock"></i>
              <h3>Secure Payment</h3>
              <p>Your payment information is always secure with us</p>
            </div>
            
            <div className="feature">
              <i className="fas fa-headset"></i>
              <h3>24/7 Support</h3>
              <p>Our customer support team is always available to help</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Newsletter */}
      <section className="newsletter">
        <div className="container">
          <h2>Subscribe to Our Newsletter</h2>
          <p>Get the latest updates and offers directly to your inbox</p>
          
          <form className="newsletter-form">
            <input type="email" placeholder="Your email address" required />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default HomePage;