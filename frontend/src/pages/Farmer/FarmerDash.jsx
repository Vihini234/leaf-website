import Navbar from '../../Components/Navbar/Navbar.jsx'
import Footer from '../../components/Footer/Footer'
import CategoryCard from '../../components/cards/CategoryCard';
import vegImg from '../../assets/images/vegetables.jpg';
import fruitImg from '../../assets/images/fruits.jpg';
import dairyImg from '../../assets/images/dairy.jpg';
import './FarmerDash.css';

function FarmerDashboard() {
  return (
    <>
      <Navbar isLoggedIn={true} isFarmer={true} />

      <section className="farmer-section">
        <h2>Your Products by Category 🌱</h2>
        <div className="category-grid">
          <CategoryCard title="Vegetables" image={vegImg} path="/farmer/products/vegetables" />
          <CategoryCard title="Fruits" image={fruitImg} path="/farmer/products/fruits" />
          <CategoryCard title="Dairy" image={dairyImg} path="/farmer/products/dairy" />
        </div>
      </section>

      <section className="orders-section">
        <h2>Orders List 📦</h2>
        <div className="orders-table">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer Name</th>
                <th>Address</th>
                <th>Phone Number</th>
                <th>Product List</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#1023</td>
                <td>Sanduni Perera</td>
                <td>Colombo 07</td>
                <td>077-1234567</td>
                <td>Tomatoes (2kg), Milk (1L)</td>
              </tr>
              <tr>
                <td>#1024</td>
                <td>Kasun Fernando</td>
                <td>Kandy</td>
                <td>071-7896541</td>
                <td>Pumpkin (3kg), Yogurt (500ml)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default FarmerDashboard;