<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle CORS preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include DB connection
include_once '../../config/db.php';

class FarmerAnalytics {
    private $conn;
    
    public function __construct($connection) {
        $this->conn = $connection;
    }
    
    // Get sales analytics
    public function getSalesAnalytics($farmerId, $period = 'month') {
        try {
            $dateCondition = "";
            switch ($period) {
                case 'week':
                    $dateCondition = "AND o.created_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK)";
                    break;
                case 'month':
                    $dateCondition = "AND o.created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)";
                    break;
                case 'year':
                    $dateCondition = "AND o.created_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR)";
                    break;
                default:
                    $dateCondition = "AND o.created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)";
            }
            
            // Sales revenue over time
            $sql = "SELECT 
                        DATE(o.created_at) as sale_date,
                        SUM(oi.quantity * oi.price) as daily_revenue,
                        COUNT(DISTINCT o.id) as orders_count,
                        SUM(oi.quantity) as total_quantity
                    FROM orders o 
                    INNER JOIN order_items oi ON o.id = oi.order_id 
                    INNER JOIN products p ON oi.product_id = p.id 
                    WHERE p.farmer_id = ? AND o.status = 'completed' $dateCondition
                    GROUP BY DATE(o.created_at)
                    ORDER BY sale_date DESC";
            
            $stmt = $this->conn->prepare($sql);
            $stmt->bind_param("i", $farmerId);
            $stmt->execute();
            $result = $stmt->get_result();
            
            $salesData = [];
            while ($row = $result->fetch_assoc()) {
                $salesData[] = [
                    'date' => $row['sale_date'],
                    'revenue' => (float)$row['daily_revenue'],
                    'orders' => (int)$row['orders_count'],
                    'quantity' => (int)$row['total_quantity']
                ];
            }
            $stmt->close();
            
            return $salesData;
            
        } catch (Exception $e) {
            throw new Exception("Error fetching sales analytics: " . $e->getMessage());
        }
    }
    
    // Get product performance analytics
    public function getProductPerformance($farmerId) {
        try {
            $sql = "SELECT 
                        p.id,
                        p.name,
                        p.category_id,
                        c.name as category_name,
                        COUNT(oi.id) as total_orders,
                        SUM(oi.quantity) as total_sold,
                        SUM(oi.quantity * oi.price) as total_revenue,
                        AVG(oi.price) as avg_price,
                        p.quantity_available as current_stock
                    FROM products p
                    LEFT JOIN order_items oi ON p.id = oi.product_id
                    LEFT JOIN orders o ON oi.order_id = o.id AND o.status = 'completed'
                    LEFT JOIN categories c ON p.category_id = c.id
                    WHERE p.farmer_id = ? AND p.status = 'active'
                    GROUP BY p.id, p.name, p.category_id, c.name, p.quantity_available
                    ORDER BY total_revenue DESC";
            
            $stmt = $this->conn->prepare($sql);
            $stmt->bind_param("i", $farmerId);
            $stmt->execute();
            $result = $stmt->get_result();
            
            $productData = [];
            while ($row = $result->fetch_assoc()) {
                $productData[] = [
                    'product_id' => (int)$row['id'],
                    'product_name' => $row['name'],
                    'category' => $row['category_name'],
                    'total_orders' => (int)$row['total_orders'],
                    'total_sold' => (int)$row['total_sold'],
                    'total_revenue' => (float)$row['total_revenue'],
                    'average_price' => (float)$row['avg_price'],
                    'current_stock' => (int)$row['current_stock']
                ];
            }
            $stmt->close();
            
            return $productData;
            
        } catch (Exception $e) {
            throw new Exception("Error fetching product performance: " . $e->getMessage());
        }
    }
    
    // Get customer analytics
    public function getCustomerAnalytics($farmerId) {
        try {
            $sql = "SELECT 
                        c.full_name as customer_name,
                        u.email,
                        u.phone_number,
                        COUNT(DISTINCT o.id) as total_orders,
                        SUM(oi.quantity * oi.price) as total_spent,
                        AVG(oi.quantity * oi.price) as avg_order_value,
                        MAX(o.created_at) as last_order_date
                    FROM orders o
                    INNER JOIN order_items oi ON o.id = oi.order_id
                    INNER JOIN products p ON oi.product_id = p.id
                    INNER JOIN customers cu ON o.customer_id = cu.id
                    INNER JOIN users u ON cu.user_id = u.id
                    WHERE p.farmer_id = ? AND o.status = 'completed'
                    GROUP BY cu.id, c.full_name, u.email, u.phone_number
                    ORDER BY total_spent DESC
                    LIMIT 10";
            
            $stmt = $this->conn->prepare($sql);
            $stmt->bind_param("i", $farmerId);
            $stmt->execute();
            $result = $stmt->get_result();
            
            $customerData = [];
            while ($row = $result->fetch_assoc()) {
                $customerData[] = [
                    'customer_name' => $row['customer_name'],
                    'email' => $row['email'],
                    'phone' => $row['phone_number'],
                    'total_orders' => (int)$row['total_orders'],
                    'total_spent' => (float)$row['total_spent'],
                    'avg_order_value' => (float)$row['avg_order_value'],
                    'last_order' => $row['last_order_date']
                ];
            }
            $stmt->close();
            
            return $customerData;
            
        } catch (Exception $e) {
            throw new Exception("Error fetching customer analytics: " . $e->getMessage());
        }
    }
    
    // Get revenue trends and forecasting
    public function getRevenueTrends($farmerId) {
        try {
            // Monthly revenue for the past 12 months
            $sql = "SELECT 
                        YEAR(o.created_at) as year,
                        MONTH(o.created_at) as month,
                        MONTHNAME(o.created_at) as month_name,
                        SUM(oi.quantity * oi.price) as monthly_revenue,
                        COUNT(DISTINCT o.id) as monthly_orders
                    FROM orders o
                    INNER JOIN order_items oi ON o.id = oi.order_id
                    INNER JOIN products p ON oi.product_id = p.id
                    WHERE p.farmer_id = ? 
                    AND o.status = 'completed'
                    AND o.created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
                    GROUP BY YEAR(o.created_at), MONTH(o.created_at)
                    ORDER BY year DESC, month DESC";
            
            $stmt = $this->conn->prepare($sql);
            $stmt->bind_param("i", $farmerId);
            $stmt->execute();
            $result = $stmt->get_result();
            
            $revenueData = [];
            while ($row = $result->fetch_assoc()) {
                $revenueData[] = [
                    'year' => (int)$row['year'],
                    'month' => (int)$row['month'],
                    'month_name' => $row['month_name'],
                    'revenue' => (float)$row['monthly_revenue'],
                    'orders' => (int)$row['monthly_orders']
                ];
            }
            $stmt->close();
            
            return $revenueData;
            
        } catch (Exception $e) {
            throw new Exception("Error fetching revenue trends: " . $e->getMessage());
        }
    }
    
    // Get inventory alerts
    public function getInventoryAlerts($farmerId) {
        try {
            $sql = "SELECT 
                        p.id,
                        p.name,
                        p.quantity_available,
                        p.unit,
                        c.name as category_name,
                        CASE 
                            WHEN p.quantity_available = 0 THEN 'out_of_stock'
                            WHEN p.quantity_available < 10 THEN 'low_stock'
                            ELSE 'normal'
                        END as alert_level
                    FROM products p
                    LEFT JOIN categories c ON p.category_id = c.id
                    WHERE p.farmer_id = ? 
                    AND p.status = 'active'
                    AND p.quantity_available < 20
                    ORDER BY p.quantity_available ASC";
            
            $stmt = $this->conn->prepare($sql);
            $stmt->bind_param("i", $farmerId);
            $stmt->execute();
            $result = $stmt->get_result();
            
            $alerts = [];
            while ($row = $result->fetch_assoc()) {
                $alerts[] = [
                    'product_id' => (int)$row['id'],
                    'product_name' => $row['name'],
                    'current_stock' => (int)$row['quantity_available'],
                    'unit' => $row['unit'],
                    'category' => $row['category_name'],
                    'alert_level' => $row['alert_level']
                ];
            }
            $stmt->close();
            
            return $alerts;
            
        } catch (Exception $e) {
            throw new Exception("Error fetching inventory alerts: " . $e->getMessage());
        }
    }
    
    // Handle HTTP requests
    public function handleRequest() {
        try {
            $method = $_SERVER['REQUEST_METHOD'];
            
            if ($method !== 'GET') {
                throw new Exception("Only GET method is allowed");
            }
            
            $farmerId = $_GET['farmer_id'] ?? null;
            $type = $_GET['type'] ?? 'overview';
            $period = $_GET['period'] ?? 'month';
            
            if (!$farmerId) {
                throw new Exception("Farmer ID is required");
            }
            
            switch ($type) {
                case 'sales':
                    $data = $this->getSalesAnalytics($farmerId, $period);
                    break;
                case 'products':
                    $data = $this->getProductPerformance($farmerId);
                    break;
                case 'customers':
                    $data = $this->getCustomerAnalytics($farmerId);
                    break;
                case 'revenue_trends':
                    $data = $this->getRevenueTrends($farmerId);
                    break;
                case 'inventory_alerts':
                    $data = $this->getInventoryAlerts($farmerId);
                    break;
                case 'overview':
                default:
                    $data = [
                        'sales' => $this->getSalesAnalytics($farmerId, $period),
                        'products' => $this->getProductPerformance($farmerId),
                        'customers' => $this->getCustomerAnalytics($farmerId),
                        'revenue_trends' => $this->getRevenueTrends($farmerId),
                        'inventory_alerts' => $this->getInventoryAlerts($farmerId)
                    ];
                    break;
            }
            
            echo json_encode([
                'success' => true,
                'data' => $data,
                'message' => 'Analytics data retrieved successfully',
                'farmer_id' => $farmerId,
                'type' => $type,
                'period' => $period,
                'timestamp' => date('Y-m-d H:i:s')
            ]);
            
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => $e->getMessage(),
                'timestamp' => date('Y-m-d H:i:s')
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
    $farmerAnalytics = new FarmerAnalytics($conn);
    $farmerAnalytics->handleRequest();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed: ' . $e->getMessage(),
        'timestamp' => date('Y-m-d H:i:s')
    ]);
}
?>
