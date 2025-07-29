import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Components/Navbar/Navbar.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import './CategoryPages.css';

function VegetablesPage() {
  const [vegetables, setVegetables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const navigate = useNavigate();

  // Mock farmer ID - in real app, this would come from authentication
  const farmerId = 2; // Using farmer ID 2 (Thecokshana) from the database

  // New product form state
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    unit: 'kg'
  });

  // Fetch vegetables from backend
  const fetchVegetables = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8000/api/category_products.php?farmer_id=${farmerId}&category=vegetables`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetch vegetables response:', data);
      
      if (data.success) {
        setVegetables(data.data || []);
      } else {
        console.error('Failed to fetch vegetables:', data.message);
        setVegetables([]);
      }
    } catch (error) {
      console.error('Error fetching vegetables:', error);
      setVegetables([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVegetables();
  }, []);

  // Handle add new product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/category_products.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newProduct,
          farmer_id: farmerId,
          category: 'vegetables'
        })
      });

      const data = await response.json();
      if (data.success) {
        setShowAddForm(false);
        setNewProduct({ name: '', description: '', price: '', stock: '', unit: 'kg' });
        fetchVegetables(); // Refresh the list
        alert('Product added successfully!');
      } else {
        console.error('API Error:', data);
        alert('Failed to add product: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Network Error:', error);
      alert('Network error: ' + error.message);
    }
  };

  // Handle edit product
  const handleEditProduct = async (productId, updatedData) => {
    try {
      const response = await fetch('http://localhost:8000/api/products.php', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: productId,
          ...updatedData
        })
      });

      const data = await response.json();
      if (data.success) {
        setEditingProduct(null);
        fetchVegetables(); // Refresh the list
      } else {
        alert('Failed to update product: ' + data.message);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error updating product');
    }
  };

  // Handle delete product
  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch('http://localhost:8000/api/products.php', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            product_id: productId
          })
        });

        const data = await response.json();
        if (data.success) {
          fetchVegetables(); // Refresh the list
        } else {
          alert('Failed to delete product: ' + data.message);
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product');
      }
    }
  };

  return (
    <div className="category-page">
      <Navbar />
      
      <div className="category-container">
        <div className="category-header">
          <button 
            className="back-btn"
            onClick={() => navigate('/farmer-dashboard')}
          >
            ← Back to Dashboard
          </button>
          <h1>🥬 Vegetables Management</h1>
          <p>Manage your vegetable inventory</p>
        </div>

        <div className="category-actions">
          <button 
            className="add-product-btn"
            onClick={() => setShowAddForm(true)}
          >
            + Add New Vegetable
          </button>
        </div>

        {/* Add Product Form */}
        {showAddForm && (
          <div className="add-form-overlay">
            <div className="add-form">
              <h3>Add New Vegetable</h3>
              <form onSubmit={handleAddProduct}>
                <div className="form-group">
                  <label>Product Name</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Price (Rs.)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Stock Quantity</label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Unit</label>
                  <select
                    value={newProduct.unit}
                    onChange={(e) => setNewProduct({...newProduct, unit: e.target.value})}
                  >
                    <option value="kg">kg</option>
                    <option value="piece">piece</option>
                    <option value="bundle">bundle</option>
                  </select>
                </div>
                <div className="form-actions">
                  <button type="submit" className="submit-btn">Add Product</button>
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="products-grid">
          {loading ? (
            <div className="loading">Loading vegetables...</div>
          ) : vegetables.length === 0 ? (
            <div className="no-products">
              <p>No vegetables found. Add your first vegetable product!</p>
            </div>
          ) : (
            vegetables.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <img 
                    src={product.image_url || '/src/assets/images/vegetables.jpg'} 
                    alt={product.name}
                    onError={(e) => {
                      e.target.src = '/src/assets/images/vegetables.jpg';
                    }}
                  />
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="description">{product.description}</p>
                  <div className="product-details">
                    <span className="price">Rs. {product.price}/{product.unit}</span>
                    <span className={`stock ${product.quantity_available <= 10 ? 'low-stock' : ''}`}>
                      Stock: {product.quantity_available} {product.unit}
                    </span>
                    <span className={`status ${product.status}`}>
                      {product.status === 'active' ? '✅ Active' : '❌ Inactive'}
                    </span>
                  </div>
                </div>
                <div className="product-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => setEditingProduct(product)}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default VegetablesPage;
