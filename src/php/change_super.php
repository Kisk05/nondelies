<?php
// データベースに変更した店舗情報を登録

define('DB_HOST', 'db');
define('DB_NAME', 'ndl_db');
define('DB_USER', 'ndl_user');
define('DB_PASS', 'ndl_passwd');

$response = ['status' => 'error'];

try{
    $db=new PDO('mysql:dbname='.DB_NAME.';host='.DB_HOST.';charset=utf8mb4',DB_USER,DB_PASS);
    $sql='UPDATE super SET sup_name=:sup_name WHERE sup_id=:sup_id';
    $stmt = $db->prepare($sql);

    // 値を取得
    $set_supid=$_GET['sup_id'] ?? null;
    $set_supname = $_GET['sup_name'] ?? null;
    
    if (is_null($set_supid)||is_null($set_supname)){
        $response['message']="必要な要素を指定してください";
    }

    // パラメータに代入
    $stmt->bindParam(':sup_id', $set_supid, PDO::PARAM_INT);
    $stmt->bindParam(':sup_name', $set_supname, PDO::PARAM_STR);
    
    // 実行
    $stmt->execute();

    $response['status'] = 'success';
    $response['messages'] = 'スーパー情報を変更しました。';
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