<?php
// superテーブルに登録されているスーパー名を取得

define('DB_HOST', 'db');
define('DB_NAME', 'ndl_db');
define('DB_USER', 'ndl_user');
define('DB_PASS', 'ndl_passwd');

header('Content-Type: application/json; charset=UTF-8');
$response = ['status' => 'error', 'data' => []];

try{
    // 操作用オブジェクト作成
    $db=new PDO('mysql:dbname='.DB_NAME.';host='.DB_HOST.';charset=utf8mb4',DB_USER,DB_PASS);
    
    //　SQL文
    $sql='SELECT sto_id, sto_name FROM store where sup_id=:sup_id';
    $countsql='SELECT count(*) FROM store where sup_id=:sup_id';

    // SQL実行の準備
    $stmt = $db->prepare($sql);
    $countstmt = $db->prepare($countsql);

    // パラメータを代入
    $set_supid=isset($_GET['sup_id'])?(int)$_GET['sup_id']:null;
    
    if (is_null($set_supid)){
        $ERROR[]="sup_idを指定してください";
    }

    $stmt->bindParam(':sup_id', $set_supid, PDO::PARAM_INT);
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