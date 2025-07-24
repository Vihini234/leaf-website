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

// Get the JSON input
$data = json_decode(file_get_contents("php://input"), true);

// Validate required fields
$required_fields = ['fullName', 'email', 'phoneNumber', 'district', 'address', 'password', 'confirmPassword'];

foreach ($required_fields as $field) {
    if (empty($data[$field])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => "$field is required"]);
        exit();
    }
}

// Check password match
if ($data['password'] !== $data['confirmPassword']) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Passwords do not match']);
    exit();
}

// Sanitize and extract values
$role = 'farmer';
$fullName = $data['fullName'];
$email = $data['email'];
$phoneNumber = $data['phoneNumber'];
$district = $data['district'];
$address = $data['address'];
$farmName = $data['farmName'] ?? '';
$specialties = $data['specialties'] ?? '';
$bankAccount = $data['bankAccount'] ?? '';
$password = password_hash($data['password'], PASSWORD_BCRYPT);

// Check if email already exists
$check_sql = "SELECT * FROM user WHERE email = ?";
$stmt = $conn->prepare($check_sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$check_result = $stmt->get_result();

if ($check_result && $check_result->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Email already exists']);
    exit();
}
$stmt->close();

// Insert into database
$insert_sql = "INSERT INTO user 
(role, full_name, email, phone_number, district, address, farm_name, specialties, bank_account, password) 
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($insert_sql);
$stmt->bind_param(
    "ssssssssss",
    $role, $fullName, $email, $phoneNumber, $district, $address, $farmName, $specialties, $bankAccount, $password
);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Farmer account created successfully']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error: ' . $conn->error]);
}
$stmt->close();
?>
