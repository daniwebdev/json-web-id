<?php

function data($kay=null) {
    global $method;
    $data = [];

    //store the data from all request
    foreach($_REQUEST as $key => $value) {
        $data[$key] = $value;
    }

    foreach($_GET as $key => $value) {
        $data[$key] = $value;
    }

    //store the data from json
    $json = json_decode(file_get_contents('php://input'), true);

    if($json != null) {
        if(is_array($json)) {
            $data = array_merge($data, $json);
        } else {
            throw new Exception('No data found in POST', 400);
        }

    }

    //store the data from form
    if($method == 'POST') {
        if(count($_POST) > 0) {
            $data = array_merge($data, $_POST);
        }
    }

    if($kay != null) {
        return $data[$kay] ?? null;
    } else {
        return $data;
    }
}

function data_only() {
    $data = data();
    unset($data['uuid']);
    unset($data['key']);

    return $data;
}

//UUID v4
function uuid() {
    return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
    );
}

function connect($db) {
    $db_name = BASE_PATH . 'db/' . ($db != null ? md5(serialize($db)).'.db' : '_app.db');
    $is_exists = file_exists($db_name);

    $connection = new SQLite3($db_name);

    if(!$is_exists) {
        $connection->exec('CREATE TABLE IF NOT EXISTS _data (uuid TEXT PRIMARY KEY, body TEXT, user_key TEXT, created_at TEXT, updated_at TEXT)');
    }

    return $connection;
}

function query($query, $db=null) {
    $connection = connect($db);

    $output = [];

    $result = $connection->query($query);

    while($row = $result->fetchArray(SQLITE3_ASSOC)) {
        $output[] = $row;
    }

    return $output;
}

function execute($query, $db=null) {
    $connection = connect($db);
    $connection->exec($query);
}
