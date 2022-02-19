<?php
$method = $_SERVER['REQUEST_METHOD'];
$key   = $_SERVER['HTTP_X_API_KEY'].$namespace;

function GET() {
    global $key;
    $uuid  = data('uuid');

    if($uuid != null) {
        $query = query("SELECT * FROM _data WHERE uuid = '$uuid'", $key);
    } else {
        $query = query("SELECT * FROM _data", $key);
    }

    $output = [];

    foreach($query as $row) {
        $data = $row;
        $body = json_decode($row['body'], true);

        unset($data['body']);
        unset($data['user_key']);

        $data = array_merge($data, $body);

        $output[] = $data;
    }

    header('Content-Type: application/json');

    echo json_encode([
        'status' => 'success',
        'message' => 'Data retrieved',
        'data' => $output,
    ]);
}

function POST() {
    /* Add Data */
    global $key;

    $uuid = uuid();

    $body = json_encode(data_only());
    $now = date('Y-m-d H:i:s');

    execute("INSERT INTO _data (uuid, body, user_key, created_at, updated_at) VALUES ('$uuid', '$body', '$key', '$now', '$now')", $key);

    header('Content-Type: application/json');
    
    echo json_encode([
        'status' => 'success',
        'message' => 'Data has been added',
        'data' => array_merge(data_only(), [
            'uuid' => $uuid,
            'created_at' => $now,
            'updated_at' => $now
        ]),
    ]);
}

function PUT() {
    global $key;
    $uuid  = data('uuid');
    $now = date('Y-m-d H:i:s');
    
    if($uuid == null) {
        header('Content-Type: application/json');
        http_response_code(400);

        echo json_encode([
            'status' => 'error',
            'message' => 'UUID is required',
        ]);
        return;
    }

    $body = json_encode(data_only());

    execute("UPDATE _data SET body = '$body', user_key = '$key', updated_at = '$now' WHERE uuid = '$uuid'", $key);

    header('Content-Type: application/json');
    echo json_encode([
        'status' => 'success',
        'message' => 'Data has been updated',
        'data' => array_merge(data_only(), [
            'uuid' => $uuid,
            'updated_at' => $now,
        ]),
    ]);
}

function DELETE() {
    global $key;
    $uuid  = data('uuid');
    if($uuid == null) {
        header('Content-Type: application/json');
        http_response_code(400);
        
        echo json_encode([
            'status' => 'error',
            'message' => 'UUID is required',
        ]);
        return;
    }
    
    execute("DELETE FROM _data WHERE uuid = '$uuid'", $key);

    header('Content-Type: application/json');
    echo json_encode([
        'status' => 'success',
        'message' => 'Data has been deleted',
    ]);
}

function PATCH() {

}

if(in_array($method, ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'])) {
    $method();
} else {
    require_once BASE_PATH . 'src/controllers/404.php';
}
