<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Include DB config
include_once('../../config/db.php');

// Connect to DB
$conn = new mysqli($host, $user, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit();
}

// Get POST data
$data = json_decode(file_get_contents("php://input"), true);

// Required fields
$required = ['fullName', 'email', 'phoneNumber', 'district', 'address', 'vehicleType', 'licenseNumber', 'serviceAreas', 'password'];

foreach ($required as $field) {
    if (!isset($data[$field]) || empty($data[$field])) {
        echo json_encode(["success" => false, "message" => "$field is required"]);
        exit();
    }
}

// Escape data to prevent SQL injection
$fullName = $conn->real_escape_string($data['fullName']);
$email = $conn->real_escape_string($data['email']);
$phoneNumber = $conn->real_escape_string($data['phoneNumber']);
$district = $conn->real_escape_string($data['district']);
$address = $conn->real_escape_string($data['address']);
$vehicleType = $conn->real_escape_string($data['vehicleType']);
$licenseNumber = $conn->real_escape_string($data['licenseNumber']);
$serviceAreas = $conn->real_escape_string(json_encode($data['serviceAreas']));
$password = password_hash($data['password'], PASSWORD_DEFAULT); // Encrypt password
$role = 'delivery-agent';

// Check if email already exists
$check_sql = "SELECT * FROM user WHERE email = ?";
$check_stmt = $conn->prepare($check_sql);
$check_stmt->bind_param("s", $email);
$check_stmt->execute();
$check_result = $check_stmt->get_result();
if ($check_result && $check_result->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "Email already exists"]);
    $check_stmt->close();
    $conn->close();
    exit();
}
$check_stmt->close();

// Insert into DB
$sql = "INSERT INTO user (role, full_name, email, phone_number, district, address, vehicle_type, license_number, service_areas, password)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ssssssssss", $role, $fullName, $email, $phoneNumber, $district, $address, $vehicleType, $licenseNumber, $serviceAreas, $password);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Delivery agent registered successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Registration failed", "error" => $stmt->error]);
}

$stmt->close();
$conn->close();
