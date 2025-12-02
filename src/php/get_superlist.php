<?php
// 全スーパー情報を取得

define('DB_HOST', 'db');
define('DB_NAME', 'ndl_db');
define('DB_USER', 'ndl_user');
define('DB_PASS', 'ndl_passwd');

$response = ['status' => 'error', 'data' => []];

try{
    $db=new PDO('mysql:dbname='.DB_NAME.';host='.DB_HOST.';charset=utf8mb4',DB_USER,DB_PASS);
    $set_supid=isset($_GET['sup_id'])?(int)$_GET['sup_id']:null;
    $countsql='SELECT count(*) FROM super';
 
    $is_single_fetch = !is_null($set_supid) && $set_supid > 0;

    // スーパーIDが指定されている場合は、特定のスーパー名のみ取得
    if ($is_single_fetch){
        $sql='SELECT sup_id, sup_name FROM super WHERE sup_id=:sup_id';
    }else{
        $sql='SELECT sup_id, sup_name FROM super';
    }

    $stmt = $db->prepare($sql);
    $countstmt = $db->prepare($countsql);

    if ($is_single_fetch) {
        $stmt->bindParam(':sup_id', $set_supid, PDO::PARAM_INT);
    }

    // 実行
    $stmt->execute();
    $countstmt->execute();

    // 取得
    $superlist = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $supernum = $countstmt->fetchColumn(0);

    // JSONに変換
    $response['status'] = 'success';
    $response['data'] = $superlist;
    $response['count']=$supernum;
    header('Content-Type: application/json');
    echo json_encode($response);
} catch(PDOException $e) {
	http_response_code(500);
    $response['message'] = "DBエラー: " . $e->getMessage();
    $response['status'] = 'error';
    header('Content-Type: application/json');
    echo json_encode($response);
}