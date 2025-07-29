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

class FarmerDashboard {
    private $conn;
    
    public function __construct($connection) {
        $this->conn = $connection;
    }
    
    // Get farmer profile information
    public function getFarmerProfile($farmerId) {
        try {
            $sql = "SELECT id, full_name, email, phone_number, district, address, created_at 
                    FROM user 
                    WHERE id = ? AND role = 'farmer'";
            
            $stmt = $this->conn->prepare($sql);
            $stmt->bind_param("i", $farmerId);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($result->num_rows === 0) {
                throw new Exception("Farmer not found");
            }
            
            $farmer = $result->fetch_assoc();
            $stmt->close();
            
            return $farmer;
            
        } catch (Exception $e) {
            throw new Exception("Error fetching farmer profile: " . $e->getMessage());
        }
    }
    
    // Get dashboard statistics
    public function getDashboardStats($farmerId) {
        try {
            $stats = [];
            
            // Total products
            $products_sql = "SELECT COUNT(*) as total_products FROM products WHERE farmer_id = ? AND status = 'active'";
            $stmt = $this->conn->prepare($products_sql);
            $stmt->bind_param("i", $farmerId);
            $stmt->execute();
            $result = $stmt->get_result();
            $stats['total_products'] = $result->fetch_assoc()['total_products'];
            $stmt->close();
            
            // Total orders
            $orders_sql = "SELECT COUNT(DISTINCT o.id) as total_orders 
                          FROM orders o 
                          JOIN order_items oi ON o.id = oi.order_id 
                          JOIN products p ON oi.product_id = p.id 
                          WHERE p.farmer_id = ?";
            
            $stmt = $this->conn->prepare($orders_sql);
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
            
            // Monthly revenue
            $revenue_sql = "SELECT SUM(oi.total_price) as monthly_revenue 
                           FROM order_items oi 
                           JOIN products p ON oi.product_id = p.id 
                           JOIN orders o ON oi.order_id = o.id
                           WHERE p.farmer_id = ? 
                           AND o.status = 'completed' 
                           AND MONTH(o.order_date) = MONTH(CURRENT_DATE()) 
                           AND YEAR(o.order_date) = YEAR(CURRENT_DATE())";
            
            $stmt = $this->conn->prepare($revenue_sql);
            $stmt->bind_param("i", $farmerId);
            $stmt->execute();
            $result = $stmt->get_result();
            $stats['monthly_revenue'] = $result->fetch_assoc()['monthly_revenue'] ?? 0;
            $stmt->close();
            
            // Products by category
            $category_sql = "SELECT c.name as category_name, COUNT(p.id) as product_count
                            FROM categories c
                            LEFT JOIN products p ON c.id = p.category_id AND p.farmer_id = ? AND p.status = 'active'
                            GROUP BY c.id, c.name
                            ORDER BY c.name";
            
            $stmt = $this->conn->prepare($category_sql);
            $stmt->bind_param("i", $farmerId);
            $stmt->execute();
            $result = $stmt->get_result();
            
            $categories = [];
            while ($row = $result->fetch_assoc()) {
                $categories[] = $row;
            }
            $stats['products_by_category'] = $categories;
            $stmt->close();
            
            // Recent orders
            $recent_orders_sql = "SELECT DISTINCT 
                                    o.id as order_id,
                                    o.order_date,
                                    o.status,
                                    u.full_name as customer_name,
                                    COUNT(oi.id) as item_count
                                 FROM orders o
                                 JOIN order_items oi ON o.id = oi.order_id
                                 JOIN products p ON oi.product_id = p.id
                                 JOIN user u ON o.customer_id = u.id
                                 WHERE p.farmer_id = ?
                                 GROUP BY o.id, o.order_date, o.status, u.full_name
                                 ORDER BY o.order_date DESC
                                 LIMIT 5";
            
            $stmt = $this->conn->prepare($recent_orders_sql);
            $stmt->bind_param("i", $farmerId);
            $stmt->execute();
            $result = $stmt->get_result();
            
            $recent_orders = [];
            while ($row = $result->fetch_assoc()) {
                $recent_orders[] = $row;
            }
            $stats['recent_orders'] = $recent_orders;
            $stmt->close();
            
            return $stats;
            
        } catch (Exception $e) {
            throw new Exception("Error fetching dashboard statistics: " . $e->getMessage());
        }
    }
    
    // Get all categories
    public function getCategories() {
        try {
            $sql = "SELECT id, name, description FROM categories ORDER BY name";
            
            $stmt = $this->conn->prepare($sql);
            $stmt->execute();
            $result = $stmt->get_result();
            
            $categories = [];
            while ($row = $result->fetch_assoc()) {
                $categories[] = $row;
            }
            
            $stmt->close();
            return $categories;
            
        } catch (Exception $e) {
            throw new Exception("Error fetching categories: " . $e->getMessage());
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
            
            if (!$farmerId) {
                throw new Exception("Farmer ID is required");
            }
            
            if (isset($_GET['type'])) {
                $type = $_GET['type'];
                
                switch ($type) {
                    case 'profile':
                        $profile = $this->getFarmerProfile($farmerId);
                        echo json_encode([
                            "success" => true,
                            "data" => $profile
                        ]);
                        break;
                        
                    case 'stats':
                        $stats = $this->getDashboardStats($farmerId);
                        echo json_encode([
                            "success" => true,
                            "data" => $stats
                        ]);
                        break;
                        
                    case 'categories':
                        $categories = $this->getCategories();
                        echo json_encode([
                            "success" => true,
                            "data" => $categories
                        ]);
                        break;
                        
                    default:
                        throw new Exception("Invalid type parameter");
                }
            } else {
                // Default: return both profile and stats
                $profile = $this->getFarmerProfile($farmerId);
                $stats = $this->getDashboardStats($farmerId);
                
                echo json_encode([
                    "success" => true,
                    "data" => [
                        "profile" => $profile,
                        "stats" => $stats
                    ]
                ]);
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
$farmerDashboard = new FarmerDashboard($conn);
$farmerDashboard->handleRequest();
?>
