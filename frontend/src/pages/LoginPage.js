import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, reset } from '../redux/slices/authSlice';
import '../assets/css/AuthForms.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [formError, setFormError] = useState('');
  
  const { email, password } = formData;
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user, isLoading, isSuccess, isError, message } = useSelector((state) => state.auth);
  
  useEffect(() => {
    if (isError) {
      setFormError(message);
    }
    
    // Redirect if logged in
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
    if (!email || !password) {
      setFormError('Please fill in all fields');
      return;
    }
    
    const userData = {
      email,
      password
    };
    
    dispatch(login(userData));
  };
  
  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-container">
          <div className="auth-form-container">
            <h1>Welcome Back!</h1>
            <p>Login to your account to continue shopping</p>
            
            {formError && <div className="alert alert-danger">{formError}</div>}
            
            <form onSubmit={onSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
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
                <label htmlFor="password">Password</label>
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
                <button type="submit" className="btn btn-primary btn-block" disabled={isLoading}>
                  {isLoading ? 'Logging in...' : 'Login'}
                </button>
              </div>
            </form>
            
            <div className="auth-footer">
              <p>
                Don't have an account? <Link to="/register">Register</Link>
              </p>
            </div>
          </div>
          
          <div className="auth-image">
            <img src="https://plus.unsplash.com/premium_photo-1681487814165-018814e29155?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8TG9naW58ZW58MHx8MHx8fDA%3D" alt="Login" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 