<?php
// スーパーIDと日付を指定し、データベースからイベント情報を取得する

define('DB_HOST', 'db');
define('DB_NAME', 'ndl_db');
define('DB_USER', 'ndl_user');
define('DB_PASS', 'ndl_passwd');

$response = ['status' => 'error', 'data' => []];

try{
    $db=new PDO('mysql:dbname='.DB_NAME.';host='.DB_HOST.';charset=utf8mb4',DB_USER,DB_PASS);

    $setYear = $_GET['year'] ?? null;
    $setMonth=$_GET['month'] ?? null;
    $sup_ids = $_GET['sup_ids'] ?? null;

    if (is_null($sup_ids) || is_null($setYear) || is_null($setMonth)) {
        http_response_code(400);
        $response['message'] = "スーパーIDと日付が指定されていません。";
        echo json_encode($response);
        exit;
    }

    $setYear = (int)$setYear;
    $setMonth = (int)$setMonth;
    
    $days_in_month = cal_days_in_month(CAL_GREGORIAN, $setMonth, $setYear);
    
    // イベント検索用の条件パラメータを準備
    $unique_dayofweek_params = [];
    $unique_monthday_params = [];
    $unique_yearday_params = [];
    $unique_oneday_params = [];
    
    // 1日から月末日までをループし、必要な情報を収集
    for ($i = 1; $i <= $days_in_month; $i++) {
        $date_str = sprintf('%d-%02d-%02d', $setYear, $setMonth, $i);
        $timestamp = strtotime($date_str);
        
        // 曜日 (0:日曜 〜 6:土曜) - event_dayofweek用
        $unique_dayofweek_params[] = date('w', $timestamp);
        
        // 日付 (1, 2, 3...) - event_monthday用
        $unique_monthday_params[] = $i;

        // 年の日付 (MM/DD形式) - event_yearday用
        $unique_yearday_params[] = date('m/d', $timestamp);
        
        // 特定の日付 (YYYY-MM-DD形式) - event_oneday用
        $unique_oneday_params[] = $date_str;
    }

    // 重複を排除
    $unique_dayofweek_params = array_unique($unique_dayofweek_params);
    $unique_monthday_params = array_unique($unique_monthday_params);
    $unique_yearday_params = array_unique($unique_yearday_params);
    $unique_oneday_params = array_unique($unique_oneday_params);
    
    $sup_ids_array = explode(',', $sup_ids);
    $safe_sup_ids = array_map('intval', $sup_ids_array);
    $sup_placeholders = implode(',', array_fill(0, count($safe_sup_ids), '?'));

    // プレースホルダ文字列を生成
    $dayofweek_placeholders = implode(',', array_fill(0, count($unique_dayofweek_params), '?'));
    $monthday_placeholders = implode(',', array_fill(0, count($unique_monthday_params), '?'));
    $yearday_placeholders = implode(',', array_fill(0, count($unique_yearday_params), '?'));
    $oneday_placeholders = implode(',', array_fill(0, count($unique_oneday_params), '?'));
    
    // WHERE句の条件（全ての条件をORで結合）
    $where_condition = "
        (e.event_dayofweek IN ({$dayofweek_placeholders})) OR 
        (e.event_monthday IN ({$monthday_placeholders})) OR
        (e.event_yearday IN ({$yearday_placeholders})) OR 
        (e.event_oneday IN ({$oneday_placeholders}))
    ";

    $salesql='SELECT s.sal_id, s.sup_id, s.sal_kind, s.sal_discount, sal_info, e.event_rtype,e.event_dayofweek, e.event_monthday, e.event_yearday, e.event_oneday      
        FROM sales as s JOIN events as e ON s.event_id = e.event_id          
        WHERE s.sup_id IN (' . $sup_placeholders . ') AND (' . $where_condition . ')
        ';
    $fessql='SELECT f.fes_id, f.sup_id, f.fes_name, f.fes_info, e.event_rtype,e.event_dayofweek, e.event_monthday, e.event_yearday, e.event_oneday
        FROM fes as f JOIN events as e ON f.event_id=e.event_id
        WHERE f.sup_id IN (' . $sup_placeholders . ') AND (' . $where_condition . ')
        ';
    $holidaysql='SELECT h.hol_id, h.sup_id, h.hol_name, h.hol_info, e.event_rtype,e.event_dayofweek, e.event_monthday, e.event_yearday, e.event_oneday
        FROM holiday as h JOIN events as e ON h.event_id=e.event_id
        WHERE h.sup_id IN (' . $sup_placeholders . ') AND (' . $where_condition . ')
        ';
    
    // SQL実行の準備
    $salestmt = $db->prepare($salesql);
    $fesstmt = $db->prepare($fessql);
    $holidaystmt = $db->prepare($holidaysql);

    $all_params = array_merge(
        $safe_sup_ids,
        $unique_dayofweek_params,
        $unique_monthday_params,
        $unique_yearday_params,
        $unique_oneday_params
    );

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