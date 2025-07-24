
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './i18n';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import Home from './Pages/Home/Home';
import CustomerDash from './pages/Customer/CustomerDash';
import FarmerDashboard from './pages/Farmer/FarmerDash';
import DeliveryDash from './pages/DeliveryAgent/DeliveryDash';
import FlashDealsPage from './pages/Customer/FlashDealsPage';
import SeasonalOffersPage from './pages/Customer/SeasonalOffersPage';
import Vegetable from './pages/Categories/Vegetable';
import Fruits from './pages/Categories/Fruit';
import DairyProducts from './pages/Categories/Dairy';
import CustomerRegister from './pages/Register/Customer/CustomerRegister';
import FarmerRegister from './pages/Register/Farmer/FarmerRegister';
import DeliverRegister from './pages/Register/DeliveryAgent/DeliveryRegister';
import CustomerProfile from './pages/Customer/CustomerProfile';
import LoginPage from './pages/Login/LoginPage';
import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy';
import Cart from './Pages/Cart/Cart';

<I18nextProvider i18n={i18n}>
  <App />
</I18nextProvider>


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pages/Customer/CustomerDash" element={<CustomerDash />} />
        <Route path="/pages/Farmer/FarmerDash" element={<FarmerDashboard />} />
        <Route path="/pages/DeliveryAgent/DeliveryDash" element={<DeliveryDash />} />
        <Route path="/flash-deals" element={<FlashDealsPage />} />
        <Route path="/seasonal-offers" element={<SeasonalOffersPage />} />
        <Route path="/pages/Categories/Vegetable" element={<Vegetable />} />
        <Route path="/pages/Categories/Fruit" element={<Fruits />} />
        <Route path="/pages/Categories/Dairy" element={<DairyProducts />} />
        <Route path="/Register/Customer" element={<CustomerRegister />} />
        <Route path="/Register/Farmer" element={<FarmerRegister />} />
        <Route path="/Register/DeliveryAgent" element={<DeliverRegister />} />
        <Route path="/pages/Customer/CustomerProfile" element={<CustomerProfile />} />
        <Route path="/pages/Login/LoginPage" element={<LoginPage />} />
        <Route path="/pages/Cart/Cart" element={<Cart/>} />
        <Route path="/pages/PrivacyPolicy/PrivacyPolicy" element={<PrivacyPolicy />} />
        {/* You can add more routes later like Login, Categories, etc. */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;