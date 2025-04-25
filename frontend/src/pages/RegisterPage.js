import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, reset } from '../redux/slices/authSlice';
import '../assets/css/AuthForms.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    phone: ''
  });
  
  const [formError, setFormError] = useState('');
  
  const { name, email, password, confirmPassword, address, phone } = formData;
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.auth
  );
  
  useEffect(() => {
    if (isError) {
      setFormError(message);
    }
    
    // Redirect if registered successfully
    if (isSuccess || user) {
      navigate('/');
    }
    
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);
  
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };
  
  const onSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setFormError('Please fill in all required fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    
    const userData = {
      name,
      email,
      password,
      address,
      phone
    };
    
    dispatch(register(userData));
  };
  
  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-container">
          <div className="auth-form-container">
            <h1>Create Account</h1>
            <p>Join us and enjoy the shopping experience</p>
            
            {formError && <div className="alert alert-danger">{formError}</div>}
            
            <form onSubmit={onSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="name">Full Name*</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={onChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address*</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={onChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Password*</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={onChange}
                  placeholder="Enter your password"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password*</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={onChange}
                  placeholder="Confirm password"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="address">Address (Optional)</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={address}
                  onChange={onChange}
                  placeholder="Enter your address"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone Number (Optional)</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={phone}
                  onChange={onChange}
                  placeholder="Enter your phone number"
                />
              </div>
              
              <div className="form-group">
                <button type="submit" className="btn btn-primary btn-block" disabled={isLoading}>
                  {isLoading ? 'Registering...' : 'Register'}
                </button>
              </div>
            </form>
            
            <div className="auth-footer">
              <p>
                Already have an account? <Link to="/login">Login</Link>
              </p>
            </div>
          </div>
          
          <div className="auth-image">
            <img src="https://via.placeholder.com/500" alt="Register" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage; 