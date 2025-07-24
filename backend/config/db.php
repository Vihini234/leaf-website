<?php
$host = 'localhost';
$user = 'root';
$password = ''; // Default XAMPP password is blank
$dbname = 'leaf';

// Create DB connection
$conn = new mysqli($host, $user, $password, $dbname);

// Check DB connection
if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Database connection failed: ' . $conn->connect_error]));
}
?>
