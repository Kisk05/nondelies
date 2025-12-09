<?php
// ユーザー名とパスワードを指定し、

define('DB_HOST', 'db');
define('DB_NAME', 'ndl_db');
define('DB_USER', 'ndl_user');
define('DB_PASS', 'ndl_passwd');

$response = ['status' => 'error'];

try{
    $db=new PDO('mysql:dbname='.DB_NAME.';host='.DB_HOST.';charset=utf8mb4',DB_USER,DB_PASS);
    $sql='INSERT INTO users(user_email,hash_pass) values(:useremail,:hash_pass)';
    $stmt = $db->prepare($sql);

    $set_hashpass = password_hash($_GET['user_passwd'], PASSWORD_DEFAULT);
    $set_useremail=isset($_GET['user_email'])?(string)$_GET['user_email']:null;
    
    if (is_null($set_hashpass)||is_null($set_useremail)){
        $response['status']='error';
        $response['message']="メールアドレスとパスワードを入力してください";
        header('Content-Type: application/json');
        http_response_code(400);
        echo json_encode($response);
    }
    
    $stmt->bindParam(':useremail', $set_useremail, PDO::PARAM_STR);
    $stmt->bindParam(':hash_pass', $set_hashpass, PDO::PARAM_STR);

    // 実行
    $stmt->execute();

    // 取得
    $response['status']='success';
    $response['message']='登録成功';
    header('Content-Type: application/json');
    echo json_encode($response);
} catch(PDOException $e) {
	$sqlstate=$e->getCode();
    $drivercode=$e->errorInfo[1];
    $errormessage=$e->getMessage();
    $usermessage=null;

    if($drivercode===1062){
        $usermessage="このメールアドレスは既に使用されています";
        http_response_code(409);
    }else{
        $usermessage="サーバー内部エラー：". $errormessage;
        http_response_code(500);
    }
    
    header('Content-Type: application/json');
    $response=[
        'status' => 'error', 
        'message' => $usermessage
    ];
    echo json_encode($response);
}