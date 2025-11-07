function fetchsetnewstore() {
    const supId = document.getElementById('sup_id').value;
    const stoName = document.getElementById('sto_name').value;
    const stoPostcode = document.getElementById('sto_postcode').value;
    const stoAddress = document.getElementById('sto_address').value;
    const outputDiv = document.getElementById('output');
    outputDiv.textContent = '取得中...';

    const apiURL = `set_newstore.php?sup_id=${supId}&sto_name=${stoName}&sto_postcode=${stoPostcode},&sto_address=${stoAddress}`;

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