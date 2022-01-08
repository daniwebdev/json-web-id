<?php
$read_dir = scandir('./db');

foreach ($read_dir as $file) {
    if ($file != '.' && $file != '..' && $file != '.gitignore') {
        unlink('./db/' . $file);
    }
}