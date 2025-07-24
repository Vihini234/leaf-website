import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import logoImg from '../../assets/images/logo1.png'; // Adjust the path as necessary
import './Navbar.css';

// Import i18n for language change
function Navbar({ isLoggedIn = false, isFarmer = false, isDelivery = false, onCartClick = () => { }, onCategoryClick = () => { } }) {
  const [showCategories, setShowCategories] = useState(false);
  const [showRegisterOptions, setShowRegisterOptions] = useState(false);
  const { t } = useTranslation();

  return (
    <nav className="navbar">
      <div className="nav-left">
        <img src={logoImg} className="logo-img"></img>
      </div>

      <div className="nav-center">
        {!isFarmer && !isLoggedIn && !isDelivery && (
          <>
            <Link to="/">{t('home')}</Link>
            <div
              className="nav-dropdown"
              onClick={() => setShowCategories(true)}
              onMouseLeave={() => setShowCategories(false)}
            >
              <button className="dropdown-button">{t('categories')} ▾</button>
              {showCategories && (
                <div className="dropdown-menu">
                  <button onClick={onCategoryClick}>{t('vegetables')}</button>
                  <button onClick={onCategoryClick}>{t('fruits')}</button>
                  <button onClick={onCategoryClick}>{t('dairy_products')}</button>

                </div>
              )}
            </div>

            <div className="search-bar">
              <input type="text" placeholder="Search products..." className="search-bar input" />
              <button>🔍</button>
            </div>
          </>)}



        {!isFarmer && isLoggedIn && !isDelivery && (
          <>

            <div
              className="nav-dropdown"
              onClick={() => setShowCategories(true)}
              onMouseLeave={() => setShowCategories(false)}
            >
              <button className="dropdown-button">{t('categories')} ▾</button>
              {showCategories && (
                <div className="dropdown-menu">
                  <Link to="/pages/Categories/Vegetable">{t('vegetables')}</Link>
                  <Link to="/Categories/Fruits">{t('fruits')}</Link>
                  <Link to="/Categories/Dairy">{t('dairy_products')}</Link>
                </div>
              )}
            </div>

            <div className="search-bar">
              <input type="text" placeholder="Search products..." className="search-bar input" />
              <button>🔍</button>
            </div>
          </>
        )}
        {isFarmer && (
          <>
            <Link to="/pages/Farmer/FarmerDash">{t('home')}</Link>
            {/* No categories or search bar for farmers */}
          </>
        )}
        {isDelivery && (
          <>
            <Link to="/pages/DeliveryAgent/DeliveryDash">{t('home')}</Link>
            {/* No categories or search bar for delivery agents */}
          </>
        )}

      </div>

      <div className="nav-right">
        {!isFarmer && !isDelivery &&
          <button className="cart-icon" onClick={() => {
            if (isLoggedIn) {
              window.location.href = "/pages/Cart/Cart"; // Navigate to cart page
            } else {
              onCartClick(); // trigger popup from parent
            }
          }}>
            🛒
          </button>

        }

        {!isFarmer && !isLoggedIn && !isDelivery && (
          <>
            <div
              className="nav-dropdown"
              onClick={() => setShowRegisterOptions(true)}
              onMouseLeave={() => setShowRegisterOptions(false)}
            >
              <button className="dropdown-button">{t('register')} ▾</button>
              {showRegisterOptions && (
                <div className="dropdown-menu">
                  <Link to="/Register/Farmer">{t('farmer')}</Link>
                  <Link to="/Register/Customer">{t('customer')}</Link>
                  <Link to="/Register/DeliveryAgent">{t('delivery_agent')}</Link>
                </div>
              )}
            </div>

            <Link to="/pages/Login/LoginPage" className="dropdown-button">{t('login')} ▾</Link>


            {/* <select className="language-selector" onChange={(e) => i18n.changeLanguage(e.target.value)}>
              <option value="en">🌐 English</option>
              <option value="si">සිංහල</option>
              <option value="ta">தமிழ்</option>
            </select> */}
          </>
        )}


        {/* {isLoggedIn && (
          <select className="language-selector" onChange={(e) => i18n.changeLanguage(e.target.value)}>
            <option value="en">🌐 English</option>
            <option value="si">සිංහල</option>
            <option value="ta">தமிழ்</option>
          </select>
        )} */}

        <div id="google_translate_element"></div>


      </div>
    </nav>

  );
}

export default Navbar;