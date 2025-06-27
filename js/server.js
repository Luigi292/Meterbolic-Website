const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email service
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-email-password'
  }
});

app.post('/send-email', async (req, res) => {
  try {
    const { toCompany, toUser, subject, userData } = req.body;

    // Email to company
    await transporter.sendMail({
      from: '"Meterbolic Website" <noreply@meterbolic.com>',
      to: toCompany,
      subject: subject,
      html: `
        <h2>New Registration</h2>
        <p><strong>Name:</strong> ${userData.fullName}</p>
        <p><strong>Email:</strong> ${userData.email}</p>
        <p><strong>Interest:</strong> ${userData.interest}</p>
        <p><strong>Message:</strong> ${userData.message || 'N/A'}</p>
      `
    });

    // Confirmation email to user
    await transporter.sendMail({
      from: '"Meterbolic Team" <info@meterbolic.com>',
      to: toUser,
      subject: 'Thank you for registering with Meterbolic',
      html: `
        <h2>Thank you for your interest!</h2>
        <p>Dear ${userData.fullName},</p>
        <p>We've received your registration and will contact you soon with more information about our services.</p>
        <p>Here's what you told us:</p>
        <ul>
          <li><strong>Interest:</strong> ${userData.interest}</li>
          ${userData.message ? `<li><strong>Your message:</strong> ${userData.message}</li>` : ''}
        </ul>
        <p>Best regards,<br>The Meterbolic Team</p>
      `
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ success: false, error: 'Failed to send email' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});