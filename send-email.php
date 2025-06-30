<?php
require 'PHPMailer/PHPMailer.php';
$mail = new PHPMailer\PHPMailer\PHPMailer();
$mail->isSMTP();
$mail->Host = 'mail.tophost.it';
$mail->SMTPAuth = true;
$mail->Username = 'info@luigimaretto.com';
$mail->Password = 'Meterbolic2025';
$mail->SMTPSecure = 'tls';
$mail->Port = 587;

if($mail->smtpConnect()) {
    echo "SMTP Connection Successful";
    $mail->smtpClose();
} else {
    echo "SMTP Connection Failed: " . $mail->ErrorInfo;
}
?>