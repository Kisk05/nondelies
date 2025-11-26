<?php
// スーパーIDを指定し、データベースからセール日を取得する

define('DB_HOST', 'db');
define('DB_NAME', 'ndl_db');
define('DB_USER', 'ndl_user');
define('DB_PASS', 'ndl_passwd');

try{
    // 操作用オブジェクト作成
    $db=new PDO('mysql:dbname='.DB_NAME.';host='.DB_HOST.';charset=utf8mb4',DB_USER,DB_PASS);

    $sup_ids = $_GET['sup_ids'] ?? null;
    $dayofweek=$_GET['dayofweek'] ?? null;
    $setDay = $_GET['day'] ?? null;

    if (is_null($sup_ids) || is_null($setDay) || is_null($dayofweek)) {
        http_response_code(400);
        $response['message'] = "スーパーIDと日付が指定されていません。";
        echo json_encode($response);
        exit;
    }

    $sup_ids_array = explode(',', $sup_ids);
    $safe_sup_ids = array_map('intval', $sup_ids_array);
    $placeholders = implode(',', array_fill(0, count($safe_sup_ids), '?'));

    $salesql='SELECT s.sal_id, s.sup_id, s.sal_kind, s.sal_discount, sal_info, e.event_rtype       
        FROM sales as s JOIN events as e ON s.event_id = e.event_id          
        WHERE s.sup_id IN (' . $placeholders . ') AND e.event_dayofweek = ?
        ';
    $fessql='SELECT f.fes_id, f.sup_id, f.fes_name, f.fes_info 
        FROM fes as f JOIN events as e ON f.event_id=e.event_id
        WHERE f.sup_id IN (' . $placeholders . ') AND e.event_dayofweek = ?
        ';
    $holidaysql='SELECT h.hol_id, h.sup_id, h.hol_name, h.hol_info 
        FROM holiday as h JOIN events as e ON h.event_id=e.event_id
        WHERE h.sup_id IN (' . $placeholders . ') AND e.event_dayofweek = ?
        ';
    
    // SQL実行の準備
    $salestmt = $db->prepare($salesql);
    $fesstmt = $db->prepare($fessql);
    $holidaystmt = $db->prepare($holidaysql);

    $bind_params = $safe_sup_ids;
    

    foreach ($safe_sup_ids as $index => $id) {
        $salestmt->bindValue($index + 1, $id, PDO::PARAM_INT);
        $fesstmt->bindValue($index + 1, $id, PDO::PARAM_INT);
        $holidaystmt->bindValue($index + 1, $id, PDO::PARAM_INT);
    }

    $dayofweek_index = count($safe_sup_ids) + 1;

    $salestmt->bindValue($dayofweek_index, $dayofweek, PDO::PARAM_INT);
    $fesstmt->bindValue($dayofweek_index, $dayofweek, PDO::PARAM_INT);
    $holidaystmt->bindValue($dayofweek_index, $dayofweek, PDO::PARAM_INT);

    // 実行
    $salestmt->execute();
    $fesstmt->execute();
    $holidaystmt->execute();

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
	http_response_code(500);
    $response['message'] = "DBエラー: " . $e->getMessage();
    $response['status'] = 'error';
    header('Content-Type: application/json');
    echo json_encode($response);
}