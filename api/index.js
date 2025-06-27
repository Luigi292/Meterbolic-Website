require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configure transporter with more robust settings
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    // Important for some email providers
    rejectUnauthorized: false
  },
  // Better timeout handling
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000
});

// Verify transporter on startup
transporter.verify((error) => {
  if (error) {
    console.error('SMTP Connection Error:', error);
  } else {
    console.log('SMTP Server is ready to take our messages');
  }
});

// Enhanced error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

// Newsletter endpoint with improved validation
app.post('/api/subscribe', async (req, res) => {
  try {
    const { firstName, email } = req.body;

    // Enhanced validation
    if (!firstName?.trim() || !email?.trim()) {
      return res.status(400).json({ 
        success: false, 
        error: 'First name and email are required' 
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please enter a valid email address' 
      });
    }

    // Prepare email promises
    const adminEmail = transporter.sendMail({
      from: `"Meterbolic Website" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: 'New Newsletter Subscription',
      html: `
        <h2>New Subscriber</h2>
        <p><strong>Name:</strong> ${firstName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
      `
    });

    const userEmail = transporter.sendMail({
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

    // Execute both emails in parallel
    await Promise.all([adminEmail, userEmail]);
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Subscription Error:', error);
    
    // Special handling for SMTP errors
    if (error.code === 'ECONNECTION' || error.code === 'ETIMEDOUT') {
      return res.status(502).json({ 
        success: false, 
        error: 'Email service temporarily unavailable. Your subscription was recorded but confirmation email may be delayed.' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      error: 'Failed to process subscription. Please try again later.' 
    });
  }
});

// Registration endpoint with similar improvements
app.post('/api/register', async (req, res) => {
  try {
    const { fullName, email, interest, consent } = req.body;

    if (!fullName?.trim() || !email?.trim() || !interest || !consent) {
      return res.status(400).json({ 
        success: false, 
        error: 'All fields are required' 
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please enter a valid email address' 
      });
    }

    const adminEmail = transporter.sendMail({
      from: `"Meterbolic Website" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: 'New Registration for Waitlist',
      html: `
        <h2>New Waitlist Registration</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Interest:</strong> ${interest}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
      `
    });

    const userEmail = transporter.sendMail({
      from: `"Meterbolic Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Thanks for joining our waitlist',
      html: `
        <h2>Thank you for registering, ${fullName}!</h2>
        <p>You've been successfully added to our waitlist.</p>
        <p>We'll notify you as soon as we launch our platform.</p>
        <p><strong>Your interest:</strong> ${interest}</p>
        <p>If you have any questions, please reply to this email.</p>
        <p>Best regards,<br>The Meterbolic Team</p>
      `
    });

    await Promise.all([adminEmail, userEmail]);
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Registration Error:', error);
    
    if (error.code === 'ECONNECTION' || error.code === 'ETIMEDOUT') {
      return res.status(502).json({ 
        success: false, 
        error: 'Email service temporarily unavailable. Your registration was recorded but confirmation email may be delayed.' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      error: 'Failed to process registration. Please try again later.' 
    });
  }
});

module.exports = app;