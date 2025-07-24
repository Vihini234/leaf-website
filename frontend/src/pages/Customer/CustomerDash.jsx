import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Navbar from '../../Components/Navbar/Navbar.jsx'
import Footer from '../../components/Footer/Footer'
import CategoryCard from '../../components/cards/CategoryCard';
import FlashDealCard from '../../components/cards/FlashDealCard';
import SeasonalOfferCard from '../../components/cards/SeasonalOfferCard';
import vegImg from '../../assets/images/vegetables.jpg';
import fruitImg from '../../assets/images/fruits.jpg';
import dairyImg from '../../assets/images/dairy.jpg';
import durianImage from '../../assets/images/duriyan1.jpg';
import carrotImage from '../../assets/images/carrot1.jpg';
import mangoImage from '../../assets/images/mango1.jpg';


import './CustomerDash.css';

function CustomerDash() {
      const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const handleLogoutClick = () => setShowLogoutModal(true);
  const confirmLogout = () => {
    setShowLogoutModal(false);
    navigate('/');
  };
  const cancelLogout = () => setShowLogoutModal(false);

  return (
    <>
      <Navbar isLoggedIn={true} />
      
      <div className="dashboard-layout">
        <aside className="sidebar">
          <div className="sidebar-header">
            <p>Consumer</p>
          </div>
          <nav className="sidebar-nav">
            <Link to="/pages/Customer/CustomerDash">🛍️ Home</Link>
            <Link to="/pages/Customer/Order">📦 Order List</Link>
            <Link to="/pages/Customer/OrderHistory">📦 Order History</Link>
            <Link to="/pages/Customer/CustomerProfile">👤 Profile</Link>
            <Link to="/settings">⚙️ Settings</Link>
            <button className="logout-button" onClick={handleLogoutClick}>🚪Logout</button>
          </nav>
        </aside>

        <main className="dashboard-main">
          <section className="dashboard-box">

            <div className="section-block">
              <h2>Shop by Category</h2>
              <div className="category-grid">
                <Link to="/pages/Categories/Vegetable"><CategoryCard title="Vegetables" image={vegImg} path="/Categories/Vegetables" /></Link>
                <Link to="/pages/Categories/Fruit"><CategoryCard title="Fruits" image={fruitImg} path="/Categories/Fruits" /></Link>
                <Link to="/pages/Categories/Dairy"><CategoryCard title="Dairy Products" image={dairyImg} path="/Categories/Dairy" /></Link>
              </div>
            </div>

            <div className="section-block">
              <h2>Flash Deals ⚡</h2>
              <div className="deals-grid">
                <Link to="/flash-deals"><FlashDealCard image={carrotImage} title="Fresh Carrots" price="Rs. 150 / kg" quantity="Deal ends in 2h 15m" /></Link>
                <Link to="/flash-deals"><FlashDealCard image={durianImage} title="Fresh Duriyans" price="Rs. 300 / kg" quantity="Deal ends in 2h 30m" /></Link>
                <Link to="/flash-deals"><FlashDealCard image={mangoImage} title="Fresh Mangoes" price="Rs. 200 / kg" quantity="Deal ends in 2h 30m" /></Link>
              </div>
            </div>

            <div className="section-block">
              <h2>Seasonal Offers 🌾</h2>
              <div className="seasonal-grid">
                <Link to="/seasonal-offers"><SeasonalOfferCard image={durianImage} title="Fresh Duriyans" price="Rs. 300 / kg" timer="Deal ends in 2h 30m" /></Link>
                <Link to="/seasonal-offers"><SeasonalOfferCard image={durianImage} title="Fresh Duriyans" price="Rs. 300 / kg" timer="Deal ends in 2h 30m"/></Link>
              </div>
            </div>
          </section>
        </main>
      </div>

      <Footer />
      {showLogoutModal && (
        <div className="logout-modal-overlay">
          <div className="logout-modal">
            <h3>Are you sure you want to log out?</h3>
            <div className="modal-buttons">
              <button className="yes-button" onClick={confirmLogout}>Yes</button>
              <button className="no-button" onClick={cancelLogout}>No</button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}

export default CustomerDash;