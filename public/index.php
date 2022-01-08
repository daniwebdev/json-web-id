<?php
define('BASE_PATH', __DIR__ . '/../');

require_once BASE_PATH . 'vendor/autoload.php';


try {
    require_once BASE_PATH . 'src/index.php';
} catch (\Throwable $th) {
    header('Content-Type: application/json');
    echo json_encode([
        'status' => 'error',
        'message' => $th->getMessage(),
    ]);
}