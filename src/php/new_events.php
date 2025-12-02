<?php
// データベースに新規店舗情報を登録

define('DB_HOST', 'db');
define('DB_NAME', 'ndl_db');
define('DB_USER', 'ndl_user');
define('DB_PASS', 'ndl_passwd');

$response = ['status' => 'error', 'data' => []];

try{
    $db=new PDO('mysql:dbname='.DB_NAME.';host='.DB_HOST.';charset=utf8mb4',DB_USER,DB_PASS);
    $sql = 'SELECT event_id FROM events WHERE event_dayofweek = :dayofweek AND event_rtype = :rtype AND event_monthday = :mday AND event_yearday = :yday AND event_oneday <=> :oneday';
    $stmt = $db->prepare($sql);

    // 値を取得
    $set_rtype = $_GET['event_rtype'] ?? null;
    $set_dayofweek = $_GET['event_dayofweek'] ?? null;
    $set_mday = $_GET['event_monthday'] ?? null;
    $set_yday = $_GET['event_yearday'] ?? null;
    $set_oneday = $_GET['event_oneday'] ?? null;
    
    if(empty($set_dayofweek) || $set_dayofweek === -1){
        $set_dayofweek = null;
    }
    if (empty($set_mday) || $set_mday === 0) {
        $set_mday = null;
    }
    if(empty($set_yday) || $set_yday === '0000-00-00'){
        $set_yday = null;
    }
    if (empty($set_oneday) || $set_oneday === '0000-00-00') {
        $set_oneday = null;
    }


    if (is_null($set_dayofweek) && is_null($set_rtype) && is_null($set_rvalue) && is_null($set_yday) && is_null($set_startday)){
        header('Content-Type: application/json');
        http_response_code(400); 
        $response=[
            'status' => 'error', 
            'message' => "いずれかの繰り返し条件を指定してください"
            ]
        echo json_encode($response);
        exit;
    }

    // パラメータに代入
    $stmt->bindParam(':dayofweek', $set_dayofweek, PDO::PARAM_INT);
    $stmt->bindParam(':rtype', $set_rtype, PDO::PARAM_STR);
    $stmt->bindParam(':mday', $set_mday, PDO::PARAM_INT);
    $stmt->bindParam(':yday', $set_yday, PDO::PARAM_STR);
    $stmt->bindParam(':oneday', $set_oneday, PDO::PARAM_STR);
    
    // 実行
    $stmt->execute();

    $existing_event = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($existing_event) {
        $event_id = $existing_event['event_id'];
    } else {
        $sql = 'INSERT INTO events (event_dayofweek, event_rtype, event_monthday, event_yearday, event_oneday) VALUES (:dayofweek, :rtype, :mday, :yday, :oneday)';
                       
        $stmt = $db->prepare($sql);
        
        // 既存のbindParamを再利用 (変数名が同じため)
        $stmt->bindParam(':dayofweek', $set_dayofweek, PDO::PARAM_INT);
        $stmt->bindParam(':rtype', $set_rtype, PDO::PARAM_STR);
        $stmt->bindParam(':mday', $set_mday, PDO::PARAM_INT);
        $stmt->bindParam(':yday', $set_yday, PDO::PARAM_STR);
        $stmt->bindParam(':oneday', $set_oneday, PDO::PARAM_STR);

        $stmt->execute();

        // 最後に挿入されたIDを取得
        $event_id = $db->lastInsertId();
    }
    // JSONに変換
    header('Content-Type: application/json');
    $response=[
        'status' => 'success', 
        'event_id' => $event_id, 
        'message' => 'イベントを登録しました。'
        ]
    echo json_encode($response);
} catch(PDOException $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    $response=[
        'status' => 'error', 
        'message' => $e->getMessage()
        ]
    echo json_encode($response);
}