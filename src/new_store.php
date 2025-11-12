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
    $sql='INSERT INTO store(sup_id,sto_name,sto_postcode,sto_address,sto_latitude,sto_longitude) VALUES(:sup_id,:sto_name,:sto_postcode,:sto_address,:sto_latitude,:sto_longitude)';

    // SQL実行の準備
    $stmt = $db->prepare($sql);

    // 値を取得
    $set_supid = (int)($_GET['sup_id'] ?? null);
    $set_stona = $_GET['sto_name'] ?? null;
    $set_postcode = $_GET['sto_postcode'] ?? null;
    $set_address = $_GET['sto_address'] ?? null;
    $set_lat = (float)($_GET['sto_latitude'] ?? null);
    $set_lon = (float)($_GET['sto_longitude'] ?? null);
    
    if (is_null($set_supid)){
        $ERROR[]="sup_idを指定してください";
    }

    // パラメータに代入
    $stmt->bindParam(':sup_id', $set_supid, PDO::PARAM_INT);
    $stmt->bindParam(':sto_name', $set_stona, PDO::PARAM_STR);
    $stmt->bindParam(':sto_postcode', $set_postcode, PDO::PARAM_STR);
    $stmt->bindParam(':sto_address', $set_address, PDO::PARAM_STR);
    $stmt->bindParam(':sto_latitude', $set_lat, PDO::PARAM_STR);
    $stmt->bindParam(':sto_longitude', $set_lon, PDO::PARAM_STR);
    
    // 実行
    $stmt->execute();

    // JSONに変換
    header('Content-Type: application/json');
    echo json_encode(['status' => 'success', 'message' => '店舗情報を登録しました。']);
} catch(PDOException $e) {
	$ERROR[] = $e->getMessage();
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode(['status' => 'error', 'messages' => $ERROR]);
}