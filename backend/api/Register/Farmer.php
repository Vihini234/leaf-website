<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Handle CORS preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    http_response_code(200);
    exit();
}

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Include DB connection
include_once '../../config/db.php';

class FarmerRegistration {
    private $conn;
    private $requiredFields;
    
    public function __construct($connection) {
        $this->conn = $connection;
        $this->requiredFields = ['fullName', 'email', 'phoneNumber', 'district', 'address', 'password', 'confirmPassword'];
    }
    
    public function validateInput($data) {
        // Check required fields
        foreach ($this->requiredFields as $field) {
            if (empty($data[$field])) {
                throw new Exception("$field is required");
            }
        }
        
        // Validate email format
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            throw new Exception("Invalid email format");
        }
        
        // Check password match
        if ($data['password'] !== $data['confirmPassword']) {
            throw new Exception("Passwords do not match");
        }
        
        // Validate password strength (optional)
        if (strlen($data['password']) < 6) {
            throw new Exception("Password must be at least 6 characters long");
        }
    }
    
    public function checkEmailExists($email) {
        $check_sql = "SELECT * FROM user WHERE email = ?";
        $stmt = $this->conn->prepare($check_sql);
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        $exists = $result && $result->num_rows > 0;
        $stmt->close();
        return $exists;
    }
    
    private function sanitizeData($data) {
        return [
            'role' => 'farmer',
            'fullName' => trim($data['fullName']),
            'email' => trim(strtolower($data['email'])),
            'phoneNumber' => trim($data['phoneNumber']),
            'district' => trim($data['district']),
            'address' => trim($data['address']),
            'farmName' => trim($data['farmName'] ?? ''),
            'specialties' => trim($data['specialties'] ?? ''),
            'bankAccount' => trim($data['bankAccount'] ?? ''),
            'password' => password_hash($data['password'], PASSWORD_BCRYPT)
        ];
    }
    
    public function createFarmer($data) {
        $sanitizedData = $this->sanitizeData($data);
        
        // Check if email already exists
        if ($this->checkEmailExists($sanitizedData['email'])) {
            throw new Exception("Email already exists");
        }
        
        // Insert into database
        $insert_sql = "INSERT INTO user 
            (role, full_name, email, phone_number, district, address, farm_name, specialties, bank_account, password) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $this->conn->prepare($insert_sql);
        $stmt->bind_param(
            "ssssssssss",
            $sanitizedData['role'],
            $sanitizedData['fullName'],
            $sanitizedData['email'],
            $sanitizedData['phoneNumber'],
            $sanitizedData['district'],
            $sanitizedData['address'],
            $sanitizedData['farmName'],
            $sanitizedData['specialties'],
            $sanitizedData['bankAccount'],
            $sanitizedData['password']
        );
        
        if (!$stmt->execute()) {
            $stmt->close();
            throw new Exception("Database error: " . $this->conn->error);
        }
        
        $stmt->close();
        return true;
    }
    
    public function handleRegistration() {
        try {
            $data = json_decode(file_get_contents("php://input"), true);
            
            if (!$data) {
                throw new Exception("Invalid JSON data");
            }
            
            $this->validateInput($data);
            $this->createFarmer($data);
            
            echo json_encode(['success' => true, 'message' => 'Farmer account created successfully']);
            
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        } finally {
            if ($this->conn) {
                $this->conn->close();
            }
        }
    }
}

// Initialize and handle registration
$farmerRegistration = new FarmerRegistration($conn);
$farmerRegistration->handleRegistration();
?>
