<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle CORS preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include DB connection
include_once '../../config/db.php';

class CategoryProducts {
    private $conn;
    
    public function __construct($connection) {
        $this->conn = $connection;
    }
    
    // Get products by category for a farmer
    public function getProductsByCategory($farmerId, $categoryName) {
        try {
            $sql = "SELECT p.*, c.name as category_name 
                    FROM products p 
                    INNER JOIN categories c ON p.category_id = c.id 
                    WHERE p.farmer_id = ? AND LOWER(c.name) = LOWER(?) AND p.status = 'active'
                    ORDER BY p.created_at DESC";
            
            $stmt = $this->conn->prepare($sql);
            $stmt->bind_param("is", $farmerId, $categoryName);
            $stmt->execute();
            $result = $stmt->get_result();
            
            $products = [];
            while ($row = $result->fetch_assoc()) {
                $products[] = [
                    'id' => (int)$row['id'],
                    'name' => $row['name'],
                    'description' => $row['description'],
                    'price' => (float)$row['price'],
                    'quantity_available' => (int)$row['quantity_available'],
                    'unit' => $row['unit'],
                    'category_name' => $row['category_name'],
                    'image_url' => $row['image_url'],
                    'status' => $row['status'],
                    'created_at' => $row['created_at'],
                    'updated_at' => $row['updated_at']
                ];
            }
            
            $stmt->close();
            return $products;
            
        } catch (Exception $e) {
            throw new Exception("Error fetching products by category: " . $e->getMessage());
        }
    }
    
    // Get all categories with product counts for a farmer
    public function getCategoriesWithCounts($farmerId) {
        try {
            $sql = "SELECT c.id, c.name, c.description,
                           COUNT(p.id) as product_count,
                           SUM(CASE WHEN p.status = 'active' THEN 1 ELSE 0 END) as active_products
                    FROM categories c 
                    LEFT JOIN products p ON c.id = p.category_id AND p.farmer_id = ?
                    GROUP BY c.id, c.name, c.description
                    ORDER BY active_products DESC, c.name ASC";
            
            $stmt = $this->conn->prepare($sql);
            $stmt->bind_param("i", $farmerId);
            $stmt->execute();
            $result = $stmt->get_result();
            
            $categories = [];
            while ($row = $result->fetch_assoc()) {
                $categories[] = [
                    'id' => (int)$row['id'],
                    'name' => $row['name'],
                    'description' => $row['description'],
                    'product_count' => (int)$row['product_count'],
                    'active_products' => (int)$row['active_products']
                ];
            }
            
            $stmt->close();
            return $categories;
            
        } catch (Exception $e) {
            throw new Exception("Error fetching categories: " . $e->getMessage());
        }
    }
    
    // Add product to specific category
    public function addProductToCategory($farmerId, $categoryName, $productData) {
        try {
            // First get category ID
            $categorySql = "SELECT id FROM categories WHERE LOWER(name) = LOWER(?)";
            $categoryStmt = $this->conn->prepare($categorySql);
            $categoryStmt->bind_param("s", $categoryName);
            $categoryStmt->execute();
            $categoryResult = $categoryStmt->get_result();
            
            if ($categoryResult->num_rows === 0) {
                $categoryStmt->close();
                throw new Exception("Category not found: " . $categoryName);
            }
            
            $categoryId = $categoryResult->fetch_assoc()['id'];
            $categoryStmt->close();
            
            // Insert product
            $sql = "INSERT INTO products (farmer_id, name, description, price, category_id, quantity_available, unit, image_url, status, created_at) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', NOW())";
            
            $stmt = $this->conn->prepare($sql);
            $stmt->bind_param(
                "issdisss",
                $farmerId,
                $productData['name'],
                $productData['description'],
                $productData['price'],
                $categoryId,
                $productData['quantity_available'],
                $productData['unit'],
                $productData['image_url'] ?? ''
            );
            
            if (!$stmt->execute()) {
                throw new Exception("Failed to add product: " . $this->conn->error);
            }
            
            $productId = $this->conn->insert_id;
            $stmt->close();
            
            return $productId;
            
        } catch (Exception $e) {
            throw new Exception("Error adding product to category: " . $e->getMessage());
        }
    }
    
    // Update product in category
    public function updateProductInCategory($farmerId, $productId, $productData) {
        try {
            $sql = "UPDATE products 
                    SET name = ?, description = ?, price = ?, quantity_available = ?, 
                        unit = ?, image_url = ?, updated_at = NOW() 
                    WHERE id = ? AND farmer_id = ?";
            
            $stmt = $this->conn->prepare($sql);
            $stmt->bind_param(
                "ssdissii",
                $productData['name'],
                $productData['description'],
                $productData['price'],
                $productData['quantity_available'],
                $productData['unit'],
                $productData['image_url'] ?? '',
                $productId,
                $farmerId
            );
            
            if (!$stmt->execute()) {
                throw new Exception("Failed to update product: " . $this->conn->error);
            }
            
            $affected_rows = $stmt->affected_rows;
            $stmt->close();
            
            return $affected_rows > 0;
            
        } catch (Exception $e) {
            throw new Exception("Error updating product: " . $e->getMessage());
        }
    }
    
    // Delete product from category
    public function deleteProductFromCategory($farmerId, $productId) {
        try {
            // Soft delete - change status to inactive
            $sql = "UPDATE products SET status = 'inactive', updated_at = NOW() WHERE id = ? AND farmer_id = ?";
            
            $stmt = $this->conn->prepare($sql);
            $stmt->bind_param("ii", $productId, $farmerId);
            
            if (!$stmt->execute()) {
                throw new Exception("Failed to delete product: " . $this->conn->error);
            }
            
            $affected_rows = $stmt->affected_rows;
            $stmt->close();
            
            return $affected_rows > 0;
            
        } catch (Exception $e) {
            throw new Exception("Error deleting product: " . $e->getMessage());
        }
    }
    
    // Get category statistics
    public function getCategoryStatistics($farmerId, $categoryName) {
        try {
            $sql = "SELECT 
                        COUNT(p.id) as total_products,
                        SUM(CASE WHEN p.status = 'active' THEN 1 ELSE 0 END) as active_products,
                        SUM(p.quantity_available) as total_stock,
                        AVG(p.price) as avg_price,
                        MIN(p.price) as min_price,
                        MAX(p.price) as max_price
                    FROM products p 
                    INNER JOIN categories c ON p.category_id = c.id 
                    WHERE p.farmer_id = ? AND LOWER(c.name) = LOWER(?)";
            
            $stmt = $this->conn->prepare($sql);
            $stmt->bind_param("is", $farmerId, $categoryName);
            $stmt->execute();
            $result = $stmt->get_result();
            
            $stats = $result->fetch_assoc();
            $stmt->close();
            
            return [
                'total_products' => (int)$stats['total_products'],
                'active_products' => (int)$stats['active_products'],
                'total_stock' => (int)$stats['total_stock'],
                'avg_price' => (float)$stats['avg_price'],
                'min_price' => (float)$stats['min_price'],
                'max_price' => (float)$stats['max_price']
            ];
            
        } catch (Exception $e) {
            throw new Exception("Error fetching category statistics: " . $e->getMessage());
        }
    }
    
    // Handle HTTP requests
    public function handleRequest() {
        try {
            $method = $_SERVER['REQUEST_METHOD'];
            
            switch ($method) {
                case 'GET':
                    $farmerId = $_GET['farmer_id'] ?? null;
                    $category = $_GET['category'] ?? null;
                    $type = $_GET['type'] ?? 'products';
                    
                    if (!$farmerId) {
                        throw new Exception("Farmer ID is required");
                    }
                    
                    if ($type === 'categories') {
                        $data = $this->getCategoriesWithCounts($farmerId);
                    } elseif ($type === 'stats' && $category) {
                        $data = $this->getCategoryStatistics($farmerId, $category);
                    } elseif ($category) {
                        $data = $this->getProductsByCategory($farmerId, $category);
                    } else {
                        throw new Exception("Category name is required");
                    }
                    
                    echo json_encode([
                        "success" => true,
                        "data" => $data,
                        "message" => "Category data retrieved successfully"
                    ]);
                    break;
                    
                case 'POST':
                    $data = json_decode(file_get_contents("php://input"), true);
                    $farmerId = $_GET['farmer_id'] ?? $data['farmer_id'] ?? null;
                    $category = $_GET['category'] ?? $data['category'] ?? null;
                    
                    if (!$data || !$farmerId || !$category) {
                        throw new Exception("Invalid data, farmer ID, or category");
                    }
                    
                    $required = ['name', 'price', 'quantity_available', 'unit'];
                    foreach ($required as $field) {
                        if (empty($data[$field])) {
                            throw new Exception("$field is required");
                        }
                    }
                    
                    $productId = $this->addProductToCategory($farmerId, $category, $data);
                    
                    echo json_encode([
                        "success" => true,
                        "message" => "Product added to category successfully",
                        "product_id" => $productId
                    ]);
                    break;
                    
                case 'PUT':
                    $data = json_decode(file_get_contents("php://input"), true);
                    $productId = $_GET['product_id'] ?? null;
                    $farmerId = $_GET['farmer_id'] ?? $data['farmer_id'] ?? null;
                    
                    if (!$data || !$productId || !$farmerId) {
                        throw new Exception("Invalid data, product ID, or farmer ID");
                    }
                    
                    $success = $this->updateProductInCategory($farmerId, $productId, $data);
                    
                    if ($success) {
                        echo json_encode([
                            "success" => true,
                            "message" => "Product updated successfully"
                        ]);
                    } else {
                        throw new Exception("Product not found or unauthorized");
                    }
                    break;
                    
                case 'DELETE':
                    $productId = $_GET['product_id'] ?? null;
                    $farmerId = $_GET['farmer_id'] ?? null;
                    
                    if (!$productId || !$farmerId) {
                        throw new Exception("Product ID and Farmer ID are required");
                    }
                    
                    $success = $this->deleteProductFromCategory($farmerId, $productId);
                    
                    if ($success) {
                        echo json_encode([
                            "success" => true,
                            "message" => "Product deleted successfully"
                        ]);
                    } else {
                        throw new Exception("Product not found or unauthorized");
                    }
                    break;
                    
                default:
                    throw new Exception("Method not allowed");
            }
            
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => $e->getMessage()
            ]);
        } finally {
            if ($this->conn) {
                $this->conn->close();
            }
        }
    }
}

// Initialize and handle request
try {
    $categoryProducts = new CategoryProducts($conn);
    $categoryProducts->handleRequest();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed: ' . $e->getMessage(),
        'timestamp' => date('Y-m-d H:i:s')
    ]);
}
?>
