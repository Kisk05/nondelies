<?php
header('Content-Type: application/json; charset=utf-8');

require __DIR__ . '/../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$email = $_GET['email'] ?? null;

if (!$email) {
    echo json_encode([
        "success" => false,
        "message" => "メールアドレスが指定されていません"
    ]);
    exit;
}

$mail = new PHPMailer(true);

try {
    // SMTP設定
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;

    // ✅ Gmail アドレス
    $mail->Username = getenv('SMTP_USER'); //envからもってくる


    // ✅ Gmail のアプリパスワード（16桁）
    $mail->Password = getenv('SMTP_PASS');


    $mail->SMTPSecure = 'tls';
    $mail->Port = 587;

    // 送信元
    $mail->setFrom('supatoku.team777@gmail.com', 'スパ得');

    // 宛先
    $mail->addAddress($email);
    $mail->addAddress("kd1366460@st.kobedenshi.ac.jp");
    //$mail->addAddress("kd1340354@st.kobedenshi.ac.jp");

    // メール内容
    $mail->isHTML(true);
    $mail->CharSet = 'UTF-8';
    $mail->Encoding = 'base64';
    $mail->Subject = 'テストメール';
    $mail->Body = "ローカル環境から PHPMailer + Gmail SMTP で送信しています。";

    // 送信
    $mail->send();

    echo json_encode([
        "success" => true,
        "message" => "メールを送信しました"
    ]);

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "PHPMailer Error: " . $mail->ErrorInfo
    ]);
}