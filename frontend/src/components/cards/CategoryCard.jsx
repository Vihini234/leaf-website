import './CategoryCard.css';

function CategoryCard({ title, image, onClick }) {
  return (
    <div className="category-card" onClick={onClick}>
      <img src={image} alt={title} className="category-img" />
      <h4 className="category-title" >{title}</h4>
    </div>
  );
}

export default CategoryCard;