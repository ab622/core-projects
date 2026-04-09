<?php
require_once 'config/connection.php';
require_once 'includes/functions.php';
require_once 'includes/auth_middleware.php';

try {
    // التحقق من الـ token
    $user = authenticateRequest();
    
    if (!$user) {
        json_response(false, 'Invalid token');
    }

    json_response(true, 'Logged out successfully');
    
} catch(Exception $e) {
    json_response(false, 'Error during logout: ' . $e->getMessage());
}
?>
