import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  return (
    <footer className="footer">
      <div className="back-to-top" onClick={scrollToTop}>
        Back to top
      </div>
      
      <div className="footer-main">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h2>Get to Know Us</h2>
              <ul>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/careers">Careers</Link></li>
                <li><Link to="/press">Press Releases</Link></li>
                <li><Link to="/impact">Social Impact</Link></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h2>Make Money with Us</h2>
              <ul>
                <li><Link to="/sell">Sell products on our site</Link></li>
                <li><Link to="/partner">Become an Affiliate</Link></li>
                <li><Link to="/advertise">Advertise Your Products</Link></li>
                <li><Link to="/publish">Self-Publish</Link></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h2>Customer Service</h2>
              <ul>
                <li><Link to="/help">Help Center</Link></li>
                <li><Link to="/returns">Returns & Replacements</Link></li>
                <li><Link to="/shipping">Shipping Rates & Policies</Link></li>
                <li><Link to="/orders">Track Orders</Link></li>
              </ul>
            </div>
            
            <div className="footer-section contact-form">
              <h2>Let Us Help You</h2>
              <ul>
                <li><Link to="/account">Your Account</Link></li>
                <li><Link to="/orders">Your Orders</Link></li>
                <li><Link to="/shipping">Shipping Rates & Policies</Link></li>
                <li><Link to="/help">Help</Link></li>
              </ul>
              
              <div className="socials">
                <a href="#"><i className="fab fa-facebook-f"></i></a>
                <a href="#"><i className="fab fa-twitter"></i></a>
                <a href="#"><i className="fab fa-instagram"></i></a>
                <a href="#"><i className="fab fa-youtube"></i></a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-logo">
            <Link to="/">
              <span className="logo-text">E-Commerce Store</span>
            </Link>
          </div>
          
          <div className="footer-countries">
            <a href="#">United States</a>
            <a href="#">United Kingdom</a>
            <a href="#">Canada</a>
            <a href="#">Germany</a>
            <a href="#">France</a>
            <a href="#">Japan</a>
            <a href="#">Australia</a>
          </div>
          
          <div className="footer-links">
            <a href="#">Conditions of Use</a>
            <a href="#">Privacy Notice</a>
            <a href="#">Interest-Based Ads</a>
            <a href="#">©{currentYear} E-Commerce Store, Inc.</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 