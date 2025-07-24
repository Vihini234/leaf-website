import React, { useState } from 'react';
import { ArrowLeft, ShoppingCart, Minus, Plus } from 'lucide-react';
import './Dairy.css'; // Assuming you have a CSS file for styling

const DairyProducts = () => {
  const [quantities, setQuantities] = useState({});
  const [totals, setTotals] = useState({});

  const products = [
    {
      id: 1,
      name: 'Fresh Whole Milk',
      description: 'Premium quality whole milk, rich in calcium and vitamins',
      price: 3.49,
      originalPrice: 3.99,
      discount: 12,
      unit: 'per gallon',
      stock: 45,
      image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&h=300&fit=crop',
      inStock: true
    },
    {
      id: 2,
      name: 'Organic Greek Yogurt',
      description: 'Creamy organic Greek yogurt, packed with probiotics',
      price: 4.29,
      originalPrice: null,
      discount: null,
      unit: 'per container',
      stock: 28,
      image: 'https://images.unsplash.com/photo-1571212515416-fdfb6fb55dde?w=300&h=300&fit=crop',
      inStock: true
    },
    {
      id: 3,
      name: 'Aged Cheddar Cheese',
      description: 'Sharp aged cheddar cheese, perfect for sandwiches',
      price: 5.99,
      originalPrice: 6.49,
      discount: 8,
      unit: 'per lb',
      stock: 15,
      image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=300&h=300&fit=crop',
      inStock: true
    },
    {
      id: 4,
      name: 'Farm Fresh Butter',
      description: 'Creamy farm-fresh butter, made from grass-fed cows',
      price: 4.79,
      originalPrice: 5.29,
      discount: 9,
      unit: 'per lb',
      stock: 22,
      image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=300&h=300&fit=crop',
      inStock: true
    },
    {
      id: 5,
      name: 'Heavy Cream',
      description: 'Rich heavy cream, perfect for cooking and baking',
      price: 3.89,
      originalPrice: null,
      discount: null,
      unit: 'per pint',
      stock: 18,
      image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=300&h=300&fit=crop',
      inStock: true
    },
    {
      id: 6,
      name: 'Mozzarella Cheese',
      description: 'Fresh mozzarella cheese, ideal for pizza and pasta',
      price: 4.99,
      originalPrice: 5.49,
      discount: 9,
      unit: 'per lb',
      stock: 31,
      image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=300&h=300&fit=crop',
      inStock: true
    }
  ];

  const updateQuantity = (productId, change) => {
    const newQuantity = Math.max(0, (quantities[productId] || 1) + change);
    const product = products.find(p => p.id === productId);
    
    setQuantities(prev => ({
      ...prev,
      [productId]: newQuantity
    }));
    
    setTotals(prev => ({
      ...prev,
      [productId]: (newQuantity * product.price).toFixed(2)
    }));
  };

  const addToCart = (productId) => {
    const quantity = quantities[productId] || 1;
    console.log(`Added ${quantity} of product ${productId} to cart`);
    // Here you would typically dispatch to a cart context or make an API call
  };

  return (
    <div className="dairy-products-container">
      {/* Header */}
      <div className="header">
        <button className="back-button">
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      {/* Title Section */}
      <div className="title-section">
        <h1 className="page-title">Fresh Dairy Products</h1>
        <p className="page-subtitle">Farm-fresh dairy products delivered to your door</p>
      </div>

      {/* Products Grid */}
      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            {/* Discount Badge */}
            {product.discount && (
              <div className="discount-badge">
                -{product.discount}%
              </div>
            )}

            {/* Product Image */}
            <div className="product-image">
              <img src={product.image} alt={product.name} />
            </div>

            {/* Product Info */}
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">{product.description}</p>

              {/* Price */}
              <div className="price-section">
                <span className="current-price">${product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="original-price">${product.originalPrice.toFixed(2)}</span>
                )}
                <span className="price-unit">{product.unit}</span>
              </div>

              {/* Stock Status */}
              <div className="stock-status">
                <span className="stock-indicator in-stock"></span>
                <span className="stock-text">IN STOCK</span>
                <span className="stock-count">{product.stock} available</span>
              </div>

              {/* Quantity Controls */}
              <div className="quantity-controls">
                <button 
                  className="quantity-btn"
                  onClick={() => updateQuantity(product.id, -1)}
                >
                  <Minus size={16} />
                </button>
                <span className="quantity-display">
                  {quantities[product.id] || 1}
                </span>
                <button 
                  className="quantity-btn"
                  onClick={() => updateQuantity(product.id, 1)}
                >
                  <Plus size={16} />
                </button>
                
                <button 
                  className="add-to-cart-btn"
                  onClick={() => addToCart(product.id)}
                >
                  <ShoppingCart size={16} />
                  Add to Cart
                </button>
              </div>

              {/* Total */}
              <div className="product-total">
                Total: ${totals[product.id] || product.price.toFixed(2)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Features Section */}
      <div className="features-section">
        <div className="feature">
          <div className="feature-icon">🥛</div>
          <span>Fresh Quality Guaranteed</span>
        </div>
        <div className="feature">
          <div className="feature-icon">🚚</div>
          <span>Same Day Delivery</span>
        </div>
        <div className="feature">
          <div className="feature-icon">↩</div>
          <span>Easy Returns</span>
        </div>
      </div>
    </div>
  );
};

export default DairyProducts;