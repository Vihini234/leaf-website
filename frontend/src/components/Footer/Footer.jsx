import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} LEAF — Local Eco Agriculture & Farmers</p>
      <div className="footer-links">
        <Link to="/terms">Terms & Conditions</Link>
        <Link to="/about">About Us</Link>
        <Link to="/contact">Contact Us</Link>
        <Link to="/pages/PrivacyPolicy/PrivacyPolicy">Privacy Policy</Link>
      </div>
    </footer>
  );
}

export default Footer;