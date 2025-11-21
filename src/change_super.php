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
    $sql='UPDATE super SET sup_name=:sup_name WHERE sup_id=:sup_id';

    // SQL実行の準備
    $stmt = $db->prepare($sql);

    // 値を取得
    $set_supid=$_GET['sup_id'] ?? null;
    $set_supname = $_GET['sup_name'] ?? null;
    
    if (is_null($set_supid)||is_null($set_supname)){
        $ERROR[]="必要な要素を指定してください";
    }

    // パラメータに代入
    $stmt->bindParam(':sup_id', $set_supid, PDO::PARAM_INT);
    $stmt->bindParam(':sup_name', $set_supname, PDO::PARAM_STR);
    
    // 実行
    $stmt->execute();

    // JSONに変換
    header('Content-Type: application/json');
    echo json_encode(['status' => 'success', 'message' => 'スーパー名を変更しました。']);
} catch(PDOException $e) {
	$ERROR[] = $e->getMessage();
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode(['status' => 'error', 'messages' => $ERROR]);
}