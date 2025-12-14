// fool.js

function login() {
    const userEmail = document.getElementById('user_email').value.trim();
    const outputDiv = document.getElementById('output');

    outputDiv.textContent = '処理中...';

    // ✅ 未入力チェック
    if (userEmail === "") {
        outputDiv.textContent = 'メールアドレスを入力してください';
        return;
    }

    // ✅ メールアドレス形式チェック
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(userEmail)) {
        outputDiv.textContent = '正しいメールアドレスを入力してください';
        return;
    }

    const URL=`/php/fool.php?email=${userEmail}`
    // ✅ PHPへ送信
    fetch(URL)
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(errorData.message || "サーバーエラー");
            });
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            outputDiv.textContent = "再設定用リンクをメールに送信しました。";
        } else {
            outputDiv.textContent = data.message;
        }
    })
    .catch(error => {
        outputDiv.textContent = error.message;
        console.error(error);
    });
}