-- Database schema for Leaf application - Farmer Dashboard

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS leaf;
USE leaf;

-- Users table (already exists, but including for reference)
CREATE TABLE IF NOT EXISTS user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role ENUM('consumer', 'farmer', 'delivery_agent', 'admin') NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    district VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default categories
INSERT IGNORE INTO categories (name, description) VALUES
('Vegetables', 'Fresh vegetables and greens'),
('Fruits', 'Fresh seasonal fruits'),
('Dairy', 'Dairy products including milk, cheese, yogurt');

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    farmer_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category_id INT NOT NULL,
    quantity_available INT NOT NULL DEFAULT 0,
    unit VARCHAR(50) NOT NULL DEFAULT 'kg',
    image_url VARCHAR(255),
    status ENUM('active', 'inactive', 'out_of_stock') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (farmer_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    INDEX idx_farmer_category (farmer_id, category_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'completed', 'cancelled') DEFAULT 'pending',
    total_amount DECIMAL(10, 2) NOT NULL,
    delivery_address TEXT,
    special_instructions TEXT,
    delivery_date DATE,
    delivery_time_slot VARCHAR(50),
    payment_method ENUM('cash_on_delivery', 'online') DEFAULT 'cash_on_delivery',
    payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES user(id) ON DELETE CASCADE,
    INDEX idx_customer_date (customer_id, order_date),
    INDEX idx_status (status),
    INDEX idx_order_date (order_date)
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit VARCHAR(50) NOT NULL,
    price_per_unit DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_order_product (order_id, product_id)
);

-- Sample data for testing (optional)
-- Insert sample farmer (password is 'password123' hashed with bcrypt)
INSERT IGNORE INTO user (role, full_name, email, phone_number, district, address, password) VALUES
('farmer', 'John Farmer', 'john.farmer@example.com', '077-1234567', 'Kandy', '123 Farm Street, Kandy', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Get the farmer ID for sample data
SET @farmer_id = (SELECT id FROM user WHERE email = 'john.farmer@example.com' AND role = 'farmer');

-- Insert sample products
INSERT IGNORE INTO products (farmer_id, name, description, price, category_id, quantity_available, unit, status) VALUES
(@farmer_id, 'Fresh Tomatoes', 'Organic red tomatoes, locally grown', 150.00, 1, 50, 'kg', 'active'),
(@farmer_id, 'Carrots', 'Fresh orange carrots', 120.00, 1, 30, 'kg', 'active'),
(@farmer_id, 'Fresh Milk', 'Pure cow milk from grass-fed cows', 200.00, 3, 20, 'liter', 'active'),
(@farmer_id, 'Mangoes', 'Sweet Alphonso mangoes', 300.00, 2, 25, 'kg', 'active');

-- Insert sample customer
INSERT IGNORE INTO user (role, full_name, email, phone_number, district, address, password) VALUES
('consumer', 'Jane Customer', 'jane.customer@example.com', '077-9876543', 'Colombo', '456 Main Street, Colombo 07', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Get customer ID for sample order
SET @customer_id = (SELECT id FROM user WHERE email = 'jane.customer@example.com' AND role = 'consumer');
SET @tomato_id = (SELECT id FROM products WHERE name = 'Fresh Tomatoes' AND farmer_id = @farmer_id);
SET @milk_id = (SELECT id FROM products WHERE name = 'Fresh Milk' AND farmer_id = @farmer_id);

-- Insert sample order
INSERT IGNORE INTO orders (customer_id, status, total_amount, delivery_address) VALUES
(@customer_id, 'pending', 500.00, '456 Main Street, Colombo 07');

-- Get order ID
SET @order_id = (SELECT id FROM orders WHERE customer_id = @customer_id LIMIT 1);

-- Insert sample order items
INSERT IGNORE INTO order_items (order_id, product_id, quantity, unit, price_per_unit, total_price) VALUES
(@order_id, @tomato_id, 2, 'kg', 150.00, 300.00),
(@order_id, @milk_id, 1, 'liter', 200.00, 200.00);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_farmer_status ON products(farmer_id, status);
CREATE INDEX IF NOT EXISTS idx_orders_status_date ON orders(status, order_date);
CREATE INDEX IF NOT EXISTS idx_user_role_email ON user(role, email);
