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
                defaultOption.textContent = `${result.count}件のデータがあります`;
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

function changesupername() {
    const supId=document.getElementById('sup_id').value;
    const supName = document.getElementById('super_name').value;
    const outputDiv = document.getElementById('output');
    outputDiv.textContent = '処理中...';

    if (supId===""){
        outputDiv.textContent='スーパーが選択されていません';
        return;
    }
    if (supName===""){
        outputDiv.textContent='スーパー名が入力されていません';
        return;
    }
    const apiURL = `change_super.php?sup_id=${supId}&sup_name=${supName}`;

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
            loadSuperList();
        })
        .catch(error => {
            // ネットワークエラーやJSON解析エラー、HTTPエラーを捕捉
            outputDiv.textContent = `エラー: ${error.message}\n` + 'PHPファイルまたはDB接続を確認してください。';
            console.error(error);
        });
}

function fetchnewsuper() {
    const supName = document.getElementById('super_name').value;
    const outputDiv = document.getElementById('output');
    outputDiv.textContent = '処理中...';

    if (supName===""){
        outputDiv.textContent='スーパー名が入力されていません';
        return;
    }
    const apiURL = `new_super.php?sup_name=${supName}`;

    fetch(apiURL)
        .then(response => {
            if(response.status===409)
            {
                throw new Error("重複エラー: この名前は使用できません。");
            }
            if (!response.ok) 
            {
                throw new Error(`HTTPエラー ${response.status}`);
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
            outputDiv.textContent = `${error.message}\n`;
            console.error(error);
        });
}

document.addEventListener('DOMContentLoaded', loadSuperList);