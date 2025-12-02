<?php
// データベースに新規スーパー情報を登録

define('DB_HOST', 'db');
define('DB_NAME', 'ndl_db');
define('DB_USER', 'ndl_user');
define('DB_PASS', 'ndl_passwd');

$response = ['status' => 'error', 'data' => []];

try{
    $db=new PDO('mysql:dbname='.DB_NAME.';host='.DB_HOST.';charset=utf8mb4',DB_USER,DB_PASS);
    $sql='INSERT INTO super(sup_name) VALUES (:sup_name)';
    $stmt = $db->prepare($sql);

    // 値を取得
    $set_supname = $_GET['sup_name'] ?? null;
    
    if (is_null($set_supname)){
        $response['message']="sup_nameを指定してください";
    }

    // パラメータに代入
    $stmt->bindParam(':sup_name', $set_supname, PDO::PARAM_STR);
    
    // 実行
    $stmt->execute();

    // JSONに変換
    header('Content-Type: application/json');
    $response=[
        'status' => 'success', 
        'message' => 'スーパー情報を変更しました。'
        ]
    echo json_encode($response);
} catch(PDOException $e) {
	$sqlstate=$e->getCode();
    $drivercode=$e->errorInfo[1];
    $errormessage=$e->getMessage();
    $usermessage=null;

    if($drivercode===1062)
    {
        $usermessage="このスーパー名は既に登録されています";
        http_response_code(409);
    }
    else
    {
        $usermessage="サーバー内部エラー：". $errormessage;
        http_response_code(500);
    }
    
    header('Content-Type: application/json');
    $response=[
        'status' => 'error', 
        'messages' => $usermessage
        ]
    echo json_encode($response);
}