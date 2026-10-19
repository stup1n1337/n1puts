<?php
// Place this file at /var/www/n1puts.ru/api/memes.php
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
$dir = dirname(__DIR__) . '/memes';
$allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif'];
$files = [];
if (is_dir($dir)) {
    foreach (scandir($dir) as $name) {
        if ($name === '.' || $name === '..') continue;
        $path = $dir . DIRECTORY_SEPARATOR . $name;
        if (!is_file($path)) continue;
        $ext = strtolower(pathinfo($name, PATHINFO_EXTENSION));
        if (in_array($ext, $allowed, true)) $files[] = $name;
    }
}
echo json_encode(['files' => $files], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
