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

class FarmerProducts {
    private $conn;
    
    public function __construct($connection) {
        $this->conn = $connection;
    }
    
    // Get all products for a specific farmer
    public function getFarmerProducts($farmerId) {
        try {
            $sql = "SELECT p.*, c.name as category_name 
                    FROM products p 
                    LEFT JOIN categories c ON p.category_id = c.id 
                    WHERE p.farmer_id = ? 
                    ORDER BY p.created_at DESC";
            
            $stmt = $this->conn->prepare($sql);
            $stmt->bind_param("i", $farmerId);
            $stmt->execute();
            $result = $stmt->get_result();
            
            $products = [];
            while ($row = $result->fetch_assoc()) {
                $products[] = $row;
            }
            
            $stmt->close();
            return $products;
            
        } catch (Exception $e) {
            throw new Exception("Error fetching products: " . $e->getMessage());
        }
    }
    
    // Get products by category for a farmer
    public function getProductsByCategory($farmerId, $categoryId) {
        try {
            $sql = "SELECT p.*, c.name as category_name 
                    FROM products p 
                    LEFT JOIN categories c ON p.category_id = c.id 
                    WHERE p.farmer_id = ? AND p.category_id = ?
                    ORDER BY p.created_at DESC";
            
            $stmt = $this->conn->prepare($sql);
            $stmt->bind_param("ii", $farmerId, $categoryId);
            $stmt->execute();
            $result = $stmt->get_result();
            
            $products = [];
            while ($row = $result->fetch_assoc()) {
                $products[] = $row;
            }
            
            $stmt->close();
            return $products;
            
        } catch (Exception $e) {
            throw new Exception("Error fetching products by category: " . $e->getMessage());
        }
    }
    
    // Add new product
    public function addProduct($data) {
        try {
            $sql = "INSERT INTO products (farmer_id, name, description, price, category_id, quantity_available, unit, image_url, status) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')";
            
            $stmt = $this->conn->prepare($sql);
            $stmt->bind_param(
                "issdisss",
                $data['farmer_id'],
                $data['name'],
                $data['description'],
                $data['price'],
                $data['category_id'],
                $data['quantity_available'],
                $data['unit'],
                $data['image_url']
            );
            
            if (!$stmt->execute()) {
                throw new Exception("Failed to add product: " . $this->conn->error);
            }
            
            $productId = $this->conn->insert_id;
            $stmt->close();
            
            return $productId;
            
        } catch (Exception $e) {
            throw new Exception("Error adding product: " . $e->getMessage());
        }
    }
    
    // Update product
    public function updateProduct($productId, $data) {
        try {
            $sql = "UPDATE products 
                    SET name = ?, description = ?, price = ?, category_id = ?, 
                        quantity_available = ?, unit = ?, image_url = ?, updated_at = NOW() 
                    WHERE id = ? AND farmer_id = ?";
            
            $stmt = $this->conn->prepare($sql);
            $stmt->bind_param(
                "ssdisssii",
                $data['name'],
                $data['description'],
                $data['price'],
                $data['category_id'],
                $data['quantity_available'],
                $data['unit'],
                $data['image_url'],
                $productId,
                $data['farmer_id']
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
    
    // Delete product
    public function deleteProduct($productId, $farmerId) {
        try {
            $sql = "DELETE FROM products WHERE id = ? AND farmer_id = ?";
            
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
    
    // Handle HTTP requests
    public function handleRequest() {
        try {
            $method = $_SERVER['REQUEST_METHOD'];
            
            switch ($method) {
                case 'GET':
                    $farmerId = $_GET['farmer_id'] ?? null;
                    $categoryId = $_GET['category_id'] ?? null;
                    
                    if (!$farmerId) {
                        throw new Exception("Farmer ID is required");
                    }
                    
                    if ($categoryId) {
                        $products = $this->getProductsByCategory($farmerId, $categoryId);
                    } else {
                        $products = $this->getFarmerProducts($farmerId);
                    }
                    
                    echo json_encode([
                        "success" => true,
                        "data" => $products
                    ]);
                    break;
                    
                case 'POST':
                    $data = json_decode(file_get_contents("php://input"), true);
                    
                    if (!$data) {
                        throw new Exception("Invalid JSON data");
                    }
                    
                    $required = ['farmer_id', 'name', 'price', 'category_id', 'quantity_available', 'unit'];
                    foreach ($required as $field) {
                        if (empty($data[$field])) {
                            throw new Exception("$field is required");
                        }
                    }
                    
                    $productId = $this->addProduct($data);
                    
                    echo json_encode([
                        "success" => true,
                        "message" => "Product added successfully",
                        "product_id" => $productId
                    ]);
                    break;
                    
                case 'PUT':
                    $data = json_decode(file_get_contents("php://input"), true);
                    $productId = $_GET['id'] ?? null;
                    
                    if (!$data || !$productId) {
                        throw new Exception("Invalid data or product ID");
                    }
                    
                    $success = $this->updateProduct($productId, $data);
                    
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
                    $productId = $_GET['id'] ?? null;
                    $farmerId = $_GET['farmer_id'] ?? null;
                    
                    if (!$productId || !$farmerId) {
                        throw new Exception("Product ID and Farmer ID are required");
                    }
                    
                    $success = $this->deleteProduct($productId, $farmerId);
                    
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
$farmerProducts = new FarmerProducts($conn);
$farmerProducts->handleRequest();
?>
