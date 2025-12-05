function togglePassword(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    if (input.type === "password") {
        input.type = "text";
        icon.textContent = "🙈"; // 目を閉じたアイコン
    } else {
        input.type = "password";
        icon.textContent = "👁️"; // 目を開けたアイコン
    }
}

function register() {
    const email = document.getElementById('new_email').value.trim();
    const passwd = document.getElementById('new_passwd').value.trim();
    const confirm = document.getElementById('confirm_passwd').value.trim();
    const output = document.getElementById('output');

    output.textContent = '処理中...';

    // --- 未入力チェック（最優先） ---
    if (!email && !passwd && !confirm) {
        output.textContent = 'すべての項目を入力してください';
        return;
    }
    if (!email) {
        output.textContent = 'メールアドレスを入力してください';
        return;
    }
    if (!passwd) {
        output.textContent = 'パスワードを入力してください';
        return;
    }
    if (!confirm) {
        output.textContent = 'パスワード（再入力）を入力してください';
        return;
    }

    // --- メールアドレス形式チェック ---
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        output.textContent = '正しいメールアドレスを入力してください';
        return;
    }

    // --- パスワード一致チェック ---
    if (passwd !== confirm) {
        output.textContent = 'パスワードが一致しません';
        return;
    }

    // --- API呼び出し ---
    const apiURL = `/php/-register_user.php?user_email=${encodeURIComponent(email)}&user_passwd=${encodeURIComponent(passwd)}`;

    fetch(apiURL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTPエラー ${response.status}: サーバー側でエラーが発生しました。`);
            }
            return response.json();
        })
        .then(data => {
            output.textContent = JSON.stringify(data, null, 2);
        })
        .catch(error => {
            output.textContent = `エラー: ${error.message}\nPHPファイルまたはDB接続を確認してください。`;
            console.error(error);
        });
}