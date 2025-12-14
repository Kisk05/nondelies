function togglePassword() {
    const passwdInput = document.getElementById('user_passwd');
    const eyeBtn = document.getElementById('eyeBtn');

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

function login() {
    const userEmail = document.getElementById('user_email').value.trim();
    const userPasswd = document.getElementById('user_passwd').value.trim();
    const outputDiv = document.getElementById('output');

    outputDiv.textContent = '処理中...';

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

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(userEmail)) {
        outputDiv.textContent = '正しいメールアドレスを入力してください';
        return;
    }

    const apiURL = `/php/login.php?user_email=${encodeURIComponent(userEmail)}&user_passwd=${encodeURIComponent(userPasswd)}`;

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
                const userId=data.ID;
                // タイトル画面に遷移
                this.location.href=`/html/title.html?user_id=${userId}`;
            } else {
                output.textContent = data.message;
            }
        })
        .catch(error => {
            outputDiv.textContent = error.message;
            console.error(error);
        });
}