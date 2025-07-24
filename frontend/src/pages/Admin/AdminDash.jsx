import React, { useState } from 'react';
import './AdminDash.css'; // Assuming you have a CSS file for styling
import { 
  Users, 
  UserCheck, 
  Truck, 
  Settings, 
  BarChart3, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Sample data
  const dashboardStats = {
    totalFarmers: 156,
    totalCustomers: 1243,
    totalDeliveryAgents: 45,
    activeDeliveries: 89,
    pendingApprovals: 12,
    totalRevenue: 'Rs. 2,450,000'
  };

  const farmers = [
    {
      id: 'F001',
      name: 'Sunil Perera',
      email: 'sunil@gmail.com',
      phone: '+94 77 123 4567',
      location: 'Kandy',
      joinDate: '2024-01-15',
      status: 'active',
      productsCount: 25,
      rating: 4.8,
      totalEarnings: 'Rs. 125,000'
    },
    {
      id: 'F002',
      name: 'Kamala Silva',
      email: 'kamala.silva@gmail.com',
      phone: '+94 71 234 5678',
      location: 'Nuwara Eliya',
      joinDate: '2024-02-20',
      status: 'pending',
      productsCount: 18,
      rating: 4.6,
      totalEarnings: 'Rs. 85,000'
    },
    {
      id: 'F003',
      name: 'Ranjan Fernando',
      email: 'ranjan.f@yahoo.com',
      phone: '+94 76 345 6789',
      location: 'Matale',
      joinDate: '2023-11-10',
      status: 'active',
      productsCount: 42,
      rating: 4.9,
      totalEarnings: 'Rs. 198,000'
    },
    {
      id: 'F004',
      name: 'Priya Jayawardena',
      email: 'priya.j@gmail.com',
      phone: '+94 78 456 7890',
      location: 'Badulla',
      joinDate: '2024-03-05',
      status: 'suspended',
      productsCount: 12,
      rating: 3.2,
      totalEarnings: 'Rs. 32,000'
    }
  ];

  const customers = [
    {
      id: 'C001',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@gmail.com',
      phone: '+94 77 987 6543',
      location: 'Colombo 07',
      joinDate: '2024-01-20',
      status: 'active',
      ordersCount: 23,
      totalSpent: 'Rs. 45,600',
      lastOrder: '2024-07-20'
    },
    {
      id: 'C002',
      name: 'Michael Chen',
      email: 'michael.chen@hotmail.com',
      phone: '+94 71 876 5432',
      location: 'Colombo 03',
      joinDate: '2024-02-15',
      status: 'active',
      ordersCount: 15,
      totalSpent: 'Rs. 28,900',
      lastOrder: '2024-07-18'
    },
    {
      id: 'C003',
      name: 'Anil Rajapakse',
      email: 'anil.raj@gmail.com',
      phone: '+94 76 765 4321',
      location: 'Galle',
      joinDate: '2023-12-08',
      status: 'inactive',
      ordersCount: 8,
      totalSpent: 'Rs. 12,300',
      lastOrder: '2024-05-22'
    },
    {
      id: 'C004',
      name: 'Lisa Wong',
      email: 'lisa.wong@yahoo.com',
      phone: '+94 78 654 3210',
      location: 'Kandy',
      joinDate: '2024-03-12',
      status: 'active',
      ordersCount: 31,
      totalSpent: 'Rs. 67,800',
      lastOrder: '2024-07-21'
    }
  ];

  const deliveryAgents = [
    {
      id: 'DA001',
      name: 'Kasun Bandara',
      email: 'kasun.bandara@leafdelivery.com',
      phone: '+94 77 111 2222',
      location: 'Colombo',
      joinDate: '2024-01-10',
      status: 'active',
      completedDeliveries: 156,
      rating: 4.7,
      vehicleType: 'Motorcycle',
      currentLoad: 3
    },
    {
      id: 'DA002',
      name: 'Nuwan Kumara',
      email: 'nuwan.k@leafdelivery.com',
      phone: '+94 71 222 3333',
      location: 'Kandy',
      joinDate: '2024-02-05',
      status: 'busy',
      completedDeliveries: 89,
      rating: 4.5,
      vehicleType: 'Van',
      currentLoad: 8
    },
    {
      id: 'DA003',
      name: 'Chamara Rathnayake',
      email: 'chamara.r@leafdelivery.com',
      phone: '+94 76 333 4444',
      location: 'Galle',
      joinDate: '2023-11-15',
      status: 'offline',
      completedDeliveries: 234,
      rating: 4.9,
      vehicleType: 'Truck',
      currentLoad: 0
    },
    {
      id: 'DA004',
      name: 'Dilshan Perera',
      email: 'dilshan.p@leafdelivery.com',
      phone: '+94 78 444 5555',
      location: 'Negombo',
      joinDate: '2024-03-20',
      status: 'active',
      completedDeliveries: 45,
      rating: 4.3,
      vehicleType: 'Motorcycle',
      currentLoad: 2
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { class: 'status-active', label: 'Active' },
      inactive: { class: 'status-inactive', label: 'Inactive' },
      pending: { class: 'status-pending', label: 'Pending' },
      suspended: { class: 'status-suspended', label: 'Suspended' },
      busy: { class: 'status-busy', label: 'Busy' },
      offline: { class: 'status-offline', label: 'Offline' }
    };
    
    const config = statusConfig[status] || { class: 'status-default', label: status };
    return <span className={`status-badge ${config.class}`}>{config.label}</span>;
  };

  const renderOverview = () => (
    <div className="overview-section">
      <div className="overview-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <div className="header-actions">
          <button className="btn btn-primary">
            <Plus size={16} />
            Generate Report
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon farmers">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{dashboardStats.totalFarmers}</div>
            <div className="stat-label">Total Farmers</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon customers">
            <UserCheck size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{dashboardStats.totalCustomers}</div>
            <div className="stat-label">Total Customers</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon agents">
            <Truck size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{dashboardStats.totalDeliveryAgents}</div>
            <div className="stat-label">Delivery Agents</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon deliveries">
            <Activity size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{dashboardStats.activeDeliveries}</div>
            <div className="stat-label">Active Deliveries</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon approvals">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{dashboardStats.pendingApprovals}</div>
            <div className="stat-label">Pending Approvals</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon revenue">
            <BarChart3 size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{dashboardStats.totalRevenue}</div>
            <div className="stat-label">Total Revenue</div>
          </div>
        </div>
      </div>

      <div className="recent-activities">
        <h2 className="section-title">Recent Activities</h2>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon success">
              <CheckCircle size={16} />
            </div>
            <div className="activity-content">
              <div className="activity-text">New farmer "Sunil Perera" registered</div>
              <div className="activity-time">2 hours ago</div>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon warning">
              <AlertTriangle size={16} />
            </div>
            <div className="activity-content">
              <div className="activity-text">Delivery agent "Kasun Bandara" reported issue</div>
              <div className="activity-time">4 hours ago</div>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon info">
              <Users size={16} />
            </div>
            <div className="activity-content">
              <div className="activity-text">Customer "Sarah Johnson" placed large order</div>
              <div className="activity-time">6 hours ago</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUserTable = (users, type) => (
    <div className="users-section">
      <div className="section-header">
        <h1 className="page-title">Manage {type}</h1>
        <div className="header-controls">
          <div className="search-bar">
            <Search size={16} />
            <input 
              type="text" 
              placeholder={`Search ${type.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>
          <button className="btn btn-primary">
            <Plus size={16} />
            Add New {type.slice(0, -1)}
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Contact</th>
              <th>Location</th>
              <th>Join Date</th>
              <th>Status</th>
              {type === 'Farmers' && <th>Products</th>}
              {type === 'Customers' && <th>Orders</th>}
              {type === 'Delivery Agents' && <th>Deliveries</th>}
              <th>Rating/Spent</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td className="user-id">{user.id}</td>
                <td>
                  <div className="user-info">
                    <div className="user-name">{user.name}</div>
                    <div className="user-email">{user.email}</div>
                  </div>
                </td>
                <td>
                  <div className="contact-info">
                    <div className="phone">
                      <Phone size={12} />
                      {user.phone}
                    </div>
                  </div>
                </td>
                <td>
                  <div className="location">
                    <MapPin size={12} />
                    {user.location}
                  </div>
                </td>
                <td>{user.joinDate}</td>
                <td>{getStatusBadge(user.status)}</td>
                {type === 'Farmers' && <td>{user.productsCount}</td>}
                {type === 'Customers' && <td>{user.ordersCount}</td>}
                {type === 'Delivery Agents' && <td>{user.completedDeliveries}</td>}
                <td>
                  {type === 'Farmers' && (
                    <div>
                      <div className="rating">★ {user.rating}</div>
                      <div className="earnings">{user.totalEarnings}</div>
                    </div>
                  )}
                  {type === 'Customers' && (
                    <div>
                      <div className="spent">{user.totalSpent}</div>
                      <div className="last-order">Last: {user.lastOrder}</div>
                    </div>
                  )}
                  {type === 'Delivery Agents' && (
                    <div>
                      <div className="rating">★ {user.rating}</div>
                      <div className="vehicle">{user.vehicleType}</div>
                    </div>
                  )}
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon" title="View Details">
                      <Eye size={14} />
                    </button>
                    <button className="btn-icon" title="Edit">
                      <Edit size={14} />
                    </button>
                    <button className="btn-icon danger" title="Delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'farmers', label: 'Farmers', icon: Users },
    { id: 'customers', label: 'Customers', icon: UserCheck },
    { id: 'agents', label: 'Delivery Agents', icon: Truck },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="admin-dashboard">
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">🌱</div>
            <span className="logo-text">LEAF Admin</span>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          {navigationItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="main-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'farmers' && renderUserTable(farmers, 'Farmers')}
        {activeTab === 'customers' && renderUserTable(customers, 'Customers')}
        {activeTab === 'agents' && renderUserTable(deliveryAgents, 'Delivery Agents')}
        {activeTab === 'settings' && (
          <div className="settings-section">
            <h1 className="page-title">System Settings</h1>
            <div className="settings-grid">
              <div className="setting-card">
                <h3>User Management</h3>
                <p>Configure user roles and permissions</p>
                <button className="btn btn-secondary">Configure</button>
              </div>
              <div className="setting-card">
                <h3>Delivery Settings</h3>
                <p>Set delivery zones and pricing</p>
                <button className="btn btn-secondary">Configure</button>
              </div>
              <div className="setting-card">
                <h3>Payment Settings</h3>
                <p>Manage payment gateways</p>
                <button className="btn btn-secondary">Configure</button>
              </div>
              <div className="setting-card">
                <h3>Notifications</h3>
                <p>Configure system notifications</p>
                <button className="btn btn-secondary">Configure</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;