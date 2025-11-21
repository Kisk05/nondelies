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
    $sql='SELECT sup_id, sup_name FROM super';
    $countsql='SELECT count(*) FROM super';

    // SQL実行の準備
    $stmt = $db->prepare($sql);
    $countstmt = $db->prepare($countsql);

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
    echo json_encode($response);
}