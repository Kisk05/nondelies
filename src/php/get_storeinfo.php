<?php
// 指定された店舗の住所を取得

define('DB_HOST', 'db');
define('DB_NAME', 'ndl_db');
define('DB_USER', 'ndl_user');
define('DB_PASS', 'ndl_passwd');

$response = ['status' => 'error', 'data' => []];

try{
    $db=new PDO('mysql:dbname='.DB_NAME.';host='.DB_HOST.';charset=utf8mb4',DB_USER,DB_PASS);
    $sql='SELECT sto_name,sto_postcode,sto_address FROM store WHERE sup_id=:sup_id AND sto_id=:sto_id';
    $stmt = $db->prepare($sql);

    // パラメータを代入
    $set_supid=isset($_GET['sup_id'])?(int)$_GET['sup_id']:null;
    $set_stoid=isset($_GET['sto_id'])?(int)$_GET['sto_id']:null;
    
    if (is_null($set_supid)||is_null($set_stoid)){
        $ERROR[]="必要な要素を指定してください";
    }

    $stmt->bindParam(':sup_id', $set_supid, PDO::PARAM_INT);
    $stmt->bindParam(':sto_id', $set_stoid, PDO::PARAM_INT);

    // 実行
    $stmt->execute();

    // 取得
    $storeinfo = $stmt->fetch(PDO::FETCH_ASSOC);

    // JSONに変換
    $response['status'] = 'success';
    $response['data'] = $storeinfo;
    header('Content-Type: application/json');
    echo json_encode($response);
} catch(PDOException $e) {
	http_response_code(500);
    $response['message'] = "DBエラー: " . $e->getMessage();
    $response['status'] = 'error';
    header('Content-Type: application/json');
    echo json_encode($response);
}