function fetchchecknewuser() {
    const userName=document.getElementById('user_name').value;
    const uesrEmail=document.getElementById('user_email').value;
    const uesrPasswd=document.getElementById('user_passwd').value;
    const outputDiv=document.getElementById('output');
    outputDiv.textContent='処理中...';

    if (userName===""||uesrEmail===""||uesrPasswd){
        outputDiv.textContent='必須情報が入力されていません';
        return;
    }

    const apiURL = `-check_newuser.php?user_name=${userName}&user_email=${uesrEmail}&user_passwd=${uesrPasswd}`;

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