<?php
$to = $_GET['email'] ?? null;
$subject = "テストメール";
$message = "メール送信テストです。";
$headers = "From: test@example.com";

if (mail($to, $subject, $message, $headers)) {
    echo "送信成功";
} else {
    echo "送信失敗";
}
?>