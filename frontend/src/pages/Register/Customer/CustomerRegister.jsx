import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LogoImg from '../../../assets/images/logo1.png'; 
import './CustomerRegister.css';

const CustomerRegistration = () => {
  const [formData, setFormData] = useState({
    role: 'consumer',
    fullName: '',
    email: '',
    phoneNumber: '',
    district: '',
    address: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const districts = [
    'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo', 'Galle', 
    'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara', 'Kandy', 'Kegalle', 
    'Kilinochchi', 'Kurunegala', 'Mannar', 'Matale', 'Matara', 'Monaragala', 
    'Mullaitivu', 'Nuwara Eliya', 'Polonnaruwa', 'Puttalam', 'Ratnapura', 
    'Trincomalee', 'Vavuniya'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    if (!formData.agreeToTerms) {
      alert('Please agree to the Terms of Service and Privacy Policy');
      return;
    }
    
    console.log('Form submitted:', formData);
    alert('Account created successfully!');
  };

  return (
    <div className="registration-wrapper">
      <div className="registration-card">
   
        <div className="card-header">
          <img src={LogoImg} alt="LEAF Logo" className="logo-image" />
          <h1 className="card-title">Join LEAF Community</h1>
          <h1 className="card-title">As Customer</h1>
          <p className="card-subtitle">Create your account to start connecting with local agriculture</p>
        </div>

        <form onSubmit={handleSubmit} className="registration-form">

          <div className="input-row">
            <div className="input-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className="form-input"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="input-row">
            <div className="input-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                className="form-input"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="district">District</label>
              <select
                id="district"
                name="district"
                value={formData.district}
                onChange={handleInputChange}
                className="form-input form-select"
                required
              >
                <option value="">Select your district</option>
                {districts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Enter your full address"
              className="form-input form-textarea"
              rows="3"
              required
            />
          </div>

          <div className="input-row">
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <div className="password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a password"
                  className="form-input"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁' : '👁‍🗨'}
                </button>
              </div>
            </div>
            <div className="input-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="password-field">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  className="form-input"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? '👁' : '👁‍🗨'}
                </button>
              </div>
            </div>
          </div>

          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                required
              />
              <span className="checkbox-custom"></span>
              I agree to the <a href="#" className="terms-link">Terms of Service</a> and <Link to="/pages/PrivacyPolicy/PrivacyPolicy" className="terms-link">Privacy Policy</Link>
            </label>
          </div>

          <button type="submit" className="create-account-btn">
            Create Account
          </button>

          <div className="form-footer">
            <p>Already have an account? <Link to ="/pages/Login/LoginPage" className="sign-in-link">login</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerRegistration;