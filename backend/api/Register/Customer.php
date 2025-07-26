<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Include DB connection
include_once '../../config/db.php';

// Get POST data
$data = json_decode(file_get_contents("php://input"), true);

// Validate required fields
$required_fields = ['fullName', 'email', 'phoneNumber', 'district', 'address', 'password'];
foreach ($required_fields as $field) {
    if (empty($data[$field])) {
        echo json_encode(["success" => false, "message" => "$field is required"]);
        exit;
    }
}

// Extract & sanitize inputs
$role = 'consumer';
$fullName = $conn->real_escape_string($data['fullName']);
$email = $conn->real_escape_string($data['email']);
$phoneNumber = $conn->real_escape_string($data['phoneNumber']);
$district = $conn->real_escape_string($data['district']);
$address = $conn->real_escape_string($data['address']);
$password = password_hash($data['password'], PASSWORD_BCRYPT);

// Check if email already exists
$check_sql = "SELECT * FROM user WHERE email = '$email'";
$check_result = $conn->query($check_sql);
if ($check_result && $check_result->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "Email already exists"]);
    $conn->close();
    exit;
}

// Insert into users table
$sql = "INSERT INTO user (role, full_name, email, phone_number, district, address, password)
        VALUES ('$role', '$fullName', '$email', '$phoneNumber', '$district', '$address', '$password')";

if ($conn->query($sql)) {
    echo json_encode(["success" => true, "message" => "Customer account created successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Error: " . $conn->error]);
}

$conn->close();
?>
