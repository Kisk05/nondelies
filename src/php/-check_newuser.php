<?php
// ユーザー名とパスワードを指定し、

define('DB_HOST', 'db');
define('DB_NAME', 'ndl_db');
define('DB_USER', 'ndl_user');
define('DB_PASS', 'ndl_passwd');

$ERROR=array();

try{
    // 操作用オブジェクト作成
    $db=new PDO('mysql:dbname='.DB_NAME.';host='.DB_HOST.';charset=utf8',DB_USER,DB_PASS);
    
    //　SQL文
    $sql='INSERT INTO users(user_name,user_email,hash_pass) values(:username,:useremail,:hash_pass)';
    
    // SQL実行の準備
    $stmt = $db->prepare($sql);

    $set_hashpass = password_hash($_GET['user_passwd'], PASSWORD_DEFAULT);
    // パラメータを代入
    $set_username=isset($_GET['user_name'])?(string)$_GET['user_name']:null;
    $set_useremail=isset($_GET['user_email'])?(string)$_GET['user_email']:null;
    
    if (is_null($set_username)||is_null($set_useremail)){
        $ERROR[]="user_nameとuser_emailの両方を入力してください";
    }
    
    $stmt->bindParam(':username', $set_username, PDO::PARAM_STR);
    $stmt->bindParam(':useremail', $set_useremail, PDO::PARAM_STR);
    $stmt->bindParam(':hash_pass', $set_hashpass, PDO::PARAM_STR);

    // 実行
    $stmt->execute();

    // 取得
    $result = ['status' => 'success', 'message' => 'ユーザー名とメールアドレスを使用できます！'];

    // JSONに変換
    header('Content-Type: application/json');
    echo json_encode($result);
} catch(PDOException $e) {
	$ERROR[] = $e->getMessage();
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode(['status' => 'error', 'messages' => $ERROR]);
}