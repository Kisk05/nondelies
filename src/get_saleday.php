<?php
// スーパーIDを指定し、データベースからセール日を取得する

define('DB_HOST', 'db');
define('DB_NAME', 'ndl_db');
define('DB_USER', 'ndl_user');
define('DB_PASS', 'ndl_passwd');

$ERROR=array();

try{
    // 操作用オブジェクト作成
    $db=new PDO('mysql:dbname='.DB_NAME.';host='.DB_HOST.';charset=utf8',DB_USER,DB_PASS);
    
    //　SQL文
    $sql='SELECT sal_day,sal_kind,sal_discount,sal_info FROM sales WHERE sup_id = :sup_id';

    // SQL実行の準備
    $stmt = $db->prepare($sql);

    // パラメータを代入
    $set_supid=isset($_GET['sup_id'])?(int)$_GET['sup_id']:null;
    
    if (is_null($set_supid)){
        $ERROR[]="sup_idを指定してください"
    }

    $stmt->bindParam(':sup_id', $set_supid, PDO::PARAM_INT);
    
    // 実行
    $stmt->execute();

    // 取得
    $saledays = $stmt->fetchAll();

    // JSONに変換
    header('Content-Type: application/json');
    echo json_encode($saledays)
} catch(PDOException $e) {
	$ERROR[] = $e->getMessage();
}