<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$filename = 'registrations.json';
$registrations = [];

if (file_exists($filename)) {
    $registrations = json_decode(file_get_contents($filename), true) ?? [];
}

echo json_encode($registrations);
?>
