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
    header("Location: https://meterbolic.com/");
    exit;
}

// Honeypot check - if this field is filled, it's likely a bot
if (!empty($_POST['honeypot'])) {
    // Silently redirect bots to homepage
    header("Location: https://meterbolic.com/");
    exit;
}

// Get form data with proper sanitization
$firstName = isset($_POST['firstName']) ? htmlspecialchars(trim($_POST['firstName']), ENT_QUOTES, 'UTF-8') : '';
$lastName = isset($_POST['lastName']) ? htmlspecialchars(trim($_POST['lastName']), ENT_QUOTES, 'UTF-8') : '';
$email = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL) : '';
$phone = isset($_POST['phone']) ? htmlspecialchars(trim($_POST['phone']), ENT_QUOTES, 'UTF-8') : '';
$phonePrefix = isset($_POST['phonePrefix']) ? htmlspecialchars(trim($_POST['phonePrefix']), ENT_QUOTES, 'UTF-8') : '+44';
$postcode = isset($_POST['postcode']) ? htmlspecialchars(trim($_POST['postcode']), ENT_QUOTES, 'UTF-8') : '';
$town = isset($_POST['town']) ? htmlspecialchars(trim($_POST['town']), ENT_QUOTES, 'UTF-8') : '';
$address = isset($_POST['address']) ? htmlspecialchars(trim($_POST['address']), ENT_QUOTES, 'UTF-8') : '';
$houseNumber = isset($_POST['houseNumber']) ? htmlspecialchars(trim($_POST['houseNumber']), ENT_QUOTES, 'UTF-8') : '';
$country = isset($_POST['country']) ? htmlspecialchars(trim($_POST['country']), ENT_QUOTES, 'UTF-8') : '';
$selectedProduct = isset($_POST['selectedProduct']) ? htmlspecialchars(trim($_POST['selectedProduct']), ENT_QUOTES, 'UTF-8') : '';
$selectedMethod = isset($_POST['selectedMethod']) ? htmlspecialchars(trim($_POST['selectedMethod']), ENT_QUOTES, 'UTF-8') : '';
$methodPrice = isset($_POST['methodPrice']) ? htmlspecialchars(trim($_POST['methodPrice']), ENT_QUOTES, 'UTF-8') : '';
$productPrice = isset($_POST['productPrice']) ? htmlspecialchars(trim($_POST['productPrice']), ENT_QUOTES, 'UTF-8') : '';
$totalAmount = isset($_POST['totalAmount']) ? htmlspecialchars(trim($_POST['totalAmount']), ENT_QUOTES, 'UTF-8') : '';
$marketing = isset($_POST['marketing']) ? true : false;
$privacy = isset($_POST['privacy']) ? true : false;

// Team email
$teamEmail = 'uiux@meterbolic.com';

// Validate required fields
$errors = [];
if (empty($firstName)) {
    $errors[] = 'First name is required';
}
if (empty($lastName)) {
    $errors[] = 'Last name is required';
}
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Valid email is required';
}
if (empty($phone)) {
    $errors[] = 'Phone number is required';
}
if (empty($phonePrefix)) {
    $errors[] = 'Phone prefix is required';
}
if (empty($postcode)) {
    $errors[] = 'Postcode is required';
}
if (empty($town)) {
    $errors[] = 'Town/City is required';
}
if (empty($address)) {
    $errors[] = 'Street address is required';
}
if (empty($houseNumber)) {
    $errors[] = 'House number/name is required';
}
if (empty($country)) {
    $errors[] = 'Country is required';
}
if (empty($selectedProduct)) {
    $errors[] = 'Please select a product';
}
if (empty($selectedMethod)) {
    $errors[] = 'Please select a collection method';
}
if (!$privacy) {
    $errors[] = 'You must agree to the Privacy and Cookies Policy';
}

// If validation errors, redirect back with error messages
if (!empty($errors)) {
    $errorString = urlencode(implode('|', $errors));
    header("Location: https://meterbolic.com/checkout.html?error=" . $errorString);
    exit;
}

// Format product names for display
$productDisplayName = ($selectedProduct == 'baseline') ? 'Meterbolic Baseline' : 'Meterbolic Response';
$methodDisplayName = ($selectedMethod == 'finger-prick') ? 'Finger Prick' : 'Tasso';
$basePrice = ($selectedProduct == 'baseline') ? '£89' : '£179';
$deliveryFee = '£8.50';

// Calculate final total with delivery
$finalTotal = '£' . (floatval(str_replace('£', '', $totalAmount)) + 8.50);

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
    $mail->CharSet = 'UTF-8';
    
    // First email - to your team
    $mail->setFrom($email, $firstName . ' ' . $lastName);
    $mail->addAddress($teamEmail, 'Meterbolic Team');
    $mail->addReplyTo($email, $firstName . ' ' . $lastName);
    
    $mail->isHTML(true);
    $mail->Subject = "New Order: $productDisplayName - $firstName $lastName";
    $mail->Body = "
        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #2d3748;'>
            <div style='text-align: center; margin-bottom: 20px;'>
                <h1 style='color: #2d3748;'>New Order Received</h1>
            </div>
            
            <div style='background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;'>
                <h3 style='color: #4a5568; margin-top: 0;'>Order Details:</h3>
                <p style='font-size: 16px;'><strong>Product:</strong> $productDisplayName</p>
                <p style='font-size: 16px;'><strong>Collection Method:</strong> $methodDisplayName</p>
                <p style='font-size: 16px;'><strong>Base Price:</strong> $basePrice</p>
                <p style='font-size: 16px;'><strong>Method Price:</strong> £$methodPrice</p>
                <p style='font-size: 16px;'><strong>Subtotal:</strong> $totalAmount</p>
                <p style='font-size: 16px;'><strong>Delivery Fee:</strong> $deliveryFee</p>
                <p style='font-size: 16px;'><strong>Final Total:</strong> <strong>$finalTotal</strong></p>
            </div>
            
            <div style='background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;'>
                <h3 style='color: #4a5568; margin-top: 0;'>Customer Information:</h3>
                <p style='font-size: 16px;'><strong>Name:</strong> $firstName $lastName</p>
                <p style='font-size: 16px;'><strong>Email:</strong> <a href='mailto:$email'>$email</a></p>
                <p style='font-size: 16px;'><strong>Phone:</strong> $phonePrefix $phone</p>
                <p style='font-size: 16px;'><strong>Marketing Consent:</strong> " . ($marketing ? 'Yes' : 'No') . "</p>
            </div>
            
            <div style='background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;'>
                <h3 style='color: #4a5568; margin-top: 0;'>Delivery Address:</h3>
                <p style='font-size: 16px;'>$houseNumber<br>$address<br>$town<br>$postcode<br>$country</p>
            </div>
            
            <p style='font-size: 16px;'><strong>Date:</strong> " . date('F j, Y, g:i a') . "</p>
        </div>
    ";
    
    $mail->send();
    
    // Reset for the confirmation email to the user
    $mail->clearAddresses();
    $mail->clearReplyTos();
    
    // Second email - confirmation to user
    $mail->setFrom('uiux@meterbolic.com', 'Meterbolic Team');
    $mail->addAddress($email, $firstName . ' ' . $lastName);
    $mail->Subject = "Your Meterbolic Order Confirmation";
    
    $mail->Body = "
        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #2d3748;'>
            <div style='text-align: center; margin-bottom: 20px;'>
                <h1 style='color: #2d3748;'>Order Confirmed!</h1>
            </div>
            
            <p style='font-size: 16px;'>Dear $firstName,</p>
            
            <p style='font-size: 16px;'>Thank you for your order with Meterbolic! We're excited to help you gain comprehensive insights into your metabolic health.</p>
            
            <div style='background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;'>
                <h3 style='color: #4a5568; margin-top: 0;'>Your Order Summary:</h3>
                <p style='font-size: 16px;'><strong>Product:</strong> $productDisplayName</p>
                <p style='font-size: 16px;'><strong>Collection Method:</strong> $methodDisplayName</p>
                <p style='font-size: 16px;'><strong>Base Price:</strong> $basePrice</p>
                <p style='font-size: 16px;'><strong>Method Price:</strong> £$methodPrice</p>
                <p style='font-size: 16px;'><strong>Subtotal:</strong> $totalAmount</p>
                <p style='font-size: 16px;'><strong>Delivery Fee:</strong> $deliveryFee</p>
                <p style='font-size: 16px;'><strong>Final Total:</strong> <strong>$finalTotal</strong></p>
            </div>
            
            <div style='background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;'>
                <h3 style='color: #4a5568; margin-top: 0;'>What Happens Next:</h3>
                <ol style='font-size: 16px; padding-left: 20px;'>
                    <li>We'll process your order within 24 hours</li>
                    <li>Your test kit will be shipped to your address</li>
                    <li>You'll receive tracking information once shipped</li>
                    <li>Follow the instructions in your kit to collect samples</li>
                    <li>Return your samples using the prepaid envelope</li>
                    <li>Receive your results in your secure dashboard</li>
                </ol>
            </div>
            
            <div style='background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;'>
                <h3 style='color: #4a5568; margin-top: 0;'>Delivery Address:</h3>
                <p style='font-size: 16px;'>$firstName $lastName<br>$houseNumber<br>$address<br>$town<br>$postcode<br>$country</p>
            </div>
            
            <p style='font-size: 16px;'>If you have any questions about your order, please contact us at uiux@meterbolic.com</p>
            
            <p style='font-size: 16px;'>Best regards,<br>The Meterbolic Team</p>
        </div>
    ";
    
    $mail->send();
    
    // Redirect to thank you page
    header("Location: https://meterbolic.com/thank-you.html");
    exit;
    
} catch (Exception $e) {
    // Log the error for debugging
    error_log('Mailer Error: ' . $mail->ErrorInfo);
    
    // Redirect with error message
    header("Location: https://meterbolic.com/checkout.html?error=send_error");
    exit;
}
?>