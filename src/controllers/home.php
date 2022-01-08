<?php
$template = file_get_contents(BASE_PATH . 'html/index.html');

$variables = [
    '{{ title }}' => 'Home',
    '{{ content }}' => $load_html,
];

$parsed_html = str_replace(array_keys($variables), array_values($variables), $template);

header('Content-Type: text/html');
echo $parsed_html;