<?php
// データベースに新規店舗情報を登録

define('DB_HOST', 'db');
define('DB_NAME', 'ndl_db');
define('DB_USER', 'ndl_user');
define('DB_PASS', 'ndl_passwd');

$ERROR=array();

try{
    $options = [PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8mb4',];
    $dsn = 'mysql:dbname='.DB_NAME.';host='.DB_HOST.';charset=utf8mb4';
    
    // 操作用オブジェクト作成
    $db = new PDO($dsn, DB_USER, DB_PASS, $options);
    //　SQL文
    $sql='INSERT INTO holiday(sup_id,event_id,hol_name,hol_info) VALUES (:sup_id,:event_id,:hol_name,:hol_info)';

    // SQL実行の準備
    $stmt = $db->prepare($sql);

    // 値を取得
    $set_supId = $_GET['sup_id'] ?? null;
    $set_eventId = $_GET['event_id'] ?? null;
    $set_holName = $_GET['hol_name'] ?? null;
    $set_holInfo = $_GET['hol_info'] ?? null;
    
    if (is_null($set_supId) || is_null($set_eventId) || is_null($set_holName)){
        $ERROR[]="必須情報を指定してください";
        header('Content-Type: application/json');
        http_response_code(400); 
        echo json_encode(['status' => 'error', 'messages' => $ERROR]);
        exit;
    }

    // パラメータに代入
    $stmt->bindParam(':sup_id', $set_supId, PDO::PARAM_INT);
    $stmt->bindParam(':event_id', $set_eventId, PDO::PARAM_INT);
    $stmt->bindParam(':hol_name', $set_holName, PDO::PARAM_STR);
    $stmt->bindParam(':hol_info', $set_holInfo, PDO::PARAM_STR);
    
    // 実行
    $stmt->execute();

    // JSONに変換
    header('Content-Type: application/json');
    echo json_encode(['status' => 'success', 'message' => 'イベントを登録しました。']);
} catch(PDOException $e) {
	$ERROR[] = $e->getMessage();
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode(['status' => 'error', 'messages' => $ERROR]);
}