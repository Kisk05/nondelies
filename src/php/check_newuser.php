<?php
define('DB_HOST', 'db');
define('DB_NAME', 'ndl_db');
define('DB_USER', 'ndl_user');
define('DB_PASS', 'ndl_passwd');

$ERROR = array();

try {
    $db = new PDO('mysql:dbname='.DB_NAME.';host='.DB_HOST.';charset=utf8', DB_USER, DB_PASS);

    // SQL文（user_name は NULL を許容）
    $sql = 'INSERT INTO users(user_name, user_email, hash_pass) VALUES(:username, :useremail, :hash_pass)';
    $stmt = $db->prepare($sql);

    // ユーザー名は任意
    $set_username = isset($_GET['user_name']) ? (string)$_GET['user_name'] : null;
    $set_useremail = isset($_GET['user_email']) ? (string)$_GET['user_email'] : null;
    $set_hashpass = password_hash($_GET['user_passwd'], PASSWORD_DEFAULT);

    // メールアドレス必須チェック
    if (empty($set_useremail)) {
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'メールアドレスを入力してください']);
        exit;
    }

    // パラメータバインド
    $stmt->bindParam(':username', $set_username, PDO::PARAM_STR);
    $stmt->bindParam(':useremail', $set_useremail, PDO::PARAM_STR);
    $stmt->bindParam(':hash_pass', $set_hashpass, PDO::PARAM_STR);

    // 実行
    $stmt->execute();

    // 成功レスポンス
    $result = ['status' => 'success', 'message' => 'ユーザー登録が完了しました！'];
    header('Content-Type: application/json');
    echo json_encode($result);

} catch(PDOException $e) {
    $ERROR[] = $e->getMessage();
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode(['status' => 'error', 'messages' => $ERROR]);
}