<?php
define('BASE_PATH', __DIR__ . '/../');

//header("Content-Type: application/json");
//echo json_encode($_SERVER);
//die;

require_once BASE_PATH . 'vendor/autoload.php';


try {
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: POST, GET, DELETE, PUT, PATCH, OPTIONS');
        header('Access-Control-Allow-Headers: token, Content-Type');
        header('Access-Control-Max-Age: 1728000');
        header('Content-Length: 0');
        header('Content-Type: text/plain');
        die();
    }

    header('Access-Control-Allow-Origin: *');

    require_once BASE_PATH . 'src/index.php';
} catch (\Throwable $th) {
    header('Content-Type: application/json');
    echo json_encode([
        'status' => 'error',
        'message' => $th->getMessage(),
    ]);
}
