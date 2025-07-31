const transporter = require('../config/email');

class EmailService {
  // Send reminder email to facilitator
  static async sendReminderEmail(recipient, facilitatorName, week, courseName) {
    const subject = `Activity Log Reminder - Week ${week}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">Activity Log Reminder</h2>
        <p>Dear ${facilitatorName},</p>
        <p>This is a friendly reminder that your activity log for <strong>Week ${week}</strong> 
        for the course <strong>${courseName}</strong> is due.</p>
        <p>Please log into the Course Management Platform and submit your weekly activity report.</p>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Due:</strong> End of Week ${week}</p>
          <p><strong>Course:</strong> ${courseName}</p>
        </div>
        <p>If you have already submitted your log, please disregard this reminder.</p>
        <p>Best regards,<br>Course Management Team</p>
      </div>
    `;

    return this.sendEmail(recipient, subject, html);
  }

  // Send submission alert to manager
  static async sendSubmissionAlertEmail(recipient, managerName, facilitatorName, week, courseName) {
    const subject = `Activity Log Submitted - Week ${week}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #27ae60;">Activity Log Submitted</h2>
        <p>Dear ${managerName},</p>
        <p>This is to notify you that <strong>${facilitatorName}</strong> has submitted their activity log 
        for <strong>Week ${week}</strong> for the course <strong>${courseName}</strong>.</p>
        <div style="background-color: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Facilitator:</strong> ${facilitatorName}</p>
          <p><strong>Week:</strong> ${week}</p>
          <p><strong>Course:</strong> ${courseName}</p>
          <p><strong>Status:</strong> Submitted</p>
        </div>
        <p>You can review the submission in the Course Management Platform.</p>
        <p>Best regards,<br>Course Management System</p>
      </div>
    `;

    return this.sendEmail(recipient, subject, html);
  }

  // Send overdue alert to manager
  static async sendOverdueAlertEmail(recipient, managerName, facilitatorName, week, courseName) {
    const subject = `Activity Log Overdue - Week ${week}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #e74c3c;">Activity Log Overdue</h2>
        <p>Dear ${managerName},</p>
        <p>This is to alert you that <strong>${facilitatorName}</strong> has not submitted their activity log 
        for <strong>Week ${week}</strong> for the course <strong>${courseName}</strong>.</p>
        <div style="background-color: #fdeaea; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Facilitator:</strong> ${facilitatorName}</p>
          <p><strong>Week:</strong> ${week}</p>
          <p><strong>Course:</strong> ${courseName}</p>
          <p><strong>Status:</strong> Overdue</p>
        </div>
        <p>Please follow up with the facilitator to ensure timely submission.</p>
        <p>Best regards,<br>Course Management System</p>
      </div>
    `;

    return this.sendEmail(recipient, subject, html);
  }

  // Generic email sending function
  static async sendEmail(to, subject, html, text = '') {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: to,
        subject: subject,
        text: text,
        html: html,
      };

      const result = await transporter.sendMail(mailOptions);
      console.log(`Email sent successfully to ${to}:`, result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Email sending failed:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = EmailService; 