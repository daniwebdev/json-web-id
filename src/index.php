<?php

$route_path = $_SERVER['PATH_INFO'] ?? explode('?', $_SERVER['REQUEST_URI'])[0];
$method     = $_SERVER['REQUEST_METHOD'];

if($route_path == '' || $route_path == '/') {
    return require_once BASE_PATH . 'src/controllers/home.php';

} else if(preg_match("/\/app(.*)/", $route_path)) {
    $path      = explode('/', $route_path);
    $namespace = $path[2];
    require_once BASE_PATH . 'src/controllers/app.php';
} else {
    require_once BASE_PATH . 'src/controllers/404.php';

}
