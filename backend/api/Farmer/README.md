# Farmer Dashboard Backend API

This backend provides comprehensive functionality for farmers to manage their products and orders in the Leaf marketplace.

## Setup Instructions

1. **Database Setup**
   - Import the database schema from `backend/database/schema.sql`
   - Update database credentials in `backend/config/db.php` if needed

2. **Server Requirements**
   - PHP 7.4 or higher
   - MySQL 5.7 or higher
   - Web server (Apache/Nginx)

## API Endpoints

### Base URL
```
http://localhost/backend/api/Farmer/
```

## 1. Dashboard Overview

### Get Dashboard Data
**Endpoint:** `dashboard.php`  
**Method:** `GET`  
**Parameters:**
- `farmer_id` (required): ID of the farmer
- `type` (optional): Specific data type to fetch

**Examples:**
```
GET dashboard.php?farmer_id=1
GET dashboard.php?farmer_id=1&type=profile
GET dashboard.php?farmer_id=1&type=stats
GET dashboard.php?farmer_id=1&type=categories
```

**Response:**
```json
{
  "success": true,
  "data": {
    "profile": {
      "id": 1,
      "full_name": "John Farmer",
      "email": "john.farmer@example.com",
      "phone_number": "077-1234567",
      "district": "Kandy",
      "address": "123 Farm Street, Kandy"
    },
    "stats": {
      "total_products": 15,
      "total_orders": 25,
      "pending_orders": 5,
      "monthly_revenue": 15000.00,
      "products_by_category": [
        {"category_name": "Vegetables", "product_count": 8},
        {"category_name": "Fruits", "product_count": 5},
        {"category_name": "Dairy", "product_count": 2}
      ],
      "recent_orders": [...]
    }
  }
}
```

## 2. Product Management

### Get Products
**Endpoint:** `products.php`  
**Method:** `GET`  
**Parameters:**
- `farmer_id` (required): ID of the farmer
- `category_id` (optional): Filter by category

**Examples:**
```
GET products.php?farmer_id=1
GET products.php?farmer_id=1&category_id=1
```

### Add Product
**Endpoint:** `products.php`  
**Method:** `POST`  
**Body:**
```json
{
  "farmer_id": 1,
  "name": "Fresh Tomatoes",
  "description": "Organic red tomatoes",
  "price": 150.00,
  "category_id": 1,
  "quantity_available": 50,
  "unit": "kg",
  "image_url": "path/to/image.jpg"
}
```

### Update Product
**Endpoint:** `products.php?id=1`  
**Method:** `PUT`  
**Body:**
```json
{
  "farmer_id": 1,
  "name": "Updated Product Name",
  "description": "Updated description",
  "price": 180.00,
  "category_id": 1,
  "quantity_available": 30,
  "unit": "kg",
  "image_url": "path/to/updated_image.jpg"
}
```

### Delete Product
**Endpoint:** `products.php?id=1&farmer_id=1`  
**Method:** `DELETE`

## 3. Order Management

### Get Orders
**Endpoint:** `orders.php`  
**Method:** `GET`  
**Parameters:**
- `farmer_id` (required): ID of the farmer
- `order_id` (optional): Get specific order details
- `stats` (optional): Get order statistics

**Examples:**
```
GET orders.php?farmer_id=1
GET orders.php?farmer_id=1&order_id=123
GET orders.php?farmer_id=1&stats=true
```

**Response (All Orders):**
```json
{
  "success": true,
  "data": [
    {
      "order_id": 123,
      "order_date": "2024-01-15 10:30:00",
      "order_status": "pending",
      "total_amount": 500.00,
      "customer_name": "Jane Customer",
      "phone_number": "077-9876543",
      "address": "456 Main Street, Colombo 07",
      "district": "Colombo",
      "product_list": "Tomatoes (2kg), Milk (1L)"
    }
  ]
}
```

### Update Order Status
**Endpoint:** `orders.php?order_id=123&farmer_id=1`  
**Method:** `PUT`  
**Body:**
```json
{
  "status": "confirmed"
}
```

**Valid Status Values:**
- `pending`
- `confirmed`
- `preparing`
- `ready`
- `completed`
- `cancelled`

## Error Handling

All endpoints return errors in the following format:
```json
{
  "success": false,
  "message": "Error description"
}
```

**Common HTTP Status Codes:**
- `200`: Success
- `400`: Bad Request (validation errors, missing parameters)
- `401`: Unauthorized
- `404`: Not Found
- `500`: Internal Server Error

## Frontend Integration

### React/JavaScript Example
```javascript
// Get farmer dashboard data
const fetchDashboardData = async (farmerId) => {
  try {
    const response = await fetch(`/backend/api/Farmer/dashboard.php?farmer_id=${farmerId}`);
    const data = await response.json();
    
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};

// Add new product
const addProduct = async (productData) => {
  try {
    const response = await fetch('/backend/api/Farmer/products.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData)
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message);
    }
    
    return data;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

// Update order status
const updateOrderStatus = async (orderId, farmerId, status) => {
  try {
    const response = await fetch(`/backend/api/Farmer/orders.php?order_id=${orderId}&farmer_id=${farmerId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status })
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message);
    }
    
    return data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};
```

## Security Features

1. **SQL Injection Prevention**: All queries use prepared statements
2. **CORS Headers**: Proper CORS configuration for frontend integration
3. **Input Validation**: Comprehensive validation for all inputs
4. **Error Handling**: Secure error messages without exposing sensitive information
5. **Authorization**: Farmer ID verification for all operations

## Testing

You can test the API endpoints using tools like:
- Postman
- curl commands
- Browser for GET requests

### Sample curl commands:
```bash
# Get dashboard data
curl "http://localhost/backend/api/Farmer/dashboard.php?farmer_id=1"

# Add product
curl -X POST "http://localhost/backend/api/Farmer/products.php" \
  -H "Content-Type: application/json" \
  -d '{"farmer_id":1,"name":"Test Product","price":100,"category_id":1,"quantity_available":10,"unit":"kg"}'

# Get orders
curl "http://localhost/backend/api/Farmer/orders.php?farmer_id=1"
```
