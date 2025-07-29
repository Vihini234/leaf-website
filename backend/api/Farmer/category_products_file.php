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

// Simple file-based storage for temporary use
class SimpleFileStorage {
    private $dataDir;
    
    public function __construct() {
        $this->dataDir = __DIR__ . '/../../data/';
        if (!is_dir($this->dataDir)) {
            mkdir($this->dataDir, 0777, true);
        }
    }
    
    // Get products by category for a farmer
    public function getProductsByCategory($farmerId, $categoryName) {
        $filename = $this->dataDir . "products_farmer_{$farmerId}_{$categoryName}.json";
        
        if (!file_exists($filename)) {
            return [];
        }
        
        $data = json_decode(file_get_contents($filename), true);
        return $data ?: [];
    }
    
    // Add product to category
    public function addProductToCategory($farmerId, $categoryName, $productData) {
        $filename = $this->dataDir . "products_farmer_{$farmerId}_{$categoryName}.json";
        
        $products = $this->getProductsByCategory($farmerId, $categoryName);
        
        $newProduct = [
            'id' => time() + rand(1, 1000), // Simple ID generation
            'name' => $productData['name'],
            'description' => $productData['description'] ?? '',
            'price' => (float)$productData['price'],
            'quantity_available' => (int)$productData['quantity_available'],
            'unit' => $productData['unit'],
            'category_name' => $categoryName,
            'image_url' => $productData['image_url'] ?? '',
            'status' => 'active',
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        ];
        
        $products[] = $newProduct;
        
        file_put_contents($filename, json_encode($products, JSON_PRETTY_PRINT));
        
        return $newProduct['id'];
    }
    
    // Update product
    public function updateProduct($farmerId, $categoryName, $productId, $productData) {
        $filename = $this->dataDir . "products_farmer_{$farmerId}_{$categoryName}.json";
        $products = $this->getProductsByCategory($farmerId, $categoryName);
        
        foreach ($products as &$product) {
            if ($product['id'] == $productId) {
                $product['name'] = $productData['name'];
                $product['description'] = $productData['description'] ?? $product['description'];
                $product['price'] = (float)$productData['price'];
                $product['quantity_available'] = (int)$productData['quantity_available'];
                $product['unit'] = $productData['unit'];
                $product['image_url'] = $productData['image_url'] ?? $product['image_url'];
                $product['updated_at'] = date('Y-m-d H:i:s');
                
                file_put_contents($filename, json_encode($products, JSON_PRETTY_PRINT));
                return true;
            }
        }
        
        return false;
    }
    
    // Delete product (soft delete)
    public function deleteProduct($farmerId, $categoryName, $productId) {
        $filename = $this->dataDir . "products_farmer_{$farmerId}_{$categoryName}.json";
        $products = $this->getProductsByCategory($farmerId, $categoryName);
        
        foreach ($products as &$product) {
            if ($product['id'] == $productId) {
                $product['status'] = 'inactive';
                $product['updated_at'] = date('Y-m-d H:i:s');
                
                file_put_contents($filename, json_encode($products, JSON_PRETTY_PRINT));
                return true;
            }
        }
        
        return false;
    }
    
    // Get all categories with counts
    public function getCategoriesWithCounts($farmerId) {
        $categories = [
            ['id' => 1, 'name' => 'Vegetables', 'description' => 'Fresh vegetables'],
            ['id' => 2, 'name' => 'Fruits', 'description' => 'Fresh fruits'],
            ['id' => 3, 'name' => 'Dairy', 'description' => 'Dairy products']
        ];
        
        foreach ($categories as &$category) {
            $products = $this->getProductsByCategory($farmerId, $category['name']);
            $activeProducts = array_filter($products, function($p) {
                return $p['status'] === 'active';
            });
            
            $category['product_count'] = count($products);
            $category['active_products'] = count($activeProducts);
        }
        
        return $categories;
    }
}

// Handle requests
try {
    $storage = new SimpleFileStorage();
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
                $data = $storage->getCategoriesWithCounts($farmerId);
            } elseif ($category) {
                $data = $storage->getProductsByCategory($farmerId, $category);
            } else {
                throw new Exception("Category name is required");
            }
            
            echo json_encode([
                "success" => true,
                "data" => $data,
                "message" => "Data retrieved successfully (file-based storage)"
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
            
            $productId = $storage->addProductToCategory($farmerId, $category, $data);
            
            echo json_encode([
                "success" => true,
                "message" => "Product added successfully (file-based storage)",
                "product_id" => $productId
            ]);
            break;
            
        case 'PUT':
            $data = json_decode(file_get_contents("php://input"), true);
            $productId = $_GET['product_id'] ?? null;
            $farmerId = $_GET['farmer_id'] ?? $data['farmer_id'] ?? null;
            $category = $_GET['category'] ?? $data['category'] ?? null;
            
            if (!$data || !$productId || !$farmerId || !$category) {
                throw new Exception("Invalid data, product ID, farmer ID, or category");
            }
            
            $success = $storage->updateProduct($farmerId, $category, $productId, $data);
            
            if ($success) {
                echo json_encode([
                    "success" => true,
                    "message" => "Product updated successfully (file-based storage)"
                ]);
            } else {
                throw new Exception("Product not found");
            }
            break;
            
        case 'DELETE':
            $productId = $_GET['product_id'] ?? null;
            $farmerId = $_GET['farmer_id'] ?? null;
            $category = $_GET['category'] ?? null;
            
            if (!$productId || !$farmerId || !$category) {
                throw new Exception("Product ID, Farmer ID, and Category are required");
            }
            
            $success = $storage->deleteProduct($farmerId, $category, $productId);
            
            if ($success) {
                echo json_encode([
                    "success" => true,
                    "message" => "Product deleted successfully (file-based storage)"
                ]);
            } else {
                throw new Exception("Product not found");
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
}
?>
