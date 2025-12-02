<?php
// データベースに変更した店舗情報を登録

define('DB_HOST', 'db');
define('DB_NAME', 'ndl_db');
define('DB_USER', 'ndl_user');
define('DB_PASS', 'ndl_passwd');

$response = ['status' => 'error'];

try{
    $db=new PDO('mysql:dbname='.DB_NAME.';host='.DB_HOST.';charset=utf8mb4',DB_USER,DB_PASS);
    $sql='UPDATE store SET sup_id=:sup_id,sto_name=:sto_name,sto_address=:sto_address,sto_postcode=:sto_postcode,sto_latitude=:sto_latitude,sto_longitude=:sto_longitude WHERE sto_id=:sto_id';
    $stmt = $db->prepare($sql);

    // 値を取得
    $set_stoid=$_GET['sto_id'] ?? null;
    $set_supid=$_GET['sup_id'] ?? null;
    $set_stoname = $_GET['sto_name'] ?? null;
    $set_stoaddress = $_GET['sto_address'] ?? null;
    $set_stopost = $_GET['sto_postcode'] ?? null;
    $set_stolat = $_GET['sto_latitude'] ?? null;
    $set_stolon = $_GET['sto_longitude'] ?? null;
    
    if (is_null($set_stoid)||is_null($set_supid)||is_null($set_stoname)||is_null($set_stopost)){
        $response['message']="必要な要素を指定してください";
    }

    // パラメータに代入
    $stmt->bindParam(':sto_id', $set_stoid, PDO::PARAM_INT);
    $stmt->bindParam(':sup_id', $set_supid, PDO::PARAM_INT);
    $stmt->bindParam(':sto_name', $set_stoname, PDO::PARAM_STR);
    $stmt->bindParam(':sto_address', $set_stoaddress, PDO::PARAM_STR);
    $stmt->bindParam(':sto_postcode', $set_stopost, PDO::PARAM_STR);
    $stmt->bindParam(':sto_latitude', $set_stolat, PDO::PARAM_STR);
    $stmt->bindParam(':sto_longitude', $set_stolon, PDO::PARAM_STR);
    
    // 実行
    $stmt->execute();

    $response['status'] = 'success';
    $response['messages'] = '店舗情報を変更しました。';
    // JSONに変換
    header('Content-Type: application/json');
    echo json_encode($response);
} catch(PDOException $e) {
	http_response_code(500);
    $response['message'] = "DBエラー: " . $e->getMessage();
    $response['status'] = 'error';
    header('Content-Type: application/json');
    echo json_encode($response);
}