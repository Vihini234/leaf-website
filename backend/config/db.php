<?php
$host = 'localhost';
$user = 'root';
$password = ''; // Default XAMPP password is blank
$dbname = 'leaf';

try {
    // Create PDO connection
    $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];
    
    $pdo = new PDO($dsn, $user, $password, $options);
    
    // For backward compatibility, we'll also create a mysqli-like wrapper
    class PDOWrapper {
        private $pdo;
        
        public function __construct($pdo) {
            $this->pdo = $pdo;
        }
        
        public function prepare($sql) {
            return new PDOStatementWrapper($this->pdo->prepare($sql));
        }
        
        public function query($sql) {
            $stmt = $this->pdo->query($sql);
            return new PDOResultWrapper($stmt);
        }
        
        public function close() {
            $this->pdo = null;
        }
        
        public function __get($name) {
            if ($name === 'insert_id') {
                return $this->pdo->lastInsertId();
            }
            if ($name === 'error') {
                $errorInfo = $this->pdo->errorInfo();
                return $errorInfo[2] ?? '';
            }
            if ($name === 'host_info') {
                return $this->pdo->getAttribute(PDO::ATTR_SERVER_INFO);
            }
            if ($name === 'server_version') {
                return $this->pdo->getAttribute(PDO::ATTR_SERVER_VERSION);
            }
            if ($name === 'client_version') {
                return $this->pdo->getAttribute(PDO::ATTR_CLIENT_VERSION);
            }
            return null;
        }
    }
    
    class PDOStatementWrapper {
        private $stmt;
        public $affected_rows = 0;
        
        public function __construct($stmt) {
            $this->stmt = $stmt;
        }
        
        public function bind_param($types, ...$params) {
            foreach ($params as $index => $param) {
                $this->stmt->bindValue($index + 1, $param);
            }
            return true;
        }
        
        public function execute() {
            $result = $this->stmt->execute();
            $this->affected_rows = $this->stmt->rowCount();
            return $result;
        }
        
        public function get_result() {
            return new PDOResultWrapper($this->stmt);
        }
        
        public function close() {
            $this->stmt = null;
        }
        
        public function __get($name) {
            if ($name === 'affected_rows') {
                return $this->affected_rows;
            }
            return null;
        }
    }
    
    class PDOResultWrapper {
        private $stmt;
        public $num_rows = 0;
        
        public function __construct($stmt) {
            $this->stmt = $stmt;
            if ($stmt && method_exists($stmt, 'rowCount')) {
                $this->num_rows = $stmt->rowCount();
            }
        }
        
        public function fetch_assoc() {
            return $this->stmt ? $this->stmt->fetch(PDO::FETCH_ASSOC) : false;
        }
        
        public function fetch_row() {
            return $this->stmt ? $this->stmt->fetch(PDO::FETCH_NUM) : false;
        }
        
        public function __get($name) {
            if ($name === 'num_rows') {
                return $this->num_rows;
            }
            return null;
        }
    }
    
    $conn = new PDOWrapper($pdo);
    
} catch (PDOException $e) {
    die(json_encode(['success' => false, 'message' => 'Database connection failed: ' . $e->getMessage()]));
}
?>
