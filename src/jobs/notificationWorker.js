const notificationQueue = require('./notificationQueue');
const { checkAndRemind } = require('./weeklyReminder');
const EmailService = require('../services/emailService');

notificationQueue.process(async (job) => {
  const { type, recipient, message, data } = job.data;
  
  try {
    let result;
    
    switch (type) {
      case 'reminder':
        // Send reminder email to facilitator
        result = await EmailService.sendReminderEmail(
          recipient,
          data.facilitatorName,
          data.week,
          data.courseName
        );
        break;
        
      case 'submission_alert':
        // Send submission alert to manager
        result = await EmailService.sendSubmissionAlertEmail(
          recipient,
          data.managerName,
          data.facilitatorName,
          data.week,
          data.courseName
        );
        break;
        
      case 'overdue_alert':
        // Send overdue alert to manager
        result = await EmailService.sendOverdueAlertEmail(
          recipient,
          data.managerName,
          data.facilitatorName,
          data.week,
          data.courseName
        );
        break;
        
      default:
        // Fallback to generic email
        result = await EmailService.sendEmail(recipient, `Notification: ${type}`, message);
    }
    
    if (result.success) {
      console.log(`[Email Sent] Type: ${type} | To: ${recipient} | Message ID: ${result.messageId}`);
      return { delivered: true, timestamp: new Date(), messageId: result.messageId };
    } else {
      console.error(`[Email Failed] Type: ${type} | To: ${recipient} | Error: ${result.error}`);
      return { delivered: false, timestamp: new Date(), error: result.error };
    }
    
  } catch (error) {
    console.error(`[Notification Error] Type: ${type} | To: ${recipient} | Error:`, error);
    return { delivered: false, timestamp: new Date(), error: error.message };
  }
});

console.log('Notification worker started and listening for jobs...');
// Start the weekly reminder job
// (It will run automatically on schedule) 