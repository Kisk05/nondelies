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
                result.data.forEach(storelist => {
                    const option = document.createElement('option');
                    option.value = storelist.sup_id;
                    option.textContent = storelist.sup_name; // 表示名にはスーパー名を設定
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

function loadStoreList() {
    const supId = document.getElementById('sup_id').value;
    const selectElement = document.getElementById('sto_id');
    const outputDiv = document.getElementById('output');
    if (supId===""){
        outputDiv.textContent='スーパー名を選択してください';
        return;
    }
    const apiURL = `get_storelist.php?sup_id=${supId}`;

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
                result.data.forEach(storelist => {
                    const option = document.createElement('option');
                    option.value = storelist.sto_id;
                    option.textContent = storelist.sto_name; // 表示名には店舗名を設定
                    selectElement.appendChild(option);
                });
            } else {
                selectElement.innerHTML = '<option value="">データがありません</option>';
            }
        })
        .catch(error => {
            selectElement.innerHTML = '<option value="">リストのロードに失敗</option>';
            console.error('ストアリストロードエラー:', error);
        });
}

function fetchCoordinates() {
    const supId = document.getElementById('sup_id').value;
    const stoId = document.getElementById('sto_id').value;
    const outputDiv = document.getElementById('output');
    outputDiv.textContent = '取得中...';

    const apiURL = `get_coordtodb.php?sup_id=${supId}&sto_id=${stoId}`;

    fetch(apiURL)
        .then(response => {
            // HTTPエラー（400, 500など）のチェック
            if (!response.ok) {
                throw new Error(`HTTPエラー ${response.status}: サーバー側でエラーが発生しました。`);
            }
            // 応答をJSONとして解析
            return response.json();
        })
        .then(data => {
            // JSONデータを整形して表示
            outputDiv.textContent = JSON.stringify(data, null, 2);
        })
        .catch(error => {
            // ネットワークエラーやJSON解析エラー、HTTPエラーを捕捉
            outputDiv.textContent = `エラー: ${error.message}\n` + 'PHPファイルまたはDB接続を確認してください。';
            console.error(error);
        });
}

function fetchsaleday() {
    const supId = document.getElementById('sup_id').value;
    const outputDiv = document.getElementById('output');
    outputDiv.textContent = '取得中...';

    const apiURL = `get_saleday.php?sup_id=${supId}`;

    fetch(apiURL)
        .then(response => {
            // HTTPエラー（400, 500など）のチェック
            if (!response.ok) {
                throw new Error(`HTTPエラー ${response.status}: サーバー側でエラーが発生しました。`);
            }
            // 応答をJSONとして解析
            return response.json();
        })
        .then(data => {
            // JSONデータを整形して表示
            outputDiv.textContent = JSON.stringify(data, null, 2);
        })
        .catch(error => {
            // ネットワークエラーやJSON解析エラー、HTTPエラーを捕捉
            outputDiv.textContent = `エラー: ${error.message}\n` + 'PHPファイルまたはDB接続を確認してください。';
            console.error(error);
        });
}

document.addEventListener('DOMContentLoaded', loadSuperList);