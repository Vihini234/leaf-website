# Farmer Dashboard Backend API

This backend system provides comprehensive functionality for the Leaf farmer dashboard.

## 🚀 Quick Start

### 1. Start the Backend Server
```bash
cd backend
php -S localhost:8000
```

### 2. Test API Endpoints
```bash
# Test Dashboard Stats
curl "http://localhost:8000/api/Farmer/dashboard.php?farmer_id=1&type=stats"

# Test Products
curl "http://localhost:8000/api/Farmer/products_mock.php?farmer_id=1"

# Test Orders
curl "http://localhost:8000/api/Farmer/orders_mock.php?farmer_id=1"
```

## 📋 API Endpoints

### Dashboard Statistics
- **URL:** `/api/Farmer/dashboard.php`
- **Method:** `GET`
- **Parameters:** 
  - `farmer_id` (required)
  - `type` (optional): `stats`, `profile`, or `all`

**Example Response:**
```json
{
  "success": true,
  "data": {
    "total_products": 3,
    "total_orders": 3,
    "pending_orders": 2,
    "monthly_revenue": 320,
    "products_by_category": [...],
    "recent_orders": [...]
  }
}
```

### Products Management
- **URL:** `/api/Farmer/products_mock.php`
- **Methods:** `GET`, `POST`, `PUT`, `DELETE`

**GET Products:**
```bash
GET /api/Farmer/products_mock.php?farmer_id=1
GET /api/Farmer/products_mock.php?farmer_id=1&category_id=2
```

**Add Product:**
```bash
POST /api/Farmer/products_mock.php
{
  "farmer_id": 1,
  "name": "Fresh Spinach",
  "description": "Organic spinach leaves",
  "price": 80.00,
  "category_id": 2,
  "quantity_available": 20,
  "unit": "kg"
}
```

### Orders Management
- **URL:** `/api/Farmer/orders_mock.php`
- **Methods:** `GET`, `PUT`

**GET Orders:**
```bash
GET /api/Farmer/orders_mock.php?farmer_id=1
GET /api/Farmer/orders_mock.php?farmer_id=1&stats=true
GET /api/Farmer/orders_mock.php?farmer_id=1&order_id=#1023
```

**Update Order Status:**
```bash
PUT /api/Farmer/orders_mock.php?order_id=#1023&farmer_id=1
{
  "status": "confirmed"
}
```

## 🔧 Frontend Integration

The React frontend automatically connects to these endpoints. Make sure both servers are running:

1. **Backend:** `http://localhost:8000` (PHP server)
2. **Frontend:** `http://localhost:5175` (Vite dev server)

## 📊 Sample Data

The backend includes realistic sample data:

### Products:
- Red Rice (Grains) - Rs. 150.99/kg
- Organic Tomatoes (Vegetables) - Rs. 320.99/kg  
- Fresh Carrots (Vegetables) - Rs. 150.99/kg

### Orders:
- #1023 - Sanduni Perera (Pending)
- #1024 - Kasun Fernando (Confirmed)
- #1025 - Nimal Silva (Completed)

## 🔍 Testing

### Manual Testing:
1. Open browser to `http://localhost:8000/api/Farmer/dashboard.php?farmer_id=1`
2. Check that JSON response is returned
3. Navigate to `http://localhost:5175/pages/Farmer/FarmerDash`
4. Verify dashboard loads with data

### API Testing with curl:
```bash
# Test all endpoints
curl "http://localhost:8000/api/Farmer/dashboard.php?farmer_id=1&type=stats"
curl "http://localhost:8000/api/Farmer/products_mock.php?farmer_id=1"
curl "http://localhost:8000/api/Farmer/orders_mock.php?farmer_id=1"
```

## 🔄 CORS Configuration

All endpoints include proper CORS headers for frontend integration:
```php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
```

## 📱 Status Codes

- `200` - Success
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

## 🚦 Next Steps

1. **Database Integration:** Replace mock data with actual database queries
2. **Authentication:** Add JWT or session-based authentication
3. **File Upload:** Implement image upload for products
4. **Real-time Updates:** Add WebSocket support for live order updates
5. **Performance:** Add caching and query optimization

## 🛠️ Troubleshooting

### Backend not responding:
```bash
# Check if PHP server is running
netstat -an | grep :8000

# Restart PHP server
cd backend
php -S localhost:8000
```

### CORS errors:
- Ensure backend server is running on port 8000
- Check browser console for specific CORS error messages
- Verify frontend is making requests to correct URL

### Data not loading:
- Check browser Network tab for API request status
- Verify API endpoints return valid JSON
- Check console for JavaScript errors
