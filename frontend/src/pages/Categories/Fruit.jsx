import React, { useState } from 'react';
import './Fruit.css';

const Fruits = () => {
  const [quantities, setQuantities] = useState({
    1: 1,
    2: 1,
    3: 1
  });

  const fruits = [
    {
      id: 1,
      name: 'Fresh Apples',
      description: 'Crisp and sweet red apples, perfect for snacking and cooking',
      image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=200&fit=crop&crop=center',
      currentPrice: 3.49,
      originalPrice: 3.99,
      unit: 'per kg',
      discount: 15,
      inStock: true,
      available: 32
    },
    {
      id: 2,
      name: 'Organic Bananas',
      description: 'Sweet organic bananas, rich in potassium and natural sugars',
      image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=200&fit=crop&crop=center',
      currentPrice: 2.29,
      originalPrice: null,
      unit: 'per bunch',
      discount: null,
      inStock: true,
      available: 28
    },
    {
      id: 3,
      name: 'Fresh Oranges',
      description: 'Juicy valencia oranges, packed with vitamin C and antioxidants',
      image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=300&h=200&fit=crop&crop=center',
      currentPrice: 2.89,
      originalPrice: 3.29,
      unit: 'per kg',
      discount: 12,
      inStock: true,
      available: 19
    }
  ];

  const handleQuantityChange = (id, change) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(1, prev[id] + change)
    }));
  };

  const handleInputChange = (id, value) => {
    const quantity = parseInt(value) || 1;
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(1, quantity)
    }));
  };

  const calculateTotal = (price, quantity) => {
    return (price * quantity).toFixed(2);
  };

  return (
    <div className="fruits-page">
      <div className="header">
        <button className="back-button">
          <span className="back-arrow">←</span> Back
        </button>
        <h1 className="page-title">Fresh Fruits</h1>
        <p className="page-subtitle">Farm-fresh fruits delivered to your door</p>
      </div>

      <div className="fruits-grid">
        {fruits.map(fruit => (
          <div key={fruit.id} className="fruit-card">
            {fruit.discount && (
              <div className="discount-badge">-{fruit.discount}%</div>
            )}
            
            <div className="fruit-image-container">
              <img src={fruit.image} alt={fruit.name} className="fruit-image" />
            </div>

            <div className="fruit-info">
              <h3 className="fruit-name">{fruit.name}</h3>
              <p className="fruit-description">{fruit.description}</p>
              
              <div className="price-section">
                <span className="current-price">${fruit.currentPrice}</span>
                {fruit.originalPrice && (
                  <span className="original-price">${fruit.originalPrice}</span>
                )}
                <span className="unit">{fruit.unit}</span>
              </div>

              <div className="stock-info">
                <span className="in-stock">IN STOCK</span>
                <span className="available">{fruit.available} available</span>
              </div>

              <div className="quantity-controls">
                <button 
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(fruit.id, -1)}
                >
                  -
                </button>
                <input 
                  type="number" 
                  className="quantity-input"
                  value={quantities[fruit.id]}
                  onChange={(e) => handleInputChange(fruit.id, e.target.value)}
                  min="1"
                />
                <button 
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(fruit.id, 1)}
                >
                  +
                </button>
                <button className="add-to-cart-btn">
                  <span className="cart-icon">🛒</span>
                  Add to Cart
                </button>
              </div>

              <div className="total-price">
                Total: ${calculateTotal(fruit.currentPrice, quantities[fruit.id])}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="features">
        <div className="feature">
          <span className="feature-icon">✓</span>
          <span className="feature-text">Fresh Quality Guaranteed</span>
        </div>
        <div className="feature">
          <span className="feature-icon">🚚</span>
          <span className="feature-text">Same Day Delivery</span>
        </div>
        <div className="feature">
          <span className="feature-icon">↩</span>
          <span className="feature-text">Easy Returns</span>
        </div>
      </div>
    </div>
  );
};

export default Fruits;