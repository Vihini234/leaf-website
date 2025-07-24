import Navbar from '../../Components/Navbar/Navbar.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import { Link } from 'react-router-dom';
import './CustomerProfile.css';

function CustomerProfile() {
  return (
    <>
      <Navbar isLoggedIn={true} />
      <div className="dashboard-layout">
        <aside className="sidebar">
          <div className="sidebar-header">
            <p className="role-label">Consumer</p>
          </div>
          <nav className="sidebar-nav">
            <Link to="/pages/Customer/CustomerDash">🛍️ Home</Link>
            <Link to="/pages/Customer/Order">📦 Order List</Link>
            <Link to="/pages/Customer/OrderHistory">📦 Order History</Link>
            <Link to="/pages/Customer/CustomerProfile">👤 Profile</Link>
            <Link to="/settings">⚙️ Settings</Link>
          </nav>
        </aside>

        <main className="profile-main">
          <h2 className="profile-heading">👤 Your Profile</h2>
          <div className="profile-card">
        <p>Name: Aruna Ranathunga</p>
        <p>Email: aruna@gmail.com</p>
        <p>Phone Number: 0771234567</p>
        <p>District: Badulla</p>
        <p>Address: No. 81, Badulusirigama, Badulla</p>
        <button className="edit-profile-btn">Edit Profile</button>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
export default CustomerProfile;