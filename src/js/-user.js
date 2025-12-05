function login() {
    const userEmail = document.getElementById('user_email').value.trim();
    const userPasswd = document.getElementById('user_passwd').value.trim();
    const outputDiv = document.getElementById('output');

    outputDiv.textContent = '処理中...';

    // --- 未入力チェック（最優先） ---
    if (userEmail === "" && userPasswd === "") {
        outputDiv.textContent = '必須情報が入力されていません';
        return;
    }
    if (userEmail !== "" && userPasswd === "") {
        outputDiv.textContent = 'パスワードを入力してください';
        return;
    }
    if (userEmail === "" && userPasswd !== "") {
        outputDiv.textContent = 'メールアドレスを入力してください';
        return;
    }

    // --- メールアドレス形式チェック ---
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(userEmail)) {
        outputDiv.textContent = '正しいメールアドレスを入力してください';
        return;
    }

    // --- API呼び出し ---
    const apiURL = `/php/-check_newuser.php?user_email=${encodeURIComponent(userEmail)}&user_passwd=${encodeURIComponent(userPasswd)}`;

    fetch(apiURL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTPエラー ${response.status}: サーバー側でエラーが発生しました。`);
            }
            return response.json();
        })
        .then(data => {
            outputDiv.textContent = JSON.stringify(data, null, 2);
        })
        .catch(error => {
            outputDiv.textContent = `エラー: ${error.message}\n` + 'PHPファイルまたはDB接続を確認してください。';
            console.error(error);
        });
}