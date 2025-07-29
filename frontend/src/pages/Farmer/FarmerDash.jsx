import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Components/Navbar/Navbar.jsx'
import Footer from '../../components/Footer/Footer'
import vegImg from '../../assets/images/vegetables.jpg';
import fruitImg from '../../assets/images/fruits.jpg';
import dairyImg from '../../assets/images/dairy.jpg';
import './FarmerDash.css';

function FarmerDashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    stats: {
      total_products: 0,
      total_orders: 0,
      monthly_revenue: 0,
      pending_orders: 0
    },
    orders: [],
    products: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeCategory, setActiveCategory] = useState('vegetables'); // New state for category
  
  // Mock farmer ID - in real app, this would come from authentication
  const farmerId = 2; // Using farmer ID 2 (Thecokshana) from the database

  // Dummy products data for each category
  const categoryProducts = {
    vegetables: [
      {
        id: 1,
        name: 'Fresh Carrots',
        description: 'Organic carrots grown without pesticides',
        price: 150,
        quantity_available: 50,
        unit: 'kg',
        category_name: 'Vegetables',
        image_url: '/src/assets/images/carrot1.jpg',
        status: 'active'
      },
      {
        id: 2,
        name: 'Green Cabbage',
        description: 'Fresh green cabbage, perfect for salads',
        price: 80,
        quantity_available: 30,
        unit: 'piece',
        category_name: 'Vegetables',
        image_url: '/src/assets/images/cabbage1.jpg',
        status: 'active'
      },
      {
        id: 3,
        name: 'Fresh Potatoes',
        description: 'High-quality potatoes for cooking',
        price: 120,
        quantity_available: 100,
        unit: 'kg',
        category_name: 'Vegetables',
        image_url: '/src/assets/images/potato1.jpg',
        status: 'active'
      }
    ],
    fruits: [
      {
        id: 4,
        name: 'Sweet Mangoes',
        description: 'Juicy and sweet mangoes from our farm',
        price: 350,
        quantity_available: 25,
        unit: 'kg',
        category_name: 'Fruits',
        image_url: '/src/assets/images/mango1.jpg',
        status: 'active'
      },
      {
        id: 5,
        name: 'Fresh Strawberries',
        description: 'Premium quality strawberries',
        price: 800,
        quantity_available: 15,
        unit: 'kg',
        category_name: 'Fruits',
        image_url: '/src/assets/images/strawb1.jpg',
        status: 'active'
      },
      {
        id: 6,
        name: 'Ripe Durian',
        description: 'Fresh durian with strong aroma',
        price: 500,
        quantity_available: 10,
        unit: 'piece',
        category_name: 'Fruits',
        image_url: '/src/assets/images/duriyan1.jpg',
        status: 'active'
      }
    ],
    dairy: [
      {
        id: 7,
        name: 'Fresh Cow Milk',
        description: 'Pure cow milk from our farm',
        price: 180,
        quantity_available: 40,
        unit: 'liter',
        category_name: 'Dairy',
        image_url: '/src/assets/images/dairy.jpg',
        status: 'active'
      },
      {
        id: 8,
        name: 'Farm Fresh Cheese',
        description: 'Homemade cheese from farm milk',
        price: 450,
        quantity_available: 20,
        unit: 'kg',
        category_name: 'Dairy',
        image_url: '/src/assets/images/dairy.jpg',
        status: 'active'
      }
    ]
  };

  useEffect(() => {
    fetchDashboardData();
    fetchOrders();
    fetchProducts();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/Farmer/dashboard.php?farmer_id=${farmerId}&type=stats`);
      const data = await response.json();
      
      if (data.success) {
        setDashboardData(prev => ({
          ...prev,
          stats: data.data
        }));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Use sample data if API fails
      setDashboardData(prev => ({
        ...prev,
        stats: {
          total_products: 3,
          total_orders: 3,
          monthly_revenue: 320,
          pending_orders: 2
        }
      }));
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/Farmer/orders.php?farmer_id=${farmerId}`);
      const data = await response.json();
      
      if (data.success) {
        setDashboardData(prev => ({
          ...prev,
          orders: data.data
        }));
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      // Use sample data if API fails
      setDashboardData(prev => ({
        ...prev,
        orders: [
          {
            order_id: '#1023',
            customer_name: 'Sanduni Perera',
            address: 'Colombo 07',
            phone_number: '077-1234567',
            product_list: 'Tomatoes (2kg), Milk (1L)',
            order_status: 'pending'
          },
          {
            order_id: '#1024',
            customer_name: 'Kasun Fernando',
            address: 'Kandy',
            phone_number: '071-7896541',
            product_list: 'Pumpkin (3kg), Yogurt (500ml)',
            order_status: 'confirmed'
          }
        ]
      }));
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/Farmer/products.php?farmer_id=${farmerId}`);
      const data = await response.json();
      
      if (data.success) {
        setDashboardData(prev => ({
          ...prev,
          products: data.data
        }));
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      // Use sample data if API fails
      setDashboardData(prev => ({
        ...prev,
        products: [
          {
            id: 1,
            name: 'Red Rice',
            category_name: 'Grains',
            price: 150.99,
            quantity_available: 16,
            unit: 'kg',
            status: 'Available'
          },
          {
            id: 2,
            name: 'Organic Tomatoes',
            category_name: 'Vegetables',
            price: 320.99,
            quantity_available: 42,
            unit: 'kg',
            status: 'Available'
          },
          {
            id: 3,
            name: 'Fresh Carrots',
            category_name: 'Vegetables',
            price: 150.99,
            quantity_available: 8,
            unit: 'kg',
            status: 'Low Stock'
          }
        ]
      }));
    } finally {
      setLoading(false);
    }
  };

  // Handler for category card clicks
  const handleCategoryClick = (category) => {
    switch (category) {
      case 'vegetables':
        navigate('/farmer-vegetables');
        break;
      case 'fruits':
        navigate('/farmer-fruits');
        break;
      case 'dairy':
        navigate('/farmer-dairy');
        break;
      default:
        setActiveCategory(category);
        setActiveTab('category');
    }
  };

  const renderDashboard = () => (
    <>
      <div className="dashboard-header">
        <h1>Farmer Dashboard</h1>
        <p>Welcome back, Admin! Manage your farm and products.</p>
        <div className="user-info">
          <span className="rating">⭐ All Rating</span>
        </div>
      </div>

      <div className="analytics-cards">
        <div className="analytics-card">
          <div className="card-icon">📦</div>
          <div className="card-content">
            <h3>{dashboardData.stats.total_products}</h3>
            <p>Total Products</p>
            <span className="card-subtitle">In past month</span>
          </div>
        </div>
        
        <div className="analytics-card">
          <div className="card-icon">📋</div>
          <div className="card-content">
            <h3>{dashboardData.stats.total_orders}</h3>
            <p>Total Orders</p>
            <span className="card-subtitle">15 completed</span>
          </div>
        </div>
        
        <div className="analytics-card">
          <div className="card-icon">💰</div>
          <div className="card-content">
            <h3>Rs. {dashboardData.stats.monthly_revenue}</h3>
            <p>Revenue</p>
            <span className="card-subtitle">In past month</span>
          </div>
        </div>
        
        <div className="analytics-card">
          <div className="card-icon">⭐</div>
          <div className="card-content">
            <h3>4.5</h3>
            <p>Rating</p>
            <span className="card-subtitle">Based on reviews</span>
          </div>
        </div>
      </div>

      <div className="dashboard-actions">
        <div className="action-card" onClick={() => setActiveTab('products')}>
          <h3>Products</h3>
          <button className="btn-primary">Add Product</button>
        </div>
        
        <div className="action-card" onClick={() => setActiveTab('orders')}>
          <h3>Orders</h3>
          <button className="btn-primary">View orders</button>
        </div>
        
        <div className="action-card" onClick={() => setActiveTab('analytics')}>
          <h3>Analytics</h3>
          <button className="btn-primary">Analytics</button>
        </div>
      </div>

      <section className="farmer-section">
        <h2>Your Products by Category 🌱</h2>
        <div className="category-grid">
          <div className="category-card" onClick={() => handleCategoryClick('vegetables')}>
            <img src={vegImg} alt="Vegetables" />
            <h3>Vegetables</h3>
            <p>Fresh & Organic</p>
          </div>
          <div className="category-card" onClick={() => handleCategoryClick('fruits')}>
            <img src={fruitImg} alt="Fruits" />
            <h3>Fruits</h3>
            <p>Sweet & Juicy</p>
          </div>
          <div className="category-card" onClick={() => handleCategoryClick('dairy')}>
            <img src={dairyImg} alt="Dairy" />
            <h3>Dairy</h3>
            <p>Fresh & Pure</p>
          </div>
        </div>
      </section>
    </>
  );

  const renderProducts = () => (
    <div className="products-section">
      <div className="section-header">
        <h2>Product Inventory</h2>
        <p>Manage your products through direct inventory</p>
        <button className="btn-primary" onClick={() => setActiveTab('dashboard')}>
          ← Back to Dashboard
        </button>
      </div>
      
      <div className="products-table">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Status</th>
              <th>Orders</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dashboardData.products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.category_name}</td>
                <td>Rs. {product.price}</td>
                <td>
                  <span className={`status ${product.status.toLowerCase().replace(' ', '-')}`}>
                    {product.status}
                  </span>
                </td>
                <td>{product.quantity_available}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon">✏️</button>
                    <button className="btn-icon">🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="orders-section">
      <div className="section-header">
        <h2>Orders List 📦</h2>
        <button className="btn-primary" onClick={() => setActiveTab('dashboard')}>
          ← Back to Dashboard
        </button>
      </div>
      
      <div className="orders-table">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer Name</th>
              <th>Address</th>
              <th>Phone Number</th>
              <th>Product List</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {dashboardData.orders.map((order, index) => (
              <tr key={index}>
                <td>{order.order_id}</td>
                <td>{order.customer_name}</td>
                <td>{order.address}</td>
                <td>{order.phone_number}</td>
                <td>{order.product_list}</td>
                <td>
                  <span className={`status ${order.order_status}`}>
                    {order.order_status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="analytics-section">
      <div className="section-header">
        <h2>Analytics Overview</h2>
        <p>Track your farm performance and insights</p>
        <button className="btn-primary" onClick={() => setActiveTab('dashboard')}>
          ← Back to Dashboard
        </button>
      </div>
      
      <div className="analytics-grid">
        <div className="analytics-detailed-card">
          <h3>Sales Performance</h3>
          <div className="metric">
            <span className="metric-value">Rs. {dashboardData.stats.monthly_revenue}</span>
            <span className="metric-label">Monthly Revenue</span>
          </div>
          <div className="metric">
            <span className="metric-value">{dashboardData.stats.total_orders}</span>
            <span className="metric-label">Total Orders</span>
          </div>
        </div>
        
        <div className="analytics-detailed-card">
          <h3>Product Performance</h3>
          <div className="metric">
            <span className="metric-value">{dashboardData.stats.total_products}</span>
            <span className="metric-label">Active Products</span>
          </div>
          <div className="metric">
            <span className="metric-value">{dashboardData.stats.pending_orders}</span>
            <span className="metric-label">Pending Orders</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCategory = () => (
    <div className="category-section">
      <div className="section-header">
        <h2>{activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Products</h2>
        <p>Manage your {activeCategory} inventory</p>
        <button className="btn-primary" onClick={() => setActiveTab('dashboard')}>
          ← Back to Dashboard
        </button>
      </div>
      
      <div className="category-products-grid">
        {categoryProducts[activeCategory].map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <img src={product.image_url} alt={product.name} />
            </div>
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <div className="product-details">
                <span className="price">Rs. {product.price}/{product.unit}</span>
                <span className="quantity">Stock: {product.quantity_available} {product.unit}</span>
                <span className={`status ${product.status}`}>{product.status}</span>
              </div>
              <div className="product-actions">
                <button className="btn-primary">Edit Product</button>
                <button className="btn-secondary">Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="add-product-section">
        <button className="btn-primary add-product-btn">
          + Add New {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Product
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <>
        <Navbar isLoggedIn={true} isFarmer={true} />
        <div className="loading-spinner">Loading...</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar isLoggedIn={true} isFarmer={true} />
      
      <div className="farmer-dashboard">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'products' && renderProducts()}
        {activeTab === 'orders' && renderOrders()}
        {activeTab === 'analytics' && renderAnalytics()}
        {activeTab === 'category' && renderCategory()}
      </div>

      <Footer />
    </>
  );
}

export default FarmerDashboard;