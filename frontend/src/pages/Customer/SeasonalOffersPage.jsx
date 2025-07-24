import SeasonalOfferCard from '../../components/cards/SeasonalOfferCard';
import Navbar from '../../Components/Navbar/Navbar.jsx'
import Footer from '../../components/Footer/Footer'
import durianImage from '../../assets/images/duriyan1.jpg';
import mangoImage from '../../assets/images/mango1.jpg';
import './SeasonalOffersPage.css';

function SeasonalOffersPage() {
  return (
    <>
      <Navbar isLoggedIn={true} />
      <div className="flash-deals-page">
        <h2>🌾 Seasonal Offers Just for You</h2>
        <SeasonalOfferCard 
        image={durianImage}
                    title="Fresh Durians"
                    price="Rs. 300 / kg"/>
        <SeasonalOfferCard 
        image={mangoImage}
                    title="Fresh Durians"
                    price="Rs. 300 / kg" />
      </div>
      <Footer />
    </>
  );
}
export default SeasonalOffersPage;