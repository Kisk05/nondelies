<?php
define('PYTHON_API_HOST', 'python_api');
define('PYTHON_API_PORT', '5000');
define('API_ROUTE', '/difference');

$alat_input = isset($_GET['lat1']) ? $_GET['lat1'] : null;
$alon_input = isset($_GET['lon1']) ? $_GET['lon1'] : null;
$blat_input = isset($_GET['lat2']) ? $_GET['lat2'] : null;
$blon_input = isset($_GET['lon2']) ? $_GET['lon2'] : null;

// 必須パラメータがない場合
if (is_null($alat_input)||is_null($alon_input)||is_null($blat_input)||is_null($blon_input)) {
    http_response_code(400);
    echo "エラー: 二点の座標を指定してください";
    exit;
}

$encoded_alat = urlencode($alat_input);
$encoded_alon = urlencode($alon_input);
$encoded_blat = urlencode($blat_input);
$encoded_blon = urlencode($blon_input);

$url = "http://" . PYTHON_API_HOST . ":" . PYTHON_API_PORT . API_ROUTE . "?lat1=" . $encoded_alat . "&lon1=" . $encoded_alon . "&lat2=" . $encoded_blat . "&lon2=" . $encoded_blon;

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
    http_response_code($http_code);
    echo json_encode([
        'status' => 'error',
        'message' => "PYTHON APIエラー: " . ($data['message'] ?? '応答メッセージなし'),
        'http_code' => $http_code
    ]);
    exit;
}

if (isset($data['status']) && $data['status'] === 'success') {
    // 成功時の処理
    echo json_encode([
        'status' => 'success',
        'difference' => $data['result'],
        'message' => $data['message']
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