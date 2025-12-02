<?php
// superテーブルに登録されているスーパー名を取得

define('DB_HOST', 'db');
define('DB_NAME', 'ndl_db');
define('DB_USER', 'ndl_user');
define('DB_PASS', 'ndl_passwd');

$response = ['status' => 'error', 'data' => []];

try{
    $db=new PDO('mysql:dbname='.DB_NAME.';host='.DB_HOST.';charset=utf8mb4',DB_USER,DB_PASS);
    $sql='SELECT sto_id,sto_name FROM store where sup_id=:sup_id';
    $stmt = $db->prepare($sql);

    // パラメータを代入
    $set_supid=isset($_GET['sup_id'])?(int)$_GET['sup_id']:null;
    
    if (is_null($set_supid)){
        $ERROR[]="sup_idを指定してください";
    }

    $stmt->bindParam(':sup_id', $set_supid, PDO::PARAM_INT);

    // 実行
    $stmt->execute();

    // 取得
    $sto_ids = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // JSONに変換
    $response['status'] = 'success';
    $response['data'] = $sto_ids;
    header('Content-Type: application/json');
    echo json_encode($response);
} catch(PDOException $e) {
	http_response_code(500);
    $response['message'] = "DBエラー: " . $e->getMessage();
    echo json_encode($response);
}