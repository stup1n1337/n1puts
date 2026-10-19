<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
$dir = __DIR__ . '/../memes';
$allowed = ['jpg','jpeg','png','gif','webp','avif'];
$files = [];
if (is_dir($dir)) foreach (scandir($dir) ?: [] as $name) {
  if ($name === '.' || $name === '..' || str_starts_with($name, '.')) continue;
  $path = $dir . DIRECTORY_SEPARATOR . $name;
  if (is_file($path) && in_array(strtolower(pathinfo($name, PATHINFO_EXTENSION)), $allowed, true)) $files[] = $name;
}
echo json_encode(['files'=>$files], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
