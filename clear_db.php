<?php

$read_dir = scandir(__DIR__ . '/db');

foreach ($read_dir as $file) {
    if ($file != '.' && $file != '..' && $file != '.gitignore') {
        unlink(__DIR__ . '/db/' . $file);
    }
}


require_once __DIR__.'/vendor/autoload.php';
define('BASE_PATH', __DIR__ . '/');

for($i = 0; $i <= 10; $i++) {
    $data = [];
    $faker = Faker\Factory::create();
    $data['name'] = $faker->name();
    $data['email'] = $faker->email();
    $data['phone'] = $faker->phoneNumber();
    $data['address'] = str_replace("'", "''", $faker->address());

    $body = json_encode($data);
    $key = null;
    $now = date('Y-m-d H:i:s');
    $uuid = uuid();

    execute("INSERT INTO _data (uuid, body, user_key, created_at, updated_at) VALUES ('$uuid', '$body', '$key', '$now', '$now')", $key);

}