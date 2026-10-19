<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('X-Content-Type-Options: nosniff');

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method !== 'GET' && $method !== 'POST') {
    http_response_code(405);
    header('Allow: GET, POST');
    echo json_encode(['error' => 'method_not_allowed']);
    exit;
}

$dataDir = __DIR__ . '/data';
if (!is_dir($dataDir) && !mkdir($dataDir, 0775, true) && !is_dir($dataDir)) {
    http_response_code(500);
    echo json_encode(['error' => 'storage_unavailable']);
    exit;
}
$file = $dataDir . '/count.txt';
$handle = fopen($file, 'c+');
if ($handle === false || !flock($handle, LOCK_EX)) {
    http_response_code(500);
    echo json_encode(['error' => 'storage_unavailable']);
    exit;
}
rewind($handle);
$raw = stream_get_contents($handle);
$count = max(0, (int)trim($raw === false ? '0' : $raw));
if ($method === 'POST') {
    $count++;
    rewind($handle);
    ftruncate($handle, 0);
    fwrite($handle, (string)$count);
    fflush($handle);
}
flock($handle, LOCK_UN);
fclose($handle);
echo json_encode(['count' => $count], JSON_UNESCAPED_UNICODE);
