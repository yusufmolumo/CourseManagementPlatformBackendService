const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a simple transporter for development
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || 'test@example.com',
    pass: process.env.EMAIL_PASS || 'testpass',
  },
});

// Simple verification without blocking
transporter.verify((error, success) => {
  if (error) {
    console.log('Email configuration note: Email service not fully configured');
  } else {
    console.log('Email server is ready to send messages');
  }
});

module.exports = transporter; 