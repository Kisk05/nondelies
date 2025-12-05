<?php
// 指定されたスーパーの全店舗情報を取得

define('DB_HOST', 'db');
define('DB_NAME', 'ndl_db');
define('DB_USER', 'ndl_user');
define('DB_PASS', 'ndl_passwd');

$response = ['status' => 'error', 'data' => []];

try{
    $db=new PDO('mysql:dbname='.DB_NAME.';host='.DB_HOST.';charset=utf8mb4',DB_USER,DB_PASS);
    $set_supid=isset($_GET['sup_id'])?(int)$_GET['sup_id']:null;    
    $set_stoid=isset($_GET['sto_id'])?(int)$_GET['sto_id']:null;
    $countsql='SELECT count(*) FROM store where sup_id=:sup_id';

    $super = !is_null($set_supid) && $set_supid > 0;
    $store = !is_null($set_stoid) && $set_stoid > 0;

    if ($store){
        $sql='SELECT sto_id, sto_name FROM store WHERE sup_id=:sup_id && sto_id=:sto_id';
    }else{
        $sql='SELECT sto_id, sto_name FROM super WHERE sup_id=:sup_id';
    }

    $stmt = $db->prepare($sql);
    $countstmt = $db->prepare($countsql);

    if ($store) {
        $stmt->bindParam(':sup_id', $set_supid, PDO::PARAM_INT);
        $stmt->bindParam(':sto_id', $set_stoid, PDO::PARAM_INT);
    }
    $countstmt->bindParam(':sup_id', $set_supid, PDO::PARAM_INT);

    // 実行
    $stmt->execute();
    $countstmt->execute();

    // 取得
    $storelist = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $storenum = $countstmt->fetchColumn(0);

    // JSONに変換
    $response['status'] = 'success';
    $response['data'] = $storelist;
    $response['count'] = $storenum;
    header('Content-Type: application/json');
    echo json_encode($response);
} catch(PDOException $e) {
	http_response_code(500);
    $response['message'] = "DBエラー: " . $e->getMessage();
    echo json_encode($response);
}