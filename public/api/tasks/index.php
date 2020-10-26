<?php

use Predis\Client as RedisCient;
use Predis\Connection\ConnectionException;
use Pusher\Pusher;

require __DIR__ . './../../../vendor/autoload.php';

header('Content-Type: application/json');
$postData = json_decode(file_get_contents('php://input'), true);
$pusher = new Pusher('d7960a73386d2e4f3462', '7e7a92b9b762205a86ce', '1096793', ['cluster' => 'us2', 'useTLS' => true]);
$redis = new RedisCient();

try {
    $redis->ping();
} catch (Predis\Connection\ConnectionException $e) {
    echo json_encode(['error' => "Error connecting with Redis instance: {$e->getMessage()}"]);
    return http_response_code(500);
}

if (empty($postData['client_id'])) {
    return http_response_code(400);
}

$action = $_GET['action'] ?? 'none';
$clientName = "docler-client-{$postData['client_id']}";
$clientData = unserialize($redis->get($clientName) ?? 'a:1:{s:5:"tasks";a:0:{}}');

if ($action === 'clear_completed') {
    $clientData['tasks'] = array_values(array_filter($clientData['tasks'], function ($i) {
        return !$i['completed'];
    }));
}

if ($action === 'set_completed') {
    $clientData['tasks'] = array_map(function ($i) use ($postData) {
      if ($i['id'] === ($postData['id'])) {
        $i['completed'] = $postData['completed'];
      }
      return $i;
    }, $clientData['tasks']);
}

if ($action === 'add') {
  if (empty($postData['name'])) {
    return http_response_code(400);
  }
  $clientData['tasks'][] = ['name' => $postData['name'], 'id' => uniqid(), 'completed' => false];
}

$redis->set($clientName, serialize($clientData));
$pusher->trigger($clientName, 'state-changed', $clientData);

echo json_encode($clientData);
return http_response_code(200);
