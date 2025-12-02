<?php
// データベースに新規お得日情報を登録

define('DB_HOST', 'db');
define('DB_NAME', 'ndl_db');
define('DB_USER', 'ndl_user');
define('DB_PASS', 'ndl_passwd');

$ERROR=array();

try{
    $db=new PDO('mysql:dbname='.DB_NAME.';host='.DB_HOST.';charset=utf8mb4',DB_USER,DB_PASS);
    $sql='INSERT INTO sales(sup_id,event_id,sal_kind,sal_discount,sal_info) VALUES (:sup_id,:event_id,:sal_kind,:sal_discount,:sal_info)';
    $stmt = $db->prepare($sql);

    // 値を取得
    $set_supId = $_GET['sup_id'] ?? null;
    $set_eventId = $_GET['event_id'] ?? null;
    $set_saleKind = $_GET['sal_kind'] ?? null;
    $set_saleDisc = $_GET['sal_discount'] ?? null;
    $set_saleInfo = $_GET['sal_info'] ?? null;
    
    if (is_null($set_supId) || is_null($set_eventId) || is_null($set_saleKind)){
        $ERROR[]="必須情報を指定してください";
        header('Content-Type: application/json');
        http_response_code(400); 
        echo json_encode(['status' => 'error', 'messages' => $ERROR]);
        exit;
    }

    // パラメータに代入
    $stmt->bindParam(':sup_id', $set_supId, PDO::PARAM_INT);
    $stmt->bindParam(':event_id', $set_eventId, PDO::PARAM_INT);
    $stmt->bindParam(':sal_kind', $set_saleKind, PDO::PARAM_STR);
    $stmt->bindParam(':sal_discount', $set_saleDisc, PDO::PARAM_INT);
    $stmt->bindParam(':sal_info', $set_saleInfo, PDO::PARAM_STR);
    
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