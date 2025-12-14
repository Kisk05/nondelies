<?php
header('Content-Type: application/json; charset=utf-8');

try {
    $pdo = new PDO("mysql:host=db;dbname=ndl_db", "ndl_user", "ndl_passwd");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // スーパーと店舗を JOIN で取得
    $stmt = $pdo->query("
        SELECT 
            s.sup_id,
            s.sup_name,
            st.sto_id,
            st.sto_name,
            st.sto_latitude AS latitude,
            st.sto_longitude AS longitude,
            st.sto_address AS address
        FROM super s
        JOIN store st ON s.sup_id = st.sup_id
        WHERE st.sto_latitude IS NOT NULL AND st.sto_longitude IS NOT NULL
    ");
    
    $stores = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'status' => 'success',
        'stores' => $stores
    ]);
} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
?>