// js/server.js
require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

// Email configuration using environment variables
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Form submission endpoint
app.post('/api/subscribe', async (req, res) => {
  try {
    const { firstName, email } = req.body;

    if (!firstName || !email) {
      return res.status(400).json({ 
        success: false, 
        error: 'First name and email are required' 
      });
    }

    // 1. Email to admin
    await transporter.sendMail({
      from: `"Meterbolic Website" <${process.env.EMAIL_USER}>`,
      to: 'luigi.marets@gmail.com',
      subject: 'New Newsletter Subscription',
      html: `
        <h2>New Subscriber</h2>
        <p><strong>Name:</strong> ${firstName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
      `
    });

    // 2. Confirmation email to user
    await transporter.sendMail({
      from: `"Meterbolic Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Thanks for subscribing to our newsletter',
      html: `
        <h2>Thank you for subscribing, ${firstName}!</h2>
        <p>You've been successfully added to our newsletter list.</p>
        <p>We'll keep you updated with the latest news about metabolic health and our services.</p>
        <p>If you have any questions, please reply to this email.</p>
        <p>Best regards,<br>The Meterbolic Team</p>
      `
    });

    res.status(200).json({ success: true, message: 'Subscription successful!' });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to process subscription. Please try again later.' 
    });
  }
});

// Serve HTML file for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});