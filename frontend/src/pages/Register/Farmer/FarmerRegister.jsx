import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LogoImg from '../../../assets/images/logo1.png';
import './FarmerRegister.css';

const FarmerRegistration = () => {
  const [formData, setFormData] = useState({
    role: 'farmer',
    fullName: '',
    email: '',
    phoneNumber: '',
    district: '',
    address: '',
    farmName: '',
    specialties: '',
    bankAccount: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    if (!formData.agreeToTerms) {
      alert('Please agree to the Terms of Service and Privacy Policy');
      return;
    }

    try {
      const res = await fetch('http://localhost/leaf/backend/api/Register/Farmer.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await res.json();
      setMessage(result.message);
      setSuccess(result.success);

      if (result.success) {
        setFormData({
          role: 'farmer',
          fullName: '',
          email: '',
          phoneNumber: '',
          district: '',
          address: '',
          farmName: '',
          specialties: '',
          bankAccount: '',
          password: '',
          confirmPassword: '',
          agreeToTerms: false
        });
      }

    } catch (error) {
      console.error('Error submitting form:', error);
      setMessage('Something went wrong. Please try again.');
      setSuccess(false);
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-form">
        <div className="form-header">
          <img src={LogoImg} alt="LEAF Logo" className="logo-image" />
          <h1 className="form-title">Join LEAF Community</h1>
          <h1 className="card-title">As Farmer</h1>
          <p className="form-subtitle">Create your account to start connecting with local agriculture</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="district">District</label>
              <select
                id="district"
                name="district"
                value={formData.district}
                onChange={handleInputChange}
                required
              >
                <option value="">Select your district</option>
                {districts.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="farmName">Farm Name</label>
            <input
              type="text"
              id="farmName"
              name="farmName"
              value={formData.farmName}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="specialties">Specialties</label>
            <textarea
              id="specialties"
              name="specialties"
              value={formData.specialties}
              onChange={handleInputChange}
              placeholder="E.g. Organic vegetables, Fruits"
            />
          </div>

          <div className="form-group">
            <label htmlFor="bankAccount">Bank Account (Optional)</label>
            <input
              type="text"
              id="bankAccount"
              name="bankAccount"
              value={formData.bankAccount}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
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
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="password-input">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
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

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                required
              />
              I agree to the <a href="#">Terms of Service</a> and <Link to="/pages/PrivacyPolicy/PrivacyPolicy">Privacy Policy</Link>
            </label>
          </div>

          <button type="submit" className="submit-button">Create Account</button>



          <div className="form-footer">
            <p>Already have an account? <Link to="/pages/Login/LoginPage">Login</Link></p>
          </div>
        </form>

        {message && (
          <p className="form-message" style={{ color: success ? 'green' : 'red' }}>{message}</p>
        )}
      </div>
    </div>
  );
};

export default FarmerRegistration;
