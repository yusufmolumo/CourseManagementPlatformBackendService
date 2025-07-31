const express = require('express');
const EmailService = require('../services/emailService');
const { authenticate, authorize } = require('../middlewares/auth');

const router = express.Router();

// Test email route (only for development/testing)
router.post('/test-email', authenticate, authorize('manager'), async (req, res) => {
  try {
    const { recipient, type } = req.body;
    
    let result;
    
    switch (type) {
      case 'reminder':
        result = await EmailService.sendReminderEmail(
          recipient,
          'John Doe',
          25,
          'Advanced Backend'
        );
        break;
        
      case 'submission_alert':
        result = await EmailService.sendSubmissionAlertEmail(
          recipient,
          'Manager Name',
          'John Doe',
          25,
          'Advanced Backend'
        );
        break;
        
      case 'overdue_alert':
        result = await EmailService.sendOverdueAlertEmail(
          recipient,
          'Manager Name',
          'John Doe',
          25,
          'Advanced Backend'
        );
        break;
        
      default:
        return res.status(400).json({ message: 'Invalid email type' });
    }
    
    if (result.success) {
      res.json({ 
        message: 'Test email sent successfully', 
        messageId: result.messageId 
      });
    } else {
      res.status(500).json({ 
        message: 'Failed to send test email', 
        error: result.error 
      });
    }
    
  } catch (error) {
    res.status(500).json({ message: 'Error sending test email', error: error.message });
  }
});

module.exports = router; 