import { useTranslation } from 'react-i18next';
import './SeasonalOfferCard.css';

function SeasonalOfferCard({image, title, price, timer, onClick}) {
  const { t } = useTranslation();
  
    return (
    <div className="seasonal-card">
      <img src={image} alt={title} className="seasonal-image" />
      <div className="seasonal-info">
        <h4>{title}</h4>
        <p className="price">{price}</p>
        <p className="timer">⏰ {timer}</p>
        <button className="add-to-cart" onClick={onClick}>{t('add_to_cart')} 🛒</button>
      </div>
    </div>
  );
}

export default SeasonalOfferCard;