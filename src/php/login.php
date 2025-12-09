<?php
// 指定された情報に合うユーザーを探す

define('DB_HOST', 'db');
define('DB_NAME', 'ndl_db');
define('DB_USER', 'ndl_user');
define('DB_PASS', 'ndl_passwd');

$response = ['status' => 'error'];

try{
    $db=new PDO('mysql:dbname='.DB_NAME.';host='.DB_HOST.';charset=utf8mb4',DB_USER,DB_PASS);
    $sql='SELECT user_id,user_email,hash_pass from users where user_email=:useremail';
    $stmt = $db->prepare($sql);

    $input_passwd = $_GET['user_passwd'];
    $set_useremail=isset($_GET['user_email'])?(string)$_GET['user_email']:null;
    
    if (is_null($set_username)||is_null($set_useremail)){
        $response['message']="メールアドレスを入力してください";
    }
    
    $stmt->bindParam(':useremail', $set_useremail, PDO::PARAM_STR);

    // 実行
    $stmt->execute();

    // 取得
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if($user && password_verify($input_passwd, $user['hash_pass'])){
        // 認証成功
        $response['status']='success';
        $response['message']='ログイン成功';
        $response['ID']=$user['user_id'];
        header('Content-Type: application/json');
        echo json_encode($response);
    } else {
        // ユーザーが存在しない、またはパスワード不一致
        http_response_code(401);
        $response['message']='メールアドレスまたはパスワードが間違っています';
        header('Content-Type: application/json');
        echo json_encode($response);
    }
} catch(PDOException $e) {
	http_response_code(500);
    $response['message'] = "DBエラー: " . $e->getMessage();
    echo json_encode($response);
}