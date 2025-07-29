<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../../config/db.php';

class LoginManager {
    private $conn;
    private $roleMap;

    public function __construct($connection) {
        $this->conn = $connection;
        $this->roleMap = [
            "Customer" => "consumer",
            "Farmer" => "farmer", 
            "Delivery" => "delivery-agent"
        ];
    }

    public function validateInput($data) {
        if (!isset($data->email, $data->password, $data->role)) {
            throw new Exception("Missing required fields.");
        }
        
        if (!filter_var($data->email, FILTER_VALIDATE_EMAIL)) {
            throw new Exception("Invalid email format.");
        }
        
        if (!isset($this->roleMap[$data->role])) {
            throw new Exception("Invalid role.");
        }
    }

    public function authenticateUser($email, $password, $role) {
        $dbRole = $this->roleMap[$role];
        
        $sql = "SELECT * FROM user WHERE email = ? AND role = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("ss", $email, $dbRole);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result && $result->num_rows === 1) {
            $user = $result->fetch_assoc();
            if (password_verify($password, $user['password'])) {
                $stmt->close();
                return $this->formatSuccessResponse($user, $role);
            } else {
                $stmt->close();
                throw new Exception("Invalid password");
            }
        } else {
            $stmt->close();
            throw new Exception("User not found");
        }
    }

    private function formatSuccessResponse($user, $role) {
        return [
            "success" => true,
            "message" => "Login successful",
            "role" => $role,
            "user" => [
                "id" => $user['id'],
                "name" => $user['full_name'] ?? $user['name'] ?? '',
                "email" => $user['email']
            ]
        ];
    }

    public function handleLogin() {
        try {
            $data = json_decode(file_get_contents("php://input"));
            
            $this->validateInput($data);
            
            $response = $this->authenticateUser($data->email, $data->password, $data->role);
            echo json_encode($response);
            
        } catch (Exception $e) {
            echo json_encode(["success" => false, "message" => $e->getMessage()]);
        } finally {
            $this->conn->close();
        }
    }
}

// Initialize and handle login
$loginManager = new LoginManager($conn);
$loginManager->handleLogin();
