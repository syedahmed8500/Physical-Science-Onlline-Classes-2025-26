<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validate required fields
    $required = ['fullName', 'fatherName', 'email', 'phone', 'course'];
    foreach ($required as $field) {
        if (empty($input[$field])) {
            http_response_code(400);
            echo json_encode(['error' => "Missing required field: $field"]);
            exit;
        }
    }
    
    // Sanitize data
    $data = [
        'id' => uniqid(),
        'fullName' => htmlspecialchars($input['fullName']),
        'fatherName' => htmlspecialchars($input['fatherName']),
        'email' => filter_var($input['email'], FILTER_SANITIZE_EMAIL),
        'phone' => htmlspecialchars($input['phone']),
        'course' => htmlspecialchars($input['course']),
        'additionalInfo' => htmlspecialchars($input['additionalInfo'] ?? ''),
        'timestamp' => date('Y-m-d H:i:s'),
        'status' => 'New'
    ];
    
    // Save to JSON file
    $filename = 'registrations.json';
    $registrations = [];
    
    if (file_exists($filename)) {
        $registrations = json_decode(file_get_contents($filename), true) ?? [];
    }
    
    $registrations[] = $data;
    
    if (file_put_contents($filename, json_encode($registrations, JSON_PRETTY_PRINT))) {
        echo json_encode(['success' => true, 'message' => 'Registration saved successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to save registration']);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>
