<?php
// Enable error reporting for debugging (remove in production)
error_reporting(0);
ini_set('display_errors', 0);

// Import PHPMailer classes
require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Only process POST requests
if ($_SERVER["REQUEST_METHOD"] != "POST") {
    header("Location: https://meterbolic.com");
    exit;
}

// Get form type (registration or newsletter)
$formType = isset($_POST['_subject']) ? strtolower($_POST['_subject']) : 'contact';

// Process different form types
if ($formType === 'new waitlist registration - meterbolic') {
    // Registration form processing
    $required = ['fullName', 'email', 'interest'];
    $name = htmlspecialchars(trim($_POST['fullName']));
    $email = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
    $subject = "New Waitlist Registration";
    $message = "Interest: " . htmlspecialchars(trim($_POST['interest']));
} elseif ($formType === 'new newsletter subscription') {
    // Newsletter form processing
    $required = ['firstName', 'email'];
    $name = htmlspecialchars(trim($_POST['firstName']));
    $email = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
    $subject = "New Newsletter Subscription";
    $message = "Subscriber: $name <$email>";
} else {
    // Contact form processing (default)
    $required = ['name', 'email', 'subject', 'message'];
    $name = htmlspecialchars(trim($_POST['name']));
    $email = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
    $subject = htmlspecialchars(trim($_POST['subject']));
    $message = htmlspecialchars(trim($_POST['message']));
}

// Validate required fields
foreach ($required as $field) {
    if (empty($_POST[$field])) {
        header("Location: https://meterbolic.com?error=missing_fields");
        exit;
    }
}

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header("Location: https://meterbolic.com?error=invalid_email");
    exit;
}

// Create PHPMailer instance
$mail = new PHPMailer(true);

try {
    // Server settings for Gmail (will need app password)
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'info@meterbolic.com'; // Your Meterbolic email
    $mail->Password = 'YOUR_APP_PASSWORD_HERE'; // You'll need to set this up
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = 465;
    
    // First email - to Meterbolic
    $mail->setFrom($email, $name);
    $mail->addAddress('info@meterbolic.com', 'Meterbolic Team');
    $mail->addReplyTo($email, $name);
    
    $mail->isHTML(true);
    $mail->Subject = "[Meterbolic] $subject";
    $mail->Body = "
        <h2>New $subject</h2>
        <p><strong>From:</strong> $name &lt;$email&gt;</p>
        <p><strong>Subject:</strong> $subject</p>
        <p><strong>Message:</strong></p>
        <p>$message</p>
    ";
    $mail->AltBody = "Name: $name\nEmail: $email\nSubject: $subject\n\nMessage:\n$message";
    
    $mail->send();
    
    // Reset for the confirmation email to the user
    $mail->clearAddresses();
    $mail->clearReplyTos();
    
    // Second email - confirmation to user
    $mail->setFrom('info@meterbolic.com', 'Meterbolic Team');
    $mail->addAddress($email, $name);
    $mail->Subject = "Thank you for contacting Meterbolic";
    $mail->Body = "
        <h2>Thank you for your message, $name!</h2>
        <p>This is a confirmation that we've received your message:</p>
        <blockquote style='border-left: 3px solid #ccc; padding-left: 15px; margin-left: 0;'>
            <p><strong>Subject:</strong> $subject</p>
            <p>$message</p>
        </blockquote>
        <p>Our team will review your message and get back to you as soon as possible.</p>
        <p>Best regards,</p>
        <p><strong>The Meterbolic Team</strong><br>Where health meets longevity</p>
        <p style='font-size: 0.9em; color: #666;'>
            This is an automated message. Please do not reply directly to this email.
        </p>
    ";
    $mail->AltBody = "Thank you for your message, $name!\n\nThis is a confirmation that we've received your message:\n\nSubject: $subject\n\n$message\n\nOur team will review your message and get back to you as soon as possible.\n\nBest regards,\nThe Meterbolic Team\nWhere health meets longevity\n\nThis is an automated message. Please do not reply directly to this email.";
    
    $mail->send();
    
    // Display success page
    echo '<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Message Sent Successfully</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
            body {
                font-family: "Inter", sans-serif;
                background-color: #f8f9fa;
                color: #212529;
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                text-align: center;
                background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
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
                color: #28a745;
                font-size: 5rem;
                margin-bottom: 1.5rem;
            }
            h1 {
                color: #28a745;
                margin-bottom: 1rem;
                font-family: "Lexend", sans-serif;
            }
            p {
                font-size: 1.1rem;
                margin-bottom: 2rem;
                line-height: 1.6;
            }
            .btn {
                display: inline-block;
                background-color: #28a745;
                color: white;
                padding: 12px 24px;
                border-radius: 50px;
                text-decoration: none;
                font-weight: 600;
                transition: all 0.3s ease;
                border: none;
                cursor: pointer;
                font-size: 1rem;
                font-family: "Inter", sans-serif;
            }
            .btn:hover {
                background-color: #218838;
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            }
            .btn i {
                margin-left: 8px;
            }
        </style>
    </head>
    <body>
        <div class="success-container">
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h1>Message Sent Successfully!</h1>
            <p>Thank you for contacting Meterbolic, ' . $name . '. We have received your message and will get back to you as soon as possible.</p>
            <p>A confirmation email has been sent to ' . $email . '.</p>
            <a href="https://meterbolic.com" class="btn">
                Return to Website <i class="fas fa-arrow-right"></i>
            </a>
        </div>
    </body>
    </html>';
    exit;
    
} catch (Exception $e) {
    // Fallback to simple mail() function if SMTP fails
    $to = "info@meterbolic.com";
    $headers = "From: $email" . "\r\n" .
               "Reply-To: $email" . "\r\n" .
               "Content-Type: text/html; charset=UTF-8";
    
    $body = "<h2>New $subject</h2>
            <p><strong>From:</strong> $name &lt;$email&gt;</p>
            <p><strong>Subject:</strong> $subject</p>
            <p><strong>Message:</strong></p>
            <p>$message</p>";
    
    if (mail($to, "[Meterbolic] $subject", $body, $headers)) {
        // Simple success response if mail() works
        echo '<script>
            alert("Thank you for your message! We have received it and will contact you soon.");
            window.location.href = "https://meterbolic.com";
        </script>';
    } else {
        header("Location: https://meterbolic.com?error=send_error");
    }
    exit;
}
?>