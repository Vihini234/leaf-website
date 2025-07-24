
import { useTranslation } from 'react-i18next';
import './FlashDealCard.css';

function FlashDealCard({ image, title, price, quantity, onClick }) {
  const { t } = useTranslation();

  return (
    <div className="flash-deal-card">
      <img src={image} alt={title} className="deal-image" />
      <div className="deal-info">
        <h4>{title}</h4>
        <p className="price">{price}</p>
        <p className="timer">⏰ {quantity}</p>
        <button className="add-to-cart" onClick={onClick}>{t('add_to_cart')} 🛒</button>
      </div>
    </div>
  );
}

export default FlashDealCard;