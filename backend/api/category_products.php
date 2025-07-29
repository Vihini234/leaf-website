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


class FileBasedStorage {
    private $dataDir;
    
    public function __construct() {
        $this->dataDir = __DIR__ . '/../data/';
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
            'id' => time() + rand(1, 1000),
            'name' => $productData['name'],
            'description' => $productData['description'] ?? '',
            'price' => (float)$productData['price'],
            'quantity_available' => (int)($productData['stock'] ?? $productData['quantity_available']),
            'unit' => $productData['unit'],
            'category_name' => ucfirst($categoryName),
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
                $product['quantity_available'] = (int)($productData['stock'] ?? $productData['quantity_available']);
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
    
    // Get categories with product counts
    public function getCategoriesWithCounts($farmerId) {
        $categories = [
            ['id' => 1, 'name' => 'Vegetables', 'description' => 'Fresh vegetables'],
            ['id' => 2, 'name' => 'Fruits', 'description' => 'Fresh fruits'],
            ['id' => 3, 'name' => 'Dairy', 'description' => 'Dairy products']
        ];
        
        foreach ($categories as &$category) {
            $products = $this->getProductsByCategory($farmerId, strtolower($category['name']));
            $activeProducts = array_filter($products, function($p) {
                return ($p['status'] ?? 'active') === 'active';
            });
            
            $category['product_count'] = count($products);
            $category['active_products'] = count($activeProducts);
        }
        
        return $categories;
    }
}

// Handle requests
try {
    $storage = new FileBasedStorage();
    $method = $_SERVER['REQUEST_METHOD'];
    
    switch ($method) {
        case 'GET':
            $farmerId = $_GET['farmer_id'] ?? 1; // Default farmer ID
            $category = $_GET['category'] ?? null;
            $type = $_GET['type'] ?? 'products';
            
            if ($type === 'categories') {
                $data = $storage->getCategoriesWithCounts($farmerId);
            } elseif ($category) {
                $data = $storage->getProductsByCategory($farmerId, strtolower($category));
                // Filter only active products
                $data = array_filter($data, function($product) {
                    return ($product['status'] ?? 'active') === 'active';
                });
                $data = array_values($data); // Reindex array
            } else {
                throw new Exception("Category name is required");
            }
            
            echo json_encode([
                "success" => true,
                "data" => $data,
                "message" => "Data retrieved successfully",
                "count" => count($data)
            ]);
            break;
            
        case 'POST':
            $data = json_decode(file_get_contents("php://input"), true);
            $farmerId = $_GET['farmer_id'] ?? $data['farmer_id'] ?? 1;
            $category = $_GET['category'] ?? $data['category'] ?? null;
            
            if (!$data) {
                throw new Exception("No data provided");
            }
            
            if (!$category) {
                throw new Exception("Category is required");
            }
            
            $required = ['name', 'price', 'unit'];
            foreach ($required as $field) {
                if (empty($data[$field])) {
                    throw new Exception("$field is required");
                }
            }
            
            // Handle both 'stock' and 'quantity_available' field names
            if (empty($data['stock']) && empty($data['quantity_available'])) {
                throw new Exception("Stock/quantity is required");
            }
            
            $productId = $storage->addProductToCategory($farmerId, strtolower($category), $data);
            
            echo json_encode([
                "success" => true,
                "message" => "Product added successfully",
                "product_id" => $productId
            ]);
            break;
            
        case 'PUT':
            $data = json_decode(file_get_contents("php://input"), true);
            $productId = $_GET['product_id'] ?? null;
            $farmerId = $_GET['farmer_id'] ?? $data['farmer_id'] ?? 1;
            $category = $_GET['category'] ?? $data['category'] ?? null;
            
            if (!$data || !$productId || !$category) {
                throw new Exception("Invalid data, product ID, or category");
            }
            
            $success = $storage->updateProduct($farmerId, strtolower($category), $productId, $data);
            
            if ($success) {
                echo json_encode([
                    "success" => true,
                    "message" => "Product updated successfully"
                ]);
            } else {
                throw new Exception("Product not found");
            }
            break;
            
        case 'DELETE':
            $productId = $_GET['product_id'] ?? null;
            $farmerId = $_GET['farmer_id'] ?? 1;
            $category = $_GET['category'] ?? null;
            
            if (!$productId || !$category) {
                throw new Exception("Product ID and Category are required");
            }
            
            $success = $storage->deleteProduct($farmerId, strtolower($category), $productId);
            
            if ($success) {
                echo json_encode([
                    "success" => true,
                    "message" => "Product deleted successfully"
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
        "message" => $e->getMessage(),
        "timestamp" => date('Y-m-d H:i:s')
    ]);
}
?>
