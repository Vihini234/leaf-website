import FlashDealCard from '../../components/cards/FlashDealCard';
import Navbar from '../../Components/Navbar/Navbar.jsx'
import Footer from '../../components/Footer/Footer'
import carrotImage from '../../assets/images/carrot1.jpg';
import durianImage from '../../assets/images/duriyan1.jpg';
 import mangoImage from '../../assets/images/mango1.jpg';
import './FlashDealsPage.css';


function FlashDealsPage() {
  return (
    <>
      <Navbar isLoggedIn={true} />
      <div className="flash-deals-page">
        <h2>🔥 Today’s Flash Deals</h2>
        <FlashDealCard
            image={carrotImage}
            title="Fresh Carrots"
            price="Rs. 150 / kg"
            timer="Deal ends in 2h 15m" />
        <FlashDealCard
            image={durianImage}
            title="Fresh Durians"
            price="Rs. 300 / kg"
            timer="Deal ends in 2h 30m" />
            <FlashDealCard
            image={mangoImage}
            title="Fresh Mangoes"
            price="Rs. 200 / kg"
            timer="Deal ends in 2h 30m" />
      </div>
      <Footer />
    </>
  );
}
export default FlashDealsPage;