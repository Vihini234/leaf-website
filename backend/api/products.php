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

// Simple mock products API
try {
    $method = $_SERVER['REQUEST_METHOD'];
    
    switch ($method) {
        case 'GET':
            $farmerId = $_GET['farmer_id'] ?? null;
            
            $mockProducts = [
                [
                    'id' => 1,
                    'name' => 'Sample Tomatoes',
                    'description' => 'Fresh organic tomatoes',
                    'price' => 2.50,
                    'quantity_available' => 100,
                    'unit' => 'kg',
                    'category_name' => 'Vegetables',
                    'image_url' => '',
                    'status' => 'active',
                    'created_at' => date('Y-m-d H:i:s'),
                    'updated_at' => date('Y-m-d H:i:s')
                ],
                [
                    'id' => 2,
                    'name' => 'Sample Carrots',
                    'description' => 'Fresh carrots',
                    'price' => 1.80,
                    'quantity_available' => 50,
                    'unit' => 'kg',
                    'category_name' => 'Vegetables',
                    'image_url' => '',
                    'status' => 'active',
                    'created_at' => date('Y-m-d H:i:s'),
                    'updated_at' => date('Y-m-d H:i:s')
                ]
            ];
            
            echo json_encode([
                "success" => true,
                "data" => $mockProducts,
                "message" => "Products retrieved successfully (mock data)"
            ]);
            break;
            
        case 'POST':
            $data = json_decode(file_get_contents("php://input"), true);
            
            echo json_encode([
                "success" => true,
                "message" => "Product added successfully (mock response)",
                "product_id" => rand(1000, 9999)
            ]);
            break;
            
        case 'PUT':
            echo json_encode([
                "success" => true,
                "message" => "Product updated successfully (mock response)"
            ]);
            break;
            
        case 'DELETE':
            echo json_encode([
                "success" => true,
                "message" => "Product deleted successfully (mock response)"
            ]);
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
