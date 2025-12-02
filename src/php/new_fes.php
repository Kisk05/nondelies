<?php
// データベースに新規祭り情報を登録

define('DB_HOST', 'db');
define('DB_NAME', 'ndl_db');
define('DB_USER', 'ndl_user');
define('DB_PASS', 'ndl_passwd');

$response = ['status' => 'error', 'data' => []];

try{
    $db=new PDO('mysql:dbname='.DB_NAME.';host='.DB_HOST.';charset=utf8mb4',DB_USER,DB_PASS);
    $sql='INSERT INTO fes(sup_id,event_id,fes_name,fes_info) VALUES (:sup_id,:event_id,:fes_name,:fes_info)';
    $stmt = $db->prepare($sql);

    // 値を取得
    $set_supId = $_GET['sup_id'] ?? null;
    $set_eventId = $_GET['event_id'] ?? null;
    $set_fesName = $_GET['fes_name'] ?? null;
    $set_fesInfo = $_GET['fes_info'] ?? null;
    
    if (is_null($set_supId) || is_null($set_eventId) || is_null($set_fesName)){
        header('Content-Type: application/json');
        http_response_code(400);
        $response=[
            'status' => 'error', 
            'messages' => "必須情報を指定してください"
            ]
        echo json_encode($response);
        exit;
    }

    // パラメータに代入
    $stmt->bindParam(':sup_id', $set_supId, PDO::PARAM_INT);
    $stmt->bindParam(':event_id', $set_eventId, PDO::PARAM_INT);
    $stmt->bindParam(':fes_name', $set_fesName, PDO::PARAM_STR);
    $stmt->bindParam(':fes_info', $set_fesInfo, PDO::PARAM_STR);
    
    // 実行
    $stmt->execute();

    // JSONに変換
    header('Content-Type: application/json');
    $response=[
        'status' => 'success',
        'message' => 'イベントを登録しました。'
        ]
    echo json_encode($response);
} catch(PDOException $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    $response=[
        'status' => 'error', 
        'message' => $e->getMessage()
        ]
    echo json_encode($response);
}