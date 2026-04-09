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

    // التأكد من أن المستخدم طالب
    if ($user['user_type'] !== 'student') {
        json_response(false, 'Access denied. Student only.');
    }

    // جلب بيانات الطالب من الجدولين
    $stmt = $pdo->prepare("
        SELECT 
            u.username,
            u.email,
            sp.full_name
        FROM users u
        LEFT JOIN student_profiles sp ON u.id = sp.user_id
        WHERE u.id = ? AND u.user_type = 'student'
    ");
    
    $stmt->execute([$user['id']]);
    $studentData = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$studentData) {
        json_response(false, 'Student not found');
    }

    // إرجاع البيانات
    json_response(true, 'Student data retrieved successfully', $studentData);

} catch(Exception $e) {
    error_log('Error: ' . $e->getMessage());
    json_response(false, 'Error: ' . $e->getMessage());
}
?> 