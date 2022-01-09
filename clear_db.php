<?php


$read_dir = scandir(__DIR__ . '/db');

foreach ($read_dir as $file) {
    if ($file != '.' && $file != '..' && $file != '.gitignore') {
        unlink(__DIR__ . '/db/' . $file);
    }
}
