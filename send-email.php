<?php
// Enable error reporting (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);
date_default_timezone_set('Europe/London');

// Import PHPMailer classes
require __DIR__ . '/PHPMailer/src/Exception.php';
require __DIR__ . '/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/PHPMailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

// Only process POST requests
if ($_SERVER["REQUEST_METHOD"] != "POST") {
    http_response_code(405);
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit;
}

// Get form data
$fullName = isset($_POST['fullName']) ? htmlspecialchars(trim($_POST['fullName'])) : '';
$email = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL) : '';
$interest = isset($_POST['interest']) ? htmlspecialchars(trim($_POST['interest'])) : '';
$consent = isset($_POST['consent']) ? true : false;

// Validate required fields
$errors = [];
if (empty($fullName)) {
    $errors['fullName'] = 'Full name is required';
}

if (empty($email)) {
    $errors['email'] = 'Email is required';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'Invalid email format';
}

if (empty($interest)) {
    $errors['interest'] = 'Please select an interest';
}

if (!$consent) {
    $errors['consent'] = 'You must agree to receive emails';
}

if (!empty($errors)) {
    header('Content-Type: application/json');
    echo json_encode([
        'status' => 'error', 
        'message' => 'Validation failed', 
        'errors' => $errors
    ]);
    exit;
}

// Email configuration (replace with your actual credentials)
$smtpUsername = 'luigi.maretto@gmail.com';
$smtpPassword = 'rdjuaijobuvotwct'; // No spaces in app password
$teamEmail = 'luigi.maretto@meterbolic.com';

// Create PHPMailer instance
$mail = new PHPMailer(true);

try {
    // Server settings
    $mail->SMTPDebug = SMTP::DEBUG_OFF; // Set to DEBUG_SERVER for troubleshooting
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = $smtpUsername;
    $mail->Password = $smtpPassword;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = 465;
    
    // Enable these if you have SSL issues
    $mail->SMTPOptions = [
        'ssl' => [
            'verify_peer' => false,
            'verify_peer_name' => false,
            'allow_self_signed' => true
        ]
    ];

    // Recipients - Team Notification
    $mail->setFrom($email, $fullName);
    $mail->addAddress($teamEmail, 'Meterbolic Team');
    $mail->addReplyTo($email, $fullName);

    // Content - Team Notification
    $mail->isHTML(true);
    $mail->Subject = "New Waitlist Registration: $fullName";
    $mail->Body = "
        <h2 style='color: #2d3748;'>New Waitlist Registration</h2>
        <p style='font-size: 16px;'><strong>Name:</strong> $fullName</p>
        <p style='font-size: 16px;'><strong>Email:</strong> <a href='mailto:$email'>$email</a></p>
        <p style='font-size: 16px;'><strong>Interest:</strong> $interest</p>
        <p style='font-size: 16px;'><strong>Consent:</strong> " . ($consent ? 'Yes' : 'No') . "</p>
        <p style='font-size: 16px; margin-top: 20px;'>This person has joined the Meterbolic waitlist.</p>
    ";
    $mail->AltBody = "New Waitlist Registration\n\nName: $fullName\nEmail: $email\nInterest: $interest\nConsent: " . ($consent ? 'Yes' : 'No') . "\n\nThis person has joined the Meterbolic waitlist.";

    $mail->send();

    // Reset for confirmation email
    $mail->clearAddresses();
    $mail->clearReplyTos();
    
    // Confirmation Email to User
    $mail->setFrom($teamEmail, 'Meterbolic Team');
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
            
            <p style='font-size: 16px;'>We'll notify you as soon as our platform is ready. In the meantime, you can learn more about metabolic health on our website.</p>
            
            <p style='font-size: 16px;'>If you have any questions, feel free to reply to this email.</p>
            
            <p style='font-size: 16px;'>Best regards,<br><strong>The Meterbolic Team</strong></p>
            
            <div style='margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 14px; color: #718096;'>
                <p>This is an automated message. Please do not reply directly to this email.</p>
                <p>© " . date('Y') . " Meterbolic. All rights reserved.</p>
            </div>
        </div>
    ";
    $mail->AltBody = "Thank you for joining our waitlist, $fullName!\n\nWe're excited to have you on board as we prepare to launch our advanced metabolic testing platform.\n\nYour registration details:\nName: $fullName\nEmail: $email\nArea of interest: $interest\n\nWe'll notify you as soon as our platform is ready. In the meantime, you can learn more about metabolic health on our website.\n\nIf you have any questions, feel free to reply to this email.\n\nBest regards,\nThe Meterbolic Team\n\nThis is an automated message. Please do not reply directly to this email.\n© " . date('Y') . " Meterbolic. All rights reserved.";

    $mail->send();

    // Success response
    header('Content-Type: application/json');
    echo json_encode([
        'status' => 'success',
        'message' => 'Thank you for registering! A confirmation email has been sent to your address.',
        'redirect' => 'https://meterbolic-website.vercel.app/thank-you.html'
    ]);

} catch (Exception $e) {
    // Error response
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Message could not be sent. Please try again later.'
        // For debugging only (remove in production):
        // 'debug' => 'Mailer Error: ' . $e->getMessage()
    ]);
}
?>