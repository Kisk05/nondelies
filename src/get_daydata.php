<?php
// スーパーIDを指定し、データベースからセール日を取得する

define('DB_HOST', 'db');
define('DB_NAME', 'ndl_db');
define('DB_USER', 'ndl_user');
define('DB_PASS', 'ndl_passwd');

try{
    // 操作用オブジェクト作成
    $db=new PDO('mysql:dbname='.DB_NAME.';host='.DB_HOST.';charset=utf8mb4',DB_USER,DB_PASS);

    $setDay = $_GET['day'] ?? null;
    $monthday=$_GET['monthday'] ?? null;
    $day=$_GET['onlyday'] ?? null;
    $dayofweek=$_GET['dayofweek'] ?? null;
    $sup_ids = $_GET['sup_ids'] ?? null;
    $yearday = null;
    if ($setDay) {
        $parts = explode('/', $setDay);
        if (count($parts) === 3) {
            // 月と日をゼロ埋めして MM/DD 形式を生成
            $paddedMonth = str_pad($parts[1], 2, '0', STR_PAD_LEFT);
            $paddedDay = str_pad($parts[2], 2, '0', STR_PAD_LEFT);
            $yearday = "{$paddedMonth}/{$paddedDay}"; // 例: '02/08'
        }
    }

    if (is_null($sup_ids) || is_null($yearday) || is_null($day) || is_null($setDay) || is_null($dayofweek)) {
        http_response_code(400);
        $response['message'] = "スーパーIDと日付が指定されていません。";
        echo json_encode($response);
        exit;
    }

    $sup_ids_array = explode(',', $sup_ids);
    $safe_sup_ids = array_map('intval', $sup_ids_array);
    $placeholders = implode(',', array_fill(0, count($safe_sup_ids), '?'));

    $where_condition = "e.event_dayofweek = ? OR e.event_yearday = ? OR e.event_monthday = ?";
    $salesql='SELECT s.sal_id, s.sup_id, s.sal_kind, s.sal_discount, sal_info, e.event_rtype       
        FROM sales as s JOIN events as e ON s.event_id = e.event_id          
        WHERE s.sup_id IN (' . $placeholders . ') AND (' . $where_condition . ')
        ';
    $fessql='SELECT f.fes_id, f.sup_id, f.fes_name, f.fes_info 
        FROM fes as f JOIN events as e ON f.event_id=e.event_id
        WHERE f.sup_id IN (' . $placeholders . ') AND (' . $where_condition . ')
        ';
    $holidaysql='SELECT h.hol_id, h.sup_id, h.hol_name, h.hol_info 
        FROM holiday as h JOIN events as e ON h.event_id=e.event_id
        WHERE h.sup_id IN (' . $placeholders . ') AND (' . $where_condition . ')
        ';
    
    // SQL実行の準備
    $salestmt = $db->prepare($salesql);
    $fesstmt = $db->prepare($fessql);
    $holidaystmt = $db->prepare($holidaysql);

    $bind_params = $safe_sup_ids;
    $bind_params_or = [
        $dayofweek,
        //$setDay_db_format,
        $yearday,
        $onlyday
    ];

    $all_params = array_merge($bind_params, $bind_params_or);

    /*foreach ($safe_sup_ids as $index => $id) {
        $salestmt->bindValue($index + 1, $id, PDO::PARAM_INT);
        $fesstmt->bindValue($index + 1, $id, PDO::PARAM_INT);
        $holidaystmt->bindValue($index + 1, $id, PDO::PARAM_INT);
    }

    $dayofweek_index = count($safe_sup_ids) + 1;

    $salestmt->bindValue($dayofweek_index, $dayofweek, PDO::PARAM_INT);
    $fesstmt->bindValue($dayofweek_index, $dayofweek, PDO::PARAM_INT);
    $holidaystmt->bindValue($dayofweek_index, $dayofweek, PDO::PARAM_INT);*/

    // 実行
    $salestmt->execute($all_params);
    $fesstmt->execute($all_params);
    $holidaystmt->execute($all_params);

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