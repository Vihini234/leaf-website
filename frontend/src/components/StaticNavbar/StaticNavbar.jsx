import { Link } from 'react-router-dom';
import logoImg from '../../assets/images/logo1.png'; // Adjust if needed
import './StaticNavbar.css';

function StaticNavbar() {
  return (
    <nav className="static-navbar">
      <div className="navbar-left">
        <img src={logoImg} alt="LEAF logo" className="logo-img" />
        <Link to="/" className='home-button'> Home</Link>
      </div>
    </nav>
  );
}

export default StaticNavbar;