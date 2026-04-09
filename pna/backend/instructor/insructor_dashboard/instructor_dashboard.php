<?php
require_once '../../config/connection.php';
require_once '../../includes/functions.php';
require_once '../../includes/auth_middleware.php';

try {
    // التحقق من الـ token
    $user = authenticateRequest();
    
    if (!$user) {
        json_response(false, 'Unauthorized access');
    }

    // التأكد من أن المستخدم مدرس
    if ($user['user_type'] !== 'instructor') {
        json_response(false, 'Access denied. Instructor only.');
    }

    // جلب بيانات المدرس من الجدولين
    $stmt = $pdo->prepare("
        SELECT 
            u.username,
            u.email,
            ip.full_name,
            ip.specialization
        FROM users u
        LEFT JOIN instructor_profiles ip ON u.id = ip.user_id
        WHERE u.id = ? AND u.user_type = 'instructor'
    ");
    
    $stmt->execute([$user['id']]);
    $instructorData = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$instructorData) {
        json_response(false, 'Instructor not found');
    }

    // إرجاع البيانات
    json_response(true, 'Instructor data retrieved successfully', $instructorData);

} catch(Exception $e) {
    error_log('Error: ' . $e->getMessage());
    json_response(false, 'Error: ' . $e->getMessage());
}
?> 