<?php
require_once 'config/connection.php';
require_once 'includes/functions.php';

// استلام البيانات
$data = json_decode(file_get_contents('php://input'), true);
$email = sanitize_input($data['email']);
$password = $data['password'];
$user_type = sanitize_input($data['user_type']);

try {
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? AND user_type = ?");
    $stmt->execute([$email, $user_type]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password'])) {
        // إنشاء token
        $token = generateJWT([
            'id' => $user['id'],
            'email' => $user['email'],
            'user_type' => $user['user_type']
        ]);
        
        json_response(true, 'Login successful', [
            'token' => $token,
            'user' => [
                'id' => $user['id'],
                'email' => $user['email'],
                'user_type' => $user['user_type'],
                'username' => $user['username']
            ]
        ]);
    } else {
        json_response(false, 'Invalid credentials');
    }
} catch(PDOException $e) {
    json_response(false, 'Database error: ' . $e->getMessage());
}
?>
