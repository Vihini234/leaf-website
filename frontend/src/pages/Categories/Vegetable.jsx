import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Vegetable.css';

const VegetablesPage = ({ onAddToCart }) => {
  const [quantities, setQuantities] = useState({
    1: 1,
    2: 1,
    3: 1,
    4: 1
  });

  const vegetables = [
    {
      id: 1,
      name: "Fresh Tomatoes",
      price: 2.99,
      unit: "per kg",
      stock: 25,
      image: "🍅",
      description: "Fresh, juicy red tomatoes perfect for salads and cooking",
      discount: 10
    },
    {
      id: 2,
      name: "Organic Carrots",
      price: 1.89,
      unit: "per kg",
      stock: 18,
      image: "🥕",
      description: "Crunchy organic carrots, rich in vitamins and minerals",
      discount: 0
    },
    {
      id: 3,
      name: "Green Bell Peppers",
      price: 3.49,
      unit: "per kg",
      stock: 12,
      image: "🫑",
      description: "Fresh green bell peppers, perfect for stir-fries",
      discount: 15
    },
    {
      id: 4,
      name: "Fresh Broccoli",
      price: 2.79,
      unit: "per bunch",
      stock: 8,
      image: "🥦",
      description: "Nutritious fresh broccoli, packed with vitamins",
      discount: 0
    }
  ];

  const handleQuantityChange = (productId, change) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, Math.min(prev[productId] + change, getProductById(productId).stock))
    }));
  };

  const getProductById = (id) => vegetables.find(v => v.id === id);

  const calculateDiscountedPrice = (price, discount) => {
    return discount > 0 ? price - (price * discount / 100) : price;
  };

  const handleAddToCart = (product) => {
    const quantity = quantities[product.id];
    const finalPrice = calculateDiscountedPrice(product.price, product.discount);
    
    onAddToCart && onAddToCart({
      ...product,
      quantity,
      finalPrice,
      totalPrice: finalPrice * quantity
    });
    
    const button = document.querySelector([`data-product-id="${product.id}"`]);
    const originalText = button.textContent;
    button.textContent = 'Added!';
    button.classList.add('added');
    
    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove('added');
    }, 1500);
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { text: 'Out of Stock', class: 'out-of-stock' };
    if (stock <= 5) return { text: 'Low Stock', class: 'low-stock' };
    return { text: 'In Stock', class: 'in-stock' };
  };
  const navigate = useNavigate();


  return (
    <div className="vegetables-page">
      <div className="page-header">
        <button className="back-button" onClick={() => navigate("/pages/Customer/CustomerDash")}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Back
        </button>
        <h1 className="page-title">Fresh Vegetables</h1>
        <p className="page-subtitle">Farm-fresh vegetables delivered to your door</p>
      </div>

      <div className="products-grid">
        {vegetables.map(product => {
          const stockStatus = getStockStatus(product.stock);
          const discountedPrice = calculateDiscountedPrice(product.price, product.discount);
          
          return (
            <div key={product.id} className="product-card">
              {product.discount > 0 && (
                <div className="discount-badge">
                  -{product.discount}%
                </div>
              )}
              
              <div className="product-image">
                <span className="emoji-image">{product.image}</span>
              </div>
              
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                
                <div className="price-section">
                  {product.discount > 0 ? (
                    <>
                      <span className="current-price">${discountedPrice.toFixed(2)}</span>
                      <span className="original-price">${product.price.toFixed(2)}</span>
                    </>
                  ) : (
                    <span className="current-price">${product.price.toFixed(2)}</span>
                  )}
                  <span className="price-unit">{product.unit}</span>
                </div>
                
                <div className="stock-info">
                  <span className={`stock-status ${stockStatus.class}`}>
                    {stockStatus.text}
                  </span>
                  <span className="stock-count">{product.stock} available</span>
                </div>
                
                {product.stock > 0 ? (
                  <div className="product-actions">
                    <div className="quantity-selector">
                      <button 
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(product.id, -1)}
                        disabled={quantities[product.id] <= 1}
                      >
                        -
                      </button>
                      <span className="quantity-display">{quantities[product.id]}</span>
                      <button 
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(product.id, 1)}
                        disabled={quantities[product.id] >= product.stock}
                      >
                        +
                      </button>
                    </div>
                    
                    <button 
                      className="add-to-cart-btn"
                      onClick={() => handleAddToCart(product)}
                      data-product-id={product.id}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="8" cy="21" r="1"/>
                        <circle cx="19" cy="21" r="1"/>
                        <path d="m2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
                      </svg>
                      Add to Cart
                    </button>
                  </div>
                ) : (
                  <button className="add-to-cart-btn disabled" disabled>
                    Out of Stock
                  </button>
                )}
                
                <div className="total-price">
                  Total: ${(discountedPrice * quantities[product.id]).toFixed(2)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="page-footer">
        <div className="delivery-info">
          <div className="info-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span>Fresh Quality Guaranteed</span>
          </div>
          <div className="info-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12,6 12,12 16,14"/>
            </svg>
            <span>Same Day Delivery</span>
          </div>
          <div className="info-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M9 12l2 2 4-4"/>
              <path d="M21 12c.552 0 1-.448 1-1V5c0-.552-.448-1-1-1H3c-.552 0-1 .448-1 1v6c0 .552.448 1 1 1h18z"/>
            </svg>
            <span>Easy Returns</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VegetablesPage;