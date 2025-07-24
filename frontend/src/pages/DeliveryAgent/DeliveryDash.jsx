import React, { useState, useEffect } from 'react';
import Navbar from '../../Components/Navbar/Navbar.jsx'
import Footer from '../../components/Footer/Footer'
import { Truck, CheckCircle, Clock, Package, Phone, MapPin, User, Eye } from 'lucide-react';
import './DeliveryDash.css';

const DeliveryDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const dashboardStats = {
        activeDeliveries: 12,
        completedToday: 5,
        pendingPickup: 3,
        inTransit: 8
    };

    const activeDeliveries = [
        {
            id: 'DEL-001',
            customer: 'John Smith',
            status: 'IN PROGRESS',
            pickup: 'Colombo 07',
            delivery: 'Kandy',
            timeWindow: '2:30 PM - 4:00 PM',
            priority: 'High',
            eta: '3h 25 mins',
            phone: '+94 77 123 4567'
        },
        {
            id: 'DEL-002',
            customer: 'Sarah Johnson',
            status: 'COMPLETED',
            pickup: 'Negombo',
            delivery: 'Galle',
            timeWindow: '10:00 AM - 12:00 PM',
            priority: 'Medium',
            eta: 'Delivered',
            phone: '+94 71 987 6543'
        },
        {
            id: 'DEL-003',
            customer: 'Mike Wilson',
            status: 'PENDING',
            pickup: 'Colombo 03',
            delivery: 'Matara',
            timeWindow: '5:00 PM - 7:00 PM',
            priority: 'High',
            eta: '2h 15 mins',
            phone: '+94 76 555 0123'
        }
    ];

    const deliveryHistory = [
        {
            id: 'DEL-098',
            customer: 'Emma Davis',
            pickup: 'Colombo 05',
            delivery: 'Jaffna',
            completedAt: '2024-07-21 4:30 PM',
            priority: 'Medium',
            duration: '6h 45m'
        },
        {
            id: 'DEL-097',
            customer: 'Robert Brown',
            pickup: 'Mount Lavinia',
            delivery: 'Trincomalee',
            completedAt: '2024-07-21 2:15 PM',
            priority: 'Low',
            duration: '5h 20m'
        },
        {
            id: 'DEL-096',
            customer: 'Lisa Anderson',
            pickup: 'Dehiwala',
            delivery: 'Anuradhapura',
            completedAt: '2024-07-21 11:45 AM',
            priority: 'High',
            duration: '4h 30m'
        }
    ];

    const StatCard = ({ icon: Icon, number, label, colorClass }) => (
        <div className="stat-card">
            <div className="stat-card-content">
                <div>
                    <div className={`stat-number ${colorClass}`}>{number}</div>
                    <div className="stat-label">{label}</div>
                </div>
                <Icon className={`stat-icon ${colorClass}`} />
            </div>
        </div>
    );


    const DeliveryCard = ({ delivery }) => {
        const getStatusClass = (status) => {
            switch (status) {
                case 'IN PROGRESS': return 'status-in-progress';
                case 'COMPLETED': return 'status-completed';
                case 'PENDING': return 'status-pending';
                default: return 'status-default';
            }
        };

        const getPriorityClass = (priority) => {
            switch (priority) {
                case 'High': return 'priority-high';
                case 'Medium': return 'priority-medium';
                case 'Low': return 'priority-low';
                default: return 'priority-default';
            }
        };

        return (
            <div className="delivery-card">
                <div className="delivery-card-header">
                    <div>
                        <h3 className="delivery-title">Delivery {delivery.id}</h3>
                        <p className="delivery-customer">Customer: {delivery.customer}</p>
                    </div>
                    <span className={`status-badge ${getStatusClass(delivery.status)}`}>
                        {delivery.status}
                    </span>
                </div>

                <div className="delivery-details-grid">
                    <div>
                        <h4 className="section-title">PICKUP</h4>
                        <p className="section-content">{delivery.pickup}</p>

                        <h4 className="section-title">DELIVERY WINDOW</h4>
                        <p className="section-content">{delivery.timeWindow}</p>

                        <div className="info-row eta">
                            <Clock className="info-icon" />
                            <span className="info-text">{delivery.eta}</span>
                        </div>

                        <div className="info-row phone">
                            <Phone className="info-icon" />
                            <span className="info-text">{delivery.phone}</span>
                        </div>
                    </div>

                    <div>
                        <h4 className="section-title">DELIVERY</h4>
                        <p className="section-content">{delivery.delivery}</p>

                        <h4 className="section-title">PRIORITY</h4>
                        <p className={`priority-text ${getPriorityClass(delivery.priority)}`}>{delivery.priority}</p>
                    </div>
                </div>

                <div className="action-buttons">
                    <button className="btn btn-green">
                        Call Customer
                    </button>
                    <button className="btn btn-blue">
                        View Details
                    </button>
                    {delivery.status === 'IN PROGRESS' && (
                        <button className="btn btn-yellow">
                            Mark Completed
                        </button>
                    )}
                </div>
            </div>
        );
    };

    const HistoryCard = ({ delivery }) => (
        <div className="history-card">
            <div className="history-header">
                <div>
                    <h3 className="history-title">Delivery {delivery.id}</h3>
                    <p className="history-customer">{delivery.customer}</p>
                </div>
                <span className="completion-time">{delivery.completedAt}</span>
            </div>

            <div className="history-details">
                <div>
                    <span className="history-label">From:</span>
                    <p className="history-value">{delivery.pickup}</p>
                </div>
                <div>
                    <span className="history-label">To:</span>
                    <p className="history-value">{delivery.delivery}</p>
                </div>
            </div>

            <div className="history-footer">
                <span className="duration">Duration: <span className="duration-value">{delivery.duration}</span></span>
                <span className={`priority-badge ${delivery.priority === 'High' ? 'priority-high' : delivery.priority === 'Medium' ? 'priority-medium' : 'priority-low'}`}>
                    {delivery.priority}
                </span>
            </div>
        </div>
    );

    const agent = {
        name: "Tharindu Perera",
        email: "tharindu@leaf.lk",
        phone: "0771234567",
        district: "Colombo",
        address: "123 Leaf Street, Colombo 07",
        vehicle: "Van",
        licensenumber: "CL-1234",
        profilePicture: "https://via.placeholder.com/150"
    };

    return (
        <>
            <Navbar isLoggedIn={true} isDelivery={true} />
            <div className="dashboard-container">
                <div className="dashboard-layout">
                    {/* Sidebar */}
                    <div className="sidebar">

                        <div className="sidebar-header">
                            <p>Delivery Agent</p>
                        </div>
                        <nav className="sidebar-nav">
                            <button
                                onClick={() => setActiveTab('dashboard')}
                                className={`nav-button ${activeTab === 'dashboard' ? 'nav-active' : ''}`}
                            >
                                <Package className="nav-icon" />
                                Dashboard
                            </button>
                            <button
                                onClick={() => setActiveTab('active')}
                                className={`nav-button ${activeTab === 'active' ? 'nav-active' : ''}`}
                            >
                                <Truck className="nav-icon" />
                                Active Deliveries
                            </button>
                            <button
                                onClick={() => setActiveTab('history')}
                                className={`nav-button ${activeTab === 'history' ? 'nav-active' : ''}`}
                            >
                                <Clock className="nav-icon" />
                                History
                            </button>
                            <button
                                onClick={() => setActiveTab('settings')}
                                className={`nav-button ${activeTab === 'settings' ? 'nav-active' : ''}`}
                            >
                                <User className="nav-icon" />
                                Settings
                            </button>
                        </nav>
                    </div>
                    {activeTab === 'profile' && (
                        <div className="profile-section">
                            <h3 className="section-title">Agent Profile</h3>
                            <div className="profile-card">
                                <img src={agent.profilePicture} alt="Profile" className="profile-picture" />
                                <p><strong>Name:</strong> {agent.name}</p>
                                <p><strong>Email:</strong> {agent.email}</p>
                                <p><strong>Phone:</strong> {agent.phone}</p>
                                <p><strong>District:</strong> {agent.district}</p>
                                <p><strong>Address:</strong> {agent.address}</p>
                                <p><strong>Vehicle:</strong> {agent.vehicle}</p>
                                <p><strong>License Number:</strong> {agent.licensenumber}</p>
                                <button className="btn btn-green">Edit Profile</button>
                            </div>
                        </div>
                    )}

                    <div className="main-content">
                        <div className="main-header">
                            <h2 className="page-title">
                                {activeTab === 'dashboard' && 'Delivery Dashboard'}
                                {activeTab === 'active' && 'Active Deliveries'}
                                {activeTab === 'history' && 'Delivery History'}
                                {activeTab === 'settings' && 'Settings'}
                            </h2>
                            <div className="header-info">
                                <p className="last-updated">Last updated: {currentTime.toLocaleTimeString()}</p>
                                <div className="user-profile" onClick={() => setActiveTab('profile')} title="View Profile">
                                    👤
                                </div>
                            </div>
                        </div>

                        {activeTab === 'dashboard' && (
                            <>
                                <div className="stats-grid">
                                    <StatCard
                                        icon={Truck}
                                        number={dashboardStats.activeDeliveries}
                                        label="Active Deliveries"
                                        colorClass="text-blue"
                                    />
                                    <StatCard
                                        icon={CheckCircle}
                                        number={dashboardStats.completedToday}
                                        label="Completed Today"
                                        colorClass="text-green"
                                    />
                                    <StatCard
                                        icon={Clock}
                                        number={dashboardStats.pendingPickup}
                                        label="Pending Pickup"
                                        colorClass="text-yellow"
                                    />
                                    <StatCard
                                        icon={Package}
                                        number={dashboardStats.inTransit}
                                        label="In Transit"
                                        colorClass="text-purple"
                                    />
                                </div>

                                <div className="assignments-section">
                                    <div className="section-header">
                                        <h3 className="section-title">Active Delivery Assignments</h3>
                                        <button className="btn btn-green">
                                            View All
                                        </button>
                                    </div>
                                    <div className="assignments-list">
                                        {activeDeliveries.slice(0, 2).map((delivery) => (
                                            <DeliveryCard key={delivery.id} delivery={delivery} />
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab === 'active' && (
                            <div className="deliveries-list">
                                {activeDeliveries.map((delivery) => (
                                    <DeliveryCard key={delivery.id} delivery={delivery} />
                                ))}
                            </div>
                        )}

                        {activeTab === 'history' && (
                            <div className="history-section">
                                <div className="history-header-section">
                                    <p className="history-subtitle">Recent delivery history</p>
                                    <button className="btn btn-blue">
                                        Export Report
                                    </button>
                                </div>
                                {deliveryHistory.map((delivery) => (
                                    <HistoryCard key={delivery.id} delivery={delivery} />
                                ))}
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="settings-container">
                                <h3 className="settings-title">User Settings</h3>
                                <div className="settings-content">
                                    <div className="setting-group">
                                        <label className="setting-label">
                                            Notification Preferences
                                        </label>
                                        <div className="checkbox-group">
                                            <label className="checkbox-item">
                                                <input type="checkbox" className="checkbox" defaultChecked />
                                                <span className="checkbox-label">Email notifications</span>
                                            </label>
                                            <label className="checkbox-item">
                                                <input type="checkbox" className="checkbox" defaultChecked />
                                                <span className="checkbox-label">SMS alerts</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="setting-group">
                                        <label className="setting-label">
                                            Default Delivery Window
                                        </label>
                                        <select className="setting-select">
                                            <option>2 hours</option>
                                            <option>4 hours</option>
                                            <option>6 hours</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default DeliveryDashboard;