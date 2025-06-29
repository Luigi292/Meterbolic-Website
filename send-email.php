<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// SMTP Configuration (using your credentials)
$smtpHost = 'smtp.meterbolic.com'; // Replace with your SMTP host
$smtpUsername = 'luigi.maretto@meterbolic.com';
$smtpPassword = 'Metello05!';
$adminEmail = 'luigi.maretto@meterbolic.com';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the raw POST data
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    // Validate required fields
    if (empty($data['email']) || empty($data['_subject'])) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Missing required fields']);
        exit;
    }

    // Extract data
    $subject = $data['_subject'];
    $userEmail = $data['email'];
    $userName = $data['firstName'] ?? $data['fullName'] ?? 'Customer';
    $redirectUrl = $data['redirect'] ?? 'https://meterbolic-app.vercel.app/thank-you.html';

    // Build email content for admin
    $adminContent = "<h2>New Form Submission</h2><p><strong>Subject:</strong> $subject</p>";
    foreach ($data as $key => $value) {
        if (!in_array($key, ['_subject', 'teamEmail', 'redirect'])) {
            $adminContent .= "<p><strong>" . ucfirst($key) . ":</strong> $value</p>";
        }
    }

    // Build email content for user
    $userContent = "<h2>Dear $userName,</h2>";
    $userContent .= "<p>Thank you for contacting Meterbolic!</p>";
    $userContent .= "<p>We've received your submission with the following details:</p>";
    
    foreach ($data as $key => $value) {
        if (!in_array($key, ['_subject', 'teamEmail', 'consent', 'redirect'])) {
            $userContent .= "<p><strong>" . ucfirst($key) . ":</strong> $value</p>";
        }
    }
    
    $userContent .= "<p>We'll get back to you shortly.</p>";
    $userContent .= "<p>Best regards,<br>The Meterbolic Team</p>";

    // Email headers
    $headers = [
        'From' => $smtpUsername,
        'Reply-To' => $adminEmail,
        'MIME-Version' => '1.0',
        'Content-type' => 'text/html; charset=utf-8',
        'X-Mailer' => 'PHP/' . phpversion()
    ];

    // Send email using SMTP (you'll need to configure your server's mail settings)
    $adminHeaders = '';
    foreach ($headers as $key => $value) {
        $adminHeaders .= "$key: $value\r\n";
    }

    // Send email to admin
    $adminSent = mail($adminEmail, $subject, $adminContent, $adminHeaders);

    // Send confirmation to user
    $userSubject = "Thank you for contacting Meterbolic";
    $userHeaders = '';
    foreach ($headers as $key => $value) {
        $userHeaders .= "$key: $value\r\n";
    }
    $userSent = mail($userEmail, $userSubject, $userContent, $userHeaders);

    if ($adminSent && $userSent) {
        http_response_code(200);
        echo json_encode([
            'status' => 'success', 
            'message' => 'Emails sent successfully',
            'redirect' => $redirectUrl
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Failed to send emails']);
    }
    exit;
}

// If not a POST request
http_response_code(405);
echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
?>