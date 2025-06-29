// api/server.js
require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verify transporter connection
transporter.verify((error, success) => {
  if (error) {
    console.error('Error with mail transporter:', error);
  } else {
    console.log('Server is ready to send emails');
  }
});

// Newsletter subscription endpoint
app.post('/api/subscribe', async (req, res) => {
  try {
    const { firstName, email } = req.body;

    if (!firstName || !email) {
      return res.status(400).json({ 
        success: false, 
        error: 'First name and email are required' 
      });
    }

    // Email to admin
    const adminMail = {
      from: `"Meterbolic Website" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: 'New Newsletter Subscription',
      html: `
        <h2>New Newsletter Subscriber</h2>
        <p><strong>Name:</strong> ${firstName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Source:</strong> Newsletter form in "Stay in Touch" section</p>
      `
    };

    // Confirmation email to user
    const userMail = {
      from: `"Meterbolic Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Thanks for subscribing to our newsletter',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0;">
          <h2 style="color: #2a5885;">Thank you for subscribing, ${firstName}!</h2>
          <p>You've been successfully added to our newsletter list at Meterbolic.</p>
          <p>We'll keep you updated with the latest news about metabolic health and our services.</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; margin: 20px 0; border-left: 4px solid #2a5885;">
            <p><strong>Your subscription details:</strong></p>
            <p>Name: ${firstName}</p>
            <p>Email: ${email}</p>
          </div>
          
          <p>If you didn't request this subscription, please ignore this email.</p>
          <p>Best regards,<br>The Meterbolic Team</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #777;">
            <p>Meterbolic | Where health meets Longevity</p>
            <p>© ${new Date().getFullYear()} Meterbolic. All rights reserved.</p>
          </div>
        </div>
      `
    };

    // Send both emails
    await transporter.sendMail(adminMail);
    await transporter.sendMail(userMail);

    res.status(200).json({ success: true, message: 'Subscription successful!' });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to process subscription. Please try again later.' 
    });
  }
});

// Registration endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { fullName, email, interest } = req.body;

    if (!fullName || !email || !interest) {
      return res.status(400).json({ 
        success: false, 
        error: 'All fields are required' 
      });
    }

    // Email to admin
    const adminMail = {
      from: `"Meterbolic Website" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: 'New Registration for Waitlist',
      html: `
        <h2>New Waitlist Registration</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Interest:</strong> ${interest}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Source:</strong> Registration form in "Join Our Waitlist" modal</p>
      `
    };

    // Confirmation email to user
    const userMail = {
      from: `"Meterbolic Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Thanks for joining our waitlist',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0;">
          <h2 style="color: #2a5885;">Thank you for registering, ${fullName}!</h2>
          <p>You've been successfully added to our waitlist at Meterbolic.</p>
          <p>We'll notify you as soon as we launch our platform.</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; margin: 20px 0; border-left: 4px solid #2a5885;">
            <p><strong>Your registration details:</strong></p>
            <p>Name: ${fullName}</p>
            <p>Email: ${email}</p>
            <p>Interest: ${interest}</p>
          </div>
          
          <p>Our team will review your information and get in touch with you soon.</p>
          <p>If you have any questions, please reply to this email.</p>
          <p>Best regards,<br>The Meterbolic Team</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #777;">
            <p>Meterbolic | Where health meets Longevity</p>
            <p>© ${new Date().getFullYear()} Meterbolic. All rights reserved.</p>
          </div>
        </div>
      `
    };

    // Send both emails
    await transporter.sendMail(adminMail);
    await transporter.sendMail(userMail);

    res.status(200).json({ success: true, message: 'Registration successful!' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to process registration. Please try again later.' 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;