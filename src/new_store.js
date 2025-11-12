function loadSuperList() {
    const selectElement = document.getElementById('sup_id');
    const apiURL = 'get_superlist.php';

    fetch(apiURL)
        .then(response => response.json())
        .then(result => {
            selectElement.innerHTML = '';
            if (result.status === 'success' && result.data.length > 0) {
                // デフォルトの選択肢を追加
                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.textContent = '--- 選択してください ---';
                selectElement.appendChild(defaultOption);

                // DBから取得したデータでオプションを生成
                result.data.forEach(supermarket => {
                    const option = document.createElement('option');
                    option.value = supermarket.sup_id;
                    option.textContent = supermarket.sup_name; // 表示名にはスーパー名を設定
                    selectElement.appendChild(option);
                });
            } else {
                selectElement.innerHTML = '<option value="">データがありません</option>';
            }
        })
        .catch(error => {
            selectElement.innerHTML = '<option value="">リストのロードに失敗</option>';
            console.error('スーパーリストロードエラー:', error);
        });
}

function fetchnewstore() {
    const supId = document.getElementById('sup_id').value;
    const stoName = document.getElementById('store_name').value;
    const stoPostcode = document.getElementById('store_postcode').value;
    const stoAddress = document.getElementById('store_address').value;
    const outputDiv = document.getElementById('output');
    outputDiv.textContent = '取得中...';

    if (stoAddress===""){
        outputDiv.textContent='住所が入力されていません';
        return;
    }
    const apiURL = `get_zahyou.php?address=${stoAddress}`;

    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                const stoLat = data.latitude;
                const stoLon = data.longitude;

                const setApiURL = `new_store.php?sup_id=${supId}&sto_name=${stoName}&sto_postcode=${stoPostcode}&sto_address=${stoAddress}&sto_latitude=${stoLat}&sto_longitude=${stoLon}`;

                return fetch(setApiURL);
            } else {
                // 座標取得失敗時
                throw new Error(data.message || "座標取得APIエラー");
            }
        })
        .then(response => response.json())
        .then(dbResult => {
            outputDiv.textContent = '実行: ' + JSON.stringify(dbResult, null, 2);
        })
        .catch(error => {
            // エラー処理
            outputDiv.textContent = `致命的なエラー: ${error.message}`;
            console.error(error);
        });
}

document.addEventListener('DOMContentLoaded', loadSuperList);