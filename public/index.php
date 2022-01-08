<?php
define('BASE_PATH', __DIR__ . '/../');

//header("Content-Type: application/json");
//echo json_encode($_SERVER);
//die;

require_once BASE_PATH . 'vendor/autoload.php';


try {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header("Access-Control-Allow-Headers: *");


    require_once BASE_PATH . 'src/index.php';
} catch (\Throwable $th) {
    header('Content-Type: application/json');
    echo json_encode([
        'status' => 'error',
        'message' => $th->getMessage(),
    ]);
}
