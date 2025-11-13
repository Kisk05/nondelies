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