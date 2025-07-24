import React, { useState } from 'react';
import{Link} from 'react-router-dom';
import LogoImg from '../../../assets/images/logo1.png'; // Adjust the path as necessary
import './DeliveryRegister.css';

const DeliverRegistration = () => {
  const [formData, setFormData] = useState({
    role: 'delivery-agent',
    fullName: '',
    email: '',
    phoneNumber: '',
    district: '',
    address: '',
    vehicleType: '',
    licenseNumber: '',
    serviceAreas: [],
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

  const vehicleTypes = [
    'Motorcycle', 'Three Wheeler', 'Car', 'Van', 'Small Truck', 'Bicycle'
  ];

  const serviceAreasList = [
    'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
    'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
    'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
    'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
    'Monaragala', 'Ratnapura', 'Kegalle'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleServiceAreaChange = (area) => {
    setFormData(prev => {
      const updatedAreas = prev.serviceAreas.includes(area)
        ? prev.serviceAreas.filter(item => item !== area)
        : [...prev.serviceAreas, area];
      
      return {
        ...prev,
        serviceAreas: updatedAreas
      };
    });
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

    if (formData.serviceAreas.length === 0) {
      alert('Please select at least one service area');
      return;
    }
    
    console.log('Form submitted:', formData);
    alert('Delivery agent account created successfully!');
  };

  return (
    <div className="delivery-registration-wrapper">
      <div className="delivery-registration-card">
 
        <div className="card-header">
          <img src={LogoImg} alt="LEAF Logo" className="logo-image" />
          <h1 className="card-title">Join LEAF Community</h1>
          <h1 className="card-title">As Delivery Agent</h1>
          <p className="card-subtitle">Create your account to start connecting with local agriculture</p>
        </div>

        <form onSubmit={handleSubmit} className="delivery-registration-form">

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
              <label htmlFor="vehicleType">Vehicle Type</label>
              <select
                id="vehicleType"
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleInputChange}
                className="form-input form-select"
                required
              >
                <option value="">Select vehicle type</option>
                {vehicleTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <label htmlFor="licenseNumber">License Number</label>
              <input
                type="text"
                id="licenseNumber"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleInputChange}
                placeholder="Driving license number"
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Service Areas</label>
            <div className="service-areas-container">
              <div className="service-areas-grid">
                {serviceAreasList.map(area => (
                  <label key={area} className="service-area-item">
                    <input
                      type="checkbox"
                      checked={formData.serviceAreas.includes(area)}
                      onChange={() => handleServiceAreaChange(area)}
                    />
                    <span className="checkbox-custom"></span>
                    <span className="area-name">{area}</span>
                  </label>
                ))}
              </div>
            </div>
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
            <p>Already have an account? <Link to="/pages/Login/LoginPage" className="sign-in-link">Login</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeliverRegistration;