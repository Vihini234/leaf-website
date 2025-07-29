<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle CORS preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Simple file-based orders system (since MySQL extensions are not available)
class FileBasedOrders {
    private $dataDir;
    
    public function __construct() {
        $this->dataDir = __DIR__ . '/../../data/';
        if (!is_dir($this->dataDir)) {
            mkdir($this->dataDir, 0777, true);
        }
    }
    
    // Get all orders for a specific farmer
    public function getFarmerOrders($farmerId) {
        $filename = $this->dataDir . "orders_farmer_{$farmerId}.json";
        
        if (!file_exists($filename)) {
            // Create sample orders if file doesn't exist
            $sampleOrders = [
                [
                    'order_id' => 1,
                    'order_date' => date('Y-m-d H:i:s', strtotime('-2 hours')),
                    'order_status' => 'pending',
                    'total_amount' => 45.50,
                    'customer_name' => 'John Doe',
                    'phone_number' => '+1234567890',
                    'address' => '123 Main St',
                    'district' => 'Central District',
                    'product_list' => 'Tomatoes (2 kg), Carrots (1 kg)'
                ],
                [
                    'order_id' => 2,
                    'order_date' => date('Y-m-d H:i:s', strtotime('-5 hours')),
                    'order_status' => 'completed',
                    'total_amount' => 32.75,
                    'customer_name' => 'Jane Smith',
                    'phone_number' => '+1234567891',
                    'address' => '456 Oak Ave',
                    'district' => 'North District',
                    'product_list' => 'Apples (3 kg), Milk (2 liters)'
                ],
                [
                    'order_id' => 3,
                    'order_date' => date('Y-m-d H:i:s', strtotime('-1 day')),
                    'order_status' => 'processing',
                    'total_amount' => 28.25,
                    'customer_name' => 'Bob Wilson',
                    'phone_number' => '+1234567892',
                    'address' => '789 Pine St',
                    'district' => 'South District',
                    'product_list' => 'Oranges (2 kg)'
                ]
            ];
            
            file_put_contents($filename, json_encode($sampleOrders, JSON_PRETTY_PRINT));
            return $sampleOrders;
        }
        
        $data = json_decode(file_get_contents($filename), true);
        return $data ?: [];
    }
    
    // Update order status
    public function updateOrderStatus($farmerId, $orderId, $newStatus) {
        $filename = $this->dataDir . "orders_farmer_{$farmerId}.json";
        $orders = $this->getFarmerOrders($farmerId);
        
        foreach ($orders as &$order) {
            if ($order['order_id'] == $orderId) {
                $order['order_status'] = $newStatus;
                $order['updated_at'] = date('Y-m-d H:i:s');
                
                file_put_contents($filename, json_encode($orders, JSON_PRETTY_PRINT));
                return true;
            }
        }
        
        return false;
    }
    
    // Get order statistics
    public function getOrderStatistics($farmerId) {
        $orders = $this->getFarmerOrders($farmerId);
        
        $stats = [
            'total_orders' => count($orders),
            'pending_orders' => 0,
            'completed_orders' => 0,
            'processing_orders' => 0,
            'total_revenue' => 0
        ];
        
        foreach ($orders as $order) {
            $stats['total_revenue'] += $order['total_amount'];
            
            switch ($order['order_status']) {
                case 'pending':
                    $stats['pending_orders']++;
                    break;
                case 'completed':
                    $stats['completed_orders']++;
                    break;
                case 'processing':
                    $stats['processing_orders']++;
                    break;
            }
        }
        
        return $stats;
    }
}

// Handle requests
try {
    $ordersManager = new FileBasedOrders();
    $method = $_SERVER['REQUEST_METHOD'];
    
    switch ($method) {
        case 'GET':
            $farmerId = $_GET['farmer_id'] ?? 1;
            $type = $_GET['type'] ?? 'orders';
            
            if ($type === 'stats') {
                $data = $ordersManager->getOrderStatistics($farmerId);
            } else {
                $data = $ordersManager->getFarmerOrders($farmerId);
            }
            
            echo json_encode([
                'success' => true,
                'data' => $data,
                'message' => 'Orders retrieved successfully',
                'farmer_id' => $farmerId
            ]);
            break;
            
        case 'PUT':
            $data = json_decode(file_get_contents("php://input"), true);
            $orderId = $_GET['order_id'] ?? $data['order_id'] ?? null;
            $farmerId = $_GET['farmer_id'] ?? $data['farmer_id'] ?? 1;
            $newStatus = $data['status'] ?? null;
            
            if (!$orderId || !$newStatus) {
                throw new Exception("Order ID and status are required");
            }
            
            $success = $ordersManager->updateOrderStatus($farmerId, $orderId, $newStatus);
            
            if ($success) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Order status updated successfully'
                ]);
            } else {
                throw new Exception("Order not found");
            }
            break;
            
        default:
            throw new Exception("Method not allowed");
    }
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
            
            $orders = [];
            while ($row = $result->fetch_assoc()) {
                $orders[] = $row;
            }
            
            $stmt->close();
            return $orders;
            
        } catch (Exception $e) {
            throw new Exception("Error fetching orders: " . $e->getMessage());
        }
    }
    
    // Get order details with items for a specific order
    public function getOrderDetails($orderId, $farmerId) {
        try {
            // First verify the farmer has products in this order
            $verify_sql = "SELECT COUNT(*) as count FROM order_items oi 
                          JOIN products p ON oi.product_id = p.id 
                          WHERE oi.order_id = ? AND p.farmer_id = ?";
            
            $stmt = $this->conn->prepare($verify_sql);
            $stmt->bind_param("ii", $orderId, $farmerId);
            $stmt->execute();
            $result = $stmt->get_result();
            $row = $result->fetch_assoc();
            $stmt->close();
            
            if ($row['count'] == 0) {
                throw new Exception("Order not found or unauthorized");
            }
            
            // Get order details
            $sql = "SELECT 
                        o.id as order_id,
                        o.order_date,
                        o.status as order_status,
                        o.total_amount,
                        o.delivery_address,
                        o.special_instructions,
                        u.full_name as customer_name,
                        u.email as customer_email,
                        u.phone_number,
                        u.address,
                        u.district
                    FROM orders o
                    JOIN user u ON o.customer_id = u.id
                    WHERE o.id = ?";
            
            $stmt = $this->conn->prepare($sql);
            $stmt->bind_param("i", $orderId);
            $stmt->execute();
            $result = $stmt->get_result();
            $order = $result->fetch_assoc();
            $stmt->close();
            
            // Get order items for this farmer
            $items_sql = "SELECT 
                            oi.id as item_id,
                            oi.quantity,
                            oi.unit,
                            oi.price_per_unit,
                            oi.total_price,
                            p.name as product_name,
                            p.description as product_description,
                            p.image_url
                          FROM order_items oi
                          JOIN products p ON oi.product_id = p.id
                          WHERE oi.order_id = ? AND p.farmer_id = ?";
            
            $stmt = $this->conn->prepare($items_sql);
            $stmt->bind_param("ii", $orderId, $farmerId);
            $stmt->execute();
            $result = $stmt->get_result();
            
            $items = [];
            while ($row = $result->fetch_assoc()) {
                $items[] = $row;
            }
            $stmt->close();
            
            $order['items'] = $items;
            
            return $order;
            
        } catch (Exception $e) {
            throw new Exception("Error fetching order details: " . $e->getMessage());
        }
    }
    
    // Update order status (for items belonging to this farmer)
    public function updateOrderStatus($orderId, $farmerId, $status) {
        try {
            // Verify farmer has products in this order
            $verify_sql = "SELECT COUNT(*) as count FROM order_items oi 
                          JOIN products p ON oi.product_id = p.id 
                          WHERE oi.order_id = ? AND p.farmer_id = ?";
            
            $stmt = $this->conn->prepare($verify_sql);
            $stmt->bind_param("ii", $orderId, $farmerId);
            $stmt->execute();
            $result = $stmt->get_result();
            $row = $result->fetch_assoc();
            $stmt->close();
            
            if ($row['count'] == 0) {
                throw new Exception("Order not found or unauthorized");
            }
            
            // Update order status
            $update_sql = "UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?";
            
            $stmt = $this->conn->prepare($update_sql);
            $stmt->bind_param("si", $status, $orderId);
            
            if (!$stmt->execute()) {
                throw new Exception("Failed to update order status: " . $this->conn->error);
            }
            
            $affected_rows = $stmt->affected_rows;
            $stmt->close();
            
            return $affected_rows > 0;
            
        } catch (Exception $e) {
            throw new Exception("Error updating order status: " . $e->getMessage());
        }
    }
    
    // Get order statistics for farmer dashboard
    public function getOrderStats($farmerId) {
        try {
            $stats = [];
            
            // Total orders
            $total_sql = "SELECT COUNT(DISTINCT o.id) as total_orders 
                         FROM orders o 
                         JOIN order_items oi ON o.id = oi.order_id 
                         JOIN products p ON oi.product_id = p.id 
                         WHERE p.farmer_id = ?";
            
            $stmt = $this->conn->prepare($total_sql);
            $stmt->bind_param("i", $farmerId);
            $stmt->execute();
            $result = $stmt->get_result();
            $stats['total_orders'] = $result->fetch_assoc()['total_orders'];
            $stmt->close();
            
            // Pending orders
            $pending_sql = "SELECT COUNT(DISTINCT o.id) as pending_orders 
                           FROM orders o 
                           JOIN order_items oi ON o.id = oi.order_id 
                           JOIN products p ON oi.product_id = p.id 
                           WHERE p.farmer_id = ? AND o.status = 'pending'";
            
            $stmt = $this->conn->prepare($pending_sql);
            $stmt->bind_param("i", $farmerId);
            $stmt->execute();
            $result = $stmt->get_result();
            $stats['pending_orders'] = $result->fetch_assoc()['pending_orders'];
            $stmt->close();
            
            // Total revenue
            $revenue_sql = "SELECT SUM(oi.total_price) as total_revenue 
                           FROM order_items oi 
                           JOIN products p ON oi.product_id = p.id 
                           JOIN orders o ON oi.order_id = o.id
                           WHERE p.farmer_id = ? AND o.status = 'completed'";
            
            $stmt = $this->conn->prepare($revenue_sql);
            $stmt->bind_param("i", $farmerId);
            $stmt->execute();
            $result = $stmt->get_result();
            $stats['total_revenue'] = $result->fetch_assoc()['total_revenue'] ?? 0;
            $stmt->close();
            
            return $stats;
            
        } catch (Exception $e) {
            throw new Exception("Error fetching order statistics: " . $e->getMessage());
        }
    }
    
    // Handle HTTP requests
    public function handleRequest() {
        try {
            $method = $_SERVER['REQUEST_METHOD'];
            
            switch ($method) {
                case 'GET':
                    $farmerId = $_GET['farmer_id'] ?? null;
                    
                    if (!$farmerId) {
                        throw new Exception("Farmer ID is required");
                    }
                    
                    if (isset($_GET['order_id'])) {
                        // Get specific order details
                        $orderId = $_GET['order_id'];
                        $order = $this->getOrderDetails($orderId, $farmerId);
                        
                        echo json_encode([
                            "success" => true,
                            "data" => $order
                        ]);
                    } elseif (isset($_GET['stats'])) {
                        // Get order statistics
                        $stats = $this->getOrderStats($farmerId);
                        
                        echo json_encode([
                            "success" => true,
                            "data" => $stats
                        ]);
                    } else {
                        // Get all orders
                        $orders = $this->getFarmerOrders($farmerId);
                        
                        echo json_encode([
                            "success" => true,
                            "data" => $orders
                        ]);
                    }
                    break;
                    
                case 'PUT':
                    $data = json_decode(file_get_contents("php://input"), true);
                    $orderId = $_GET['order_id'] ?? null;
                    $farmerId = $_GET['farmer_id'] ?? null;
                    
                    if (!$data || !$orderId || !$farmerId) {
                        throw new Exception("Invalid data, order ID, or farmer ID");
                    }
                    
                    if (empty($data['status'])) {
                        throw new Exception("Status is required");
                    }
                    
                    $validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];
                    if (!in_array($data['status'], $validStatuses)) {
                        throw new Exception("Invalid status");
                    }
                    
                    $success = $this->updateOrderStatus($orderId, $farmerId, $data['status']);
                    
                    if ($success) {
                        echo json_encode([
                            "success" => true,
                            "message" => "Order status updated successfully"
                        ]);
                    } else {
                        throw new Exception("Order not found or unauthorized");
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
$farmerOrders = new FarmerOrders($conn);
$farmerOrders->handleRequest();
?>
