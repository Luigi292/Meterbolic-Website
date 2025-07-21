<?php
// Enable error reporting for debugging (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);
date_default_timezone_set('Europe/London');

// Import PHPMailer classes
require __DIR__ . '/PHPMailer/src/Exception.php';
require __DIR__ . '/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/PHPMailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Only process POST requests
if ($_SERVER["REQUEST_METHOD"] != "POST") {
    header("Location: https://meterbolic-website.vercel.app");
    exit;
}

// Get form data
$fullName = isset($_POST['fullName']) ? htmlspecialchars(trim($_POST['fullName'])) : '';
$email = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL) : '';
$interest = isset($_POST['interest']) ? htmlspecialchars(trim($_POST['interest'])) : '';
$consent = isset($_POST['consent']) ? true : false;

// Validate required fields
if (empty($fullName) || empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL) || empty($interest) || !$consent) {
    header("Location: https://meterbolic-website.vercel.app?error=validation");
    exit;
}

// Create PHPMailer instance
$mail = new PHPMailer(true);

try {
    // Server settings for Gmail
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'uiux@meterbolic.com';
    $mail->Password = 'kmhrgmacjgeojfzi';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = 465;
    
    // First email - to your team
    $mail->setFrom($email, $fullName);
    $mail->addAddress('luigimaretto292@gmail.com', 'Meterbolic Team');
    $mail->addReplyTo($email, $fullName);
    
    $mail->isHTML(true);
    $mail->Subject = "New Waitlist Registration: $fullName";
    $mail->Body = "
        <h2 style='color: #2d3748;'>New Waitlist Registration</h2>
        <p style='font-size: 16px;'><strong>Name:</strong> $fullName</p>
        <p style='font-size: 16px;'><strong>Email:</strong> <a href='mailto:$email'>$email</a></p>
        <p style='font-size: 16px;'><strong>Interest:</strong> $interest</p>
        <p style='font-size: 16px;'><strong>Consent:</strong> " . ($consent ? 'Yes' : 'No') . "</p>
    ";
    
    $mail->send();
    
    // Reset for the confirmation email to the user
    $mail->clearAddresses();
    $mail->clearReplyTos();
    
    // Second email - confirmation to user
    $mail->setFrom('uiux@meterbolic.com', 'Meterbolic Team');
    $mail->addAddress($email, $fullName);
    $mail->Subject = "Thank you for joining Meterbolic's waitlist";
    
    $mail->Body = "
        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #2d3748;'>
            <div style='text-align: center; margin-bottom: 20px;'>
                <img src='https://meterbolic-website.vercel.app/images/original-logo.png' alt='Meterbolic Logo' style='max-width: 200px;'>
            </div>
            
            <h2 style='color: #2d3748;'>Thank you for joining our waitlist, $fullName!</h2>
            
            <p style='font-size: 16px;'>We're excited to have you on board as we prepare to launch our advanced metabolic testing platform.</p>
            
            <div style='background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;'>
                <h3 style='color: #4a5568; margin-top: 0;'>Your registration details:</h3>
                <p style='font-size: 16px;'><strong>Name:</strong> $fullName</p>
                <p style='font-size: 16px;'><strong>Email:</strong> $email</p>
                <p style='font-size: 16px;'><strong>Area of interest:</strong> $interest</p>
            </div>
            
            <p style='font-size: 16px;'>We'll notify you as soon as our platform is ready.</p>
        </div>
    ";
    
    $mail->send();
    
    // Display success page
    echo '<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Registration Successful | Meterbolic</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Lexend:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
            body {
                font-family: "Inter", sans-serif;
                background-color: #f8f9fa;
                color: #2d3748;
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                text-align: center;
                background: linear-gradient(135deg, #f5f7fa 0%, #e2e8f0 100%);
            }
            .success-container {
                background: white;
                padding: 3rem;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                max-width: 600px;
                width: 90%;
            }
            .success-icon {
                color: #4CAF50;
                font-size: 5rem;
                margin-bottom: 1.5rem;
            }
            h1 {
                color: #2d3748;
                margin-bottom: 1rem;
                font-family: "Lexend", sans-serif;
            }
            p {
                font-size: 1.1rem;
                margin-bottom: 2rem;
                line-height: 1.6;
                color: #4a5568;
            }
            .btn {
                display: inline-block;
                background-color: #4CAF50;
                color: white;
                padding: 12px 24px;
                border-radius: 8px;
                text-decoration: none;
                font-weight: 600;
                transition: all 0.3s ease;
                border: none;
                cursor: pointer;
                font-size: 1rem;
                margin-top: 1rem;
            }
            .btn:hover {
                background-color: #3e8e41;
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            }
            .logo {
                margin-bottom: 2rem;
            }
            .logo img {
                max-width: 200px;
            }
        </style>
    </head>
    <body>
        <div class="success-container">
            <div class="logo">
                <img src="https://meterbolic-website.vercel.app/images/original-logo.png" alt="Meterbolic Logo">
            </div>
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h1>Registration Successful!</h1>
            <p>Thank you for joining the Meterbolic waitlist, ' . $fullName . '.</p>
            <p>We\'ve sent a confirmation email to <strong>' . $email . '</strong> with your registration details.</p>
            <p>Our team will notify you when we launch our metabolic testing platform.</p>
            <a href="https://meterbolic-website.vercel.app" class="btn">
                Return to Home <i class="fas fa-arrow-right"></i>
            </a>
        </div>
    </body>
    </html>';
    exit;
    
} catch (Exception $e) {
    header("Location: https://meterbolic-website.vercel.app?error=send_error");
    exit;
}
?>