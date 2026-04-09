<?php
require_once 'config/connection.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    try {
        // للتأكد من وصول البيانات
        error_log("Received data: " . print_r($data, true));
        
        // التحقق من البيانات
        if (empty($data['username']) || empty($data['email']) || empty($data['password']) || empty($data['user_type'])) {
            throw new Exception('All fields are required');
        }

        // التحقق من عدم تكرار البريد الإلكتروني
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$data['email']]);
        if ($stmt->rowCount() > 0) {
            throw new Exception('Email already exists');
        }

        // تشفير كلمة المرور
        $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);

        // إدخال المستخدم الجديد
        $stmt = $pdo->prepare("INSERT INTO users (username, email, password, user_type) VALUES (?, ?, ?, ?)");
        
        // للتأكد من تنفيذ الأمر
        $success = $stmt->execute([
            $data['username'],
            $data['email'],
            $hashedPassword,
            $data['user_type']
        ]);

        if (!$success) {
            error_log("Database error: " . print_r($stmt->errorInfo(), true));
            throw new Exception('Database error occurred');
        }

        $userId = $pdo->lastInsertId();
        error_log("New user ID: " . $userId);

        echo json_encode(['success' => true, 'message' => 'Registration successful']);
    } catch (Exception $e) {
        error_log("Error: " . $e->getMessage());
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}
?>
