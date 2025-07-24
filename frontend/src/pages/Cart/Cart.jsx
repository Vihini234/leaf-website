import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StaticNavbar from '../../components/StaticNavbar/StaticNavbar';
import './Cart.css';



const ArrowLeft = () => (
  <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
);

const Minus = () => (
  <svg className="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const Plus = () => (
  <svg className="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const Trash2 = () => (
  <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3,6 5,6 21,6"/>
    <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
    <line x1="10" y1="11" x2="10" y2="17"/>
    <line x1="14" y1="11" x2="14" y2="17"/>
  </svg>
);

const ShoppingBag = () => (
  <svg className="icon icon-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="m16 10a4 4 0 0 1-8 0"/>
  </svg>
);

const CreditCard = () => (
  <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
    <line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
);

const CartPage = () => {
    const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Wireless Bluetooth Headphones',
      price: 89.99,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&h=150&fit=crop',
      color: 'Black',
      size: 'Standard'
    },
    {
      id: 2,
      name: 'Premium Coffee Beans',
      price: 24.99,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=150&h=150&fit=crop',
      color: 'Dark Roast',
      size: '1lb'
    },
    {
      id: 3,
      name: 'Ergonomic Office Chair',
      price: 299.99,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=150&h=150&fit=crop',
      color: 'Gray',
      size: 'Medium'
    },
    {
      id: 4,
      name: 'Organic Green Tea Set',
      price: 34.99,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1594631661960-3e4ae609dbb2?w=150&h=150&fit=crop',
      color: 'Natural',
      size: '50 Bags'
    }
  ]);

  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === 'green10' || promoCode.toLowerCase() === 'save10') {
      setPromoApplied(true);
    } else {
      alert('Invalid promo code. Try "GREEN10" for 10% off!');
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = (subtotal - discount) * 0.08;
  const total = subtotal - discount + shipping + tax;

  const handleCheckout = () => {
    alert(`Proceeding to secure checkout with total: $${total.toFixed(2)}`);
  };

  const handleContinueShopping = () => {
  navigate('/pages/Customer/CustomerDash');
};


  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <div className="cart-max-width">
          <div className="empty-cart">
            <div className="empty-cart-icon">
              <ShoppingBag />
            </div>
            <h2 className="empty-cart-title">Your cart is empty</h2>
            <p className="empty-cart-description">
              Discover amazing products and add them to your cart to get started
            </p>
            <button 
              className="continue-shopping-btn"
              onClick={handleContinueShopping}
            >
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
    <StaticNavbar />
    <div className="cart-container">
      <div className="cart-max-width">
        {/* Header Section */}
        <header className="cart-header">
          <button className="back-button" onClick={handleContinueShopping}>
            <ArrowLeft />
            Continue Shopping
          </button>
          <h1 className="page-title">Shopping Cart</h1>
          <div className="cart-count">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
          </div>
        </header>

        <div className="cart-grid">

          <div className="cart-items-section">
            <div className="section-header">
              <h2 className="section-title">Your Items</h2>
            </div>
            
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="item-image-container">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="item-image"
                    />
                  </div>
                  
                  <div className="item-details">
                    <h3 className="item-name">{item.name}</h3>
                    <div className="item-variants">
                      <span className="variant">Color: {item.color}</span>
                      <span className="variant">Size: {item.size}</span>
                    </div>
                    <div className="item-price">${item.price.toFixed(2)}</div>
                  </div>
                  
                  <div className="item-actions">
                    <div className="quantity-controls">
                      <button
                        className="quantity-btn quantity-btn-minus"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        <Minus />
                      </button>
                      
                      <span className="quantity-display">{item.quantity}</span>
                      
                      <button
                        className="quantity-btn quantity-btn-plus"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus />
                      </button>
                    </div>
                    
                    <div className="item-total">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                    
                    <button
                      className="remove-btn"
                      onClick={() => removeItem(item.id)}
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <Trash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="order-summary">
            <h2 className="summary-title">Order Summary</h2>
            
            <div className="promo-section">
              <label htmlFor="promo-code" className="promo-label">
                Have a promo code?
              </label>
              <div className="promo-input-group">
                <input
                  id="promo-code"
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter GREEN10"
                  className="promo-input"
                  disabled={promoApplied}
                />
                <button
                  onClick={applyPromoCode}
                  disabled={promoApplied || !promoCode.trim()}
                  className="promo-btn"
                >
                  Apply
                </button>
              </div>
              {promoApplied && (
                <div className="promo-success">
                  <span className="success-icon">✓</span>
                  Promo code applied successfully!
                </div>
              )}
            </div>
            
            <div className="price-breakdown">
              <div className="price-row">
                <span className="price-label">Subtotal</span>
                <span className="price-value">${subtotal.toFixed(2)}</span>
              </div>
              
              {promoApplied && (
                <div className="price-row discount-row">
                  <span className="price-label">Discount (10%)</span>
                  <span className="price-value">-${discount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="price-row">
                <span className="price-label">Shipping</span>
                <span className="price-value">
                  {shipping === 0 ? (
                    <span className="free-shipping">Free</span>
                  ) : (
                    `$${shipping.toFixed(2)}`
                  )}
                </span>
              </div>
              
              <div className="price-row">
                <span className="price-label">Tax</span>
                <span className="price-value">${tax.toFixed(2)}</span>
              </div>
              
              <div className="price-row total-row">
                <span className="price-label">Total</span>
                <span className="price-value total-amount">${total.toFixed(2)}</span>
              </div>
            </div>
            
            {subtotal < 100 && (
              <div className="free-shipping-banner">
                <div className="banner-content">
                  <span className="shipping-icon">🚚</span>
                  <span className="banner-text">
                    Add <strong>${(100 - subtotal).toFixed(2)}</strong> more for free shipping!
                  </span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={`{width: ${(subtotal / 100) * 100}%}`}
                  ></div>
                </div>
              </div>
            )}
            
            <button 
              className="checkout-btn"
              onClick={handleCheckout}
            >
              <CreditCard />
              <span>Secure Checkout</span>
              <span className="checkout-amount">${total.toFixed(2)}</span>
            </button>

            <div className="security-info">
              <div className="security-badges">
                <span className="security-badge">🔒 SSL Secured</span>
                <span className="security-badge">💳 Safe Payment</span>
              </div>
              <p className="security-text">
                Your payment information is processed securely. We don't store credit card details.
              </p>
            </div>

            <div className="payment-methods">
              <p className="payment-title">We accept:</p>
              <div className="payment-icons">
                <span className="payment-icon">💳</span>
                <span className="payment-icon">🏦</span>
                <span className="payment-icon">📱</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default CartPage;