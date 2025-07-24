import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../../Components/Navbar/Navbar.jsx'
import Footer from '../../components/Footer/Footer'
import CategoryCard from '../../components/cards/CategoryCard'
import FlashDealCard from '../../components/cards/FlashDealCard';
import SeasonalOfferCard from '../../components/cards/SeasonalOfferCard';
import bannerImage1 from '../../assets/images/banner1.jpg';
import bannerImage2 from '../../assets/images/banner2.jpg';
import bannerImage3 from '../../assets/images/banner3.jpg';
import vegImg from '../../assets/images/vegetables.jpg';
import fruitImg from '../../assets/images/fruits.jpg';
import dairyImg from '../../assets/images/dairy.jpg';
import carrotImage from '../../assets/images/carrot1.jpg';
import durianImage from '../../assets/images/duriyan1.jpg';
 import mangoImage from '../../assets/images/mango1.jpg';
import LoginPromptModal from '../../components/LoginPromptModal/LoginPromptModal';
import './Home.css';

function Home() {

  const [showLoginModal, setShowLoginModal] = useState(false);
  const bannerImages = [bannerImage1, bannerImage2, bannerImage3];
  const [currentIndex, setCurrentIndex] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === bannerImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [bannerImages.length]);

  return (
    <>
      <Navbar onCategoryClick={() => setShowLoginModal(true)}
        onCartClick={() => setShowLoginModal(true)}
      />

      <section className="banner-section">
        <img
          src={bannerImages[currentIndex]}
          alt={`Banner ${currentIndex + 1}`}
          className="banner-image"
        />
        <div className="banner-text">
          <h2>{t('Fresh_from_our_farms')} 🍃</h2>
          <p>{t('discover_clean,_fair,_and_locally_grown_food_directly_from_Sri_Lankan_farmers.')}</p>
        </div>
      </section>

      <section className="category-section">
        <h3>{t('shop_by_category')}</h3>
        <div className="category-grid">
          <CategoryCard title={t('vegetables')} image={vegImg} onClick={() => setShowLoginModal(true)} />
          <CategoryCard title={t('fruits')} image={fruitImg} onClick={() => setShowLoginModal(true)} />
          <CategoryCard title={t('dairy_products')} image={dairyImg} onClick={() => setShowLoginModal(true)} />
        </div>
      </section>

      <section className="deals-section">
        <h3>{t('flash_deals')}⚡</h3>
        <div className="deals-grid">
          <FlashDealCard
            image={carrotImage}
            title="Fresh Carrots"
            price="Rs. 150 / kg"
            timer="Deal ends in 2h 15m"
            onClick={() => setShowLoginModal(true)} />
            <FlashDealCard
            image={durianImage}
            title="Fresh Carrots"
            price="Rs. 300 / kg"
            timer="Deal ends in 2h 30m"
            onClick={() => setShowLoginModal(true)} />
            <FlashDealCard
            image={mangoImage}
            title="Fresh Carrots"
            price="Rs. 200 / kg"
            timer="Deal ends in 2h 30m"
            onClick={() => setShowLoginModal(true)} />
        </div>
      </section>

      <section className="seasonal-section">
        <h3>{t('seasonal_offers')} 🌾</h3>
        <div className="seasonal-grid">
          <SeasonalOfferCard image={durianImage} title="Fresh Duriyans" price="Rs. 300 / kg" timer="Deal ends in 2h 30m" onClick={() => setShowLoginModal(true)} />
          <SeasonalOfferCard image={durianImage} title="Fresh Duriyans" price="Rs. 300 / kg" timer="Deal ends in 2h 30m" onClick={() => setShowLoginModal(true)} />

          <LoginPromptModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />

        </div>
      </section>

      <Footer />
    </>
  );
}

export default Home;