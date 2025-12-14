function togglePassword(inputId, btnId, iconId) {
    const passwdInput = document.getElementById(inputId);
    const eyeBtn = document.getElementById(btnId);
    const eyeIcon = document.getElementById(iconId); // 新しく取得
    const openSrc = eyeBtn.dataset.open;
    const closeSrc = eyeBtn.dataset.close;

    if (passwdInput.type === "password") {
        passwdInput.type = "text";
        if (closeSrc) eyeIcon.src = closeSrc;
        eyeBtn.setAttribute('aria-pressed', 'true');
        eyeBtn.setAttribute('aria-label', 'パスワードを非表示');
    } else {
        passwdInput.type = "password";
        if (openSrc) eyeIcon.src = openSrc;
        eyeBtn.setAttribute('aria-pressed', 'false');
        eyeBtn.setAttribute('aria-label', 'パスワードを表示');
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
    const apiURL = `/php/register.php?user_email=${encodeURIComponent(email)}&user_passwd=${encodeURIComponent(passwd)}`;

    fetch(apiURL)
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.message || "サーバーエラー");
                });
            }
            return response.json();
        })
        .then(data => {
            // 成功
            if(data.status === 'success') {
                output.textContent = data.message;
                // ログイン画面に遷移
                this.location.href='/html/login.html'
            } else {
                output.textContent = data.message;
            }
        })
        .catch(error => {
            output.textContent = error.message;
            console.error(error);
        });
}