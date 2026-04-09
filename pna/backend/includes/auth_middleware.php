<?php
require_once 'functions.php';

function authenticateRequest() {
    $headers = getallheaders();
    if (!isset($headers['Authorization'])) {
        json_response(false, 'No token provided', null, 401);
    }
    
    $token = str_replace('Bearer ', '', $headers['Authorization']);
    $payload = verifyJWT($token);
    
    if (!$payload) {
        json_response(false, 'Invalid token', null, 401);
    }
    
    return $payload;
}
?>
