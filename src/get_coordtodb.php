<?php
// スーパーIDとストアIDを指定し、データベースから緯度経度を取得する

define('DB_HOST', 'db');
define('DB_NAME', 'ndl_db');
define('DB_USER', 'ndl_user');
define('DB_PASS', 'ndl_passwd');

$ERROR=array();

try{
    // 操作用オブジェクト作成
    $db=new PDO('mysql:dbname='.DB_NAME.';host='.DB_HOST.';charset=utf8',DB_USER,DB_PASS);
    
    //　SQL文
    $sql='SELECT sto_latitude,sto_longitude FROM store WHERE sup_id = :sup_id AND sto_id = :sto_id';

    // SQL実行の準備
    $stmt = $db->prepare($sql);

    // パラメータを代入
    $set_supid=isset($_GET['sup_id'])?(int)$_GET['sup_id']:null;
    $set_stoid=isset($_GET['sto_id'])?(int)$_GET['sto_id']:null;
    
    if (is_null($set_supid)||is_null($set_stoid)){
        $ERROR[]="sup_idとsto_idの両方を指定してください";
    }
    
    $stmt->bindParam(':sup_id', $set_supid, PDO::PARAM_INT);
    $stmt->bindParam(':sto_id', $set_stoid, PDO::PARAM_INT);
    
    // 実行
    $stmt->execute();

    // 取得
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    // JSONに変換
    header('Content-Type: application/json');
    echo json_encode($result);
} catch(PDOException $e) {
	$ERROR[] = $e->getMessage();
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode(['status' => 'error', 'messages' => $ERROR]);
}