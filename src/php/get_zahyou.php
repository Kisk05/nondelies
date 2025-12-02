<?php
define('PYTHON_API_HOST', 'python_api');
define('PYTHON_API_PORT', '5000');
define('API_ROUTE', '/geocode_address');

$address_input = isset($_GET['address']) ? $_GET['address'] : null;

// 必須パラメータがない場合
if (is_null($address_input)) {
    http_response_code(400);
    echo "エラー: 住所(address)を指定してください";
    exit;
}

$encoded_address = urlencode($address_input);

$url = "http://" . PYTHON_API_HOST . ":" . PYTHON_API_PORT . API_ROUTE . "?address=" . $encoded_address;

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // 応答を文字列として取得
curl_setopt($ch, CURLOPT_TIMEOUT, 10); // タイムアウト設定

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curl_error = curl_error($ch);
curl_close($ch);

header('Content-Type: application/json');

if ($response === false) {
    // ネットワークレベルのエラー (コンテナが見つからないなど)
    http_response_code(503);
    echo "FATAL ERROR: Python APIへの接続に失敗しました。cURLエラー: " . $curl_error;
    exit;
}

$data = json_decode($response, true);

if ($http_code !== 200) {
    // Python側で発生したエラー (400や500など)
    echo "PYTHON APIエラー (HTTP CODE: $http_code):\n";
    echo "メッセージ: " . ($data['message'] ?? '応答メッセージなし');
    exit;
}

if (isset($data['status']) && $data['status'] === 'success') {
    // 成功時の処理
    echo json_encode([
        'status' => 'success',
        'address' => $data['address'] ?? $address_input,
        'latitude' => $data['latitude'],
        'longitude' => $data['longitude']
    ]);
} else {
    // Python側で座標が見つからなかった場合のエラー
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => $data['message'] ?? '住所が見つかりませんでした。'
    ]);
}

?>