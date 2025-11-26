<?php
// スーパーIDを指定し、データベースからセール日を取得する

define('DB_HOST', 'db');
define('DB_NAME', 'ndl_db');
define('DB_USER', 'ndl_user');
define('DB_PASS', 'ndl_passwd');

try{
    // 操作用オブジェクト作成
    $db=new PDO('mysql:dbname='.DB_NAME.';host='.DB_HOST.';charset=utf8mb4',DB_USER,DB_PASS);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
    $db->beginTransaction();

    $sup_ids = $_GET['sup_ids'] ?? null;
    $setDay = $_GET['day'] ?? null;

    if (is_null($sup_ids) || is_null($setDay)) {
        http_response_code(400);
        $response['message'] = "スーパーIDと日付が指定されていません。";
        echo json_encode($response);
        exit;
    }

    $sup_ids_array = explode(',', $sup_ids);
    $safe_sup_ids = array_map('intval', $sup_ids_array);
    $placeholders = implode(',', array_fill(0, count($safe_sup_ids), '?'));

    $salesql='SELECT s.sal_id, s.sal_kind         
        FROM sales as s          
        JOIN events as e ON s.event_id = e.event_id          
        WHERE s.sup_id IN (' . $placeholders . ')
        ';
    $fessql='SELECT fes_id,event_id,fes_name,fes_info FROM fes WHERE sup_id IN (' . $placeholders . ')';
    $holidaysql='SELECT hol_id,event_id,hol_name,hol_info FROM holiday WHERE sup_id IN (' . $placeholders . ')';
    
    // SQL実行の準備
    $salestmt = $db->prepare($salesql);
    $fesstmt = $db->prepare($fessql);
    $holidaystmt = $db->prepare($holidaysql);

    $bind_params = $safe_sup_ids;
    $bind_params[] = $setDay;

    // 実行
    $salestmt->execute($safe_sup_ids);// 現在はsetDayを使用していないため（使用する場合は$bind_paramsに変更）
    $fesstmt->execute($safe_sup_ids);
    $holidaystmt->execute($safe_sup_ids);

    $db->commit();

    // 取得
    $saledays = $salestmt->fetchAll(PDO::FETCH_ASSOC);
    $fesdays = $fesstmt->fetchAll(PDO::FETCH_ASSOC);
    $holidays = $holidaystmt->fetchAll(PDO::FETCH_ASSOC);

    // JSONに変換
    $response['status'] = 'success';
    $response['data'] = [
        'sale_list'=>$saledays,
        'fes_list'=>$fesdays,
        'holiday_list'=>$holidays
    ];
    header('Content-Type: application/json');
    echo json_encode($response);

} catch(PDOException $e) {
    if ($db->inTransaction()) {
        $db->rollBack();
    }

	http_response_code(500);
    $response['message'] = "DBエラー: " . $e->getMessage();
    $response['status'] = 'error';
    header('Content-Type: application/json');
    echo json_encode($response);
}