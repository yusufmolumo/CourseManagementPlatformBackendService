const EmailService = require('../src/services/emailService');

// Mock nodemailer transporter
jest.mock('../src/config/email', () => ({
  sendMail: jest.fn()
}));

const mockTransporter = require('../src/config/email');

describe('Email Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('sendReminderEmail', () => {
    it('should send reminder email with correct parameters', async () => {
      const recipient = 'facilitator@test.com';
      const facilitatorName = 'John Doe';
      const week = 25;
      const courseName = 'Advanced Backend';

      mockTransporter.sendMail.mockResolvedValue({
        messageId: 'test-message-id-123'
      });

      const result = await EmailService.sendReminderEmail(
        recipient,
        facilitatorName,
        week,
        courseName
      );

      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: process.env.EMAIL_FROM,
        to: recipient,
        subject: `Activity Log Reminder - Week ${week}`,
        text: '',
        html: expect.stringContaining(facilitatorName)
      });

      expect(result.success).toBe(true);
      expect(result.messageId).toBe('test-message-id-123');
    });

    it('should include correct HTML content in reminder email', async () => {
      const recipient = 'facilitator@test.com';
      const facilitatorName = 'John Doe';
      const week = 25;
      const courseName = 'Advanced Backend';

      mockTransporter.sendMail.mockResolvedValue({
        messageId: 'test-message-id-123'
      });

      await EmailService.sendReminderEmail(
        recipient,
        facilitatorName,
        week,
        courseName
      );

      const callArgs = mockTransporter.sendMail.mock.calls[0][0];
      expect(callArgs.html).toContain(facilitatorName);
      expect(callArgs.html).toContain(`Week ${week}`);
      expect(callArgs.html).toContain(courseName);
      expect(callArgs.html).toContain('Activity Log Reminder');
    });
  });

  describe('sendSubmissionAlertEmail', () => {
    it('should send submission alert email with correct parameters', async () => {
      const recipient = 'manager@test.com';
      const managerName = 'Manager Smith';
      const facilitatorName = 'John Doe';
      const week = 25;
      const courseName = 'Advanced Backend';

      mockTransporter.sendMail.mockResolvedValue({
        messageId: 'alert-message-id-456'
      });

      const result = await EmailService.sendSubmissionAlertEmail(
        recipient,
        managerName,
        facilitatorName,
        week,
        courseName
      );

      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: process.env.EMAIL_FROM,
        to: recipient,
        subject: `Activity Log Submitted - Week ${week}`,
        text: '',
        html: expect.stringContaining(facilitatorName)
      });

      expect(result.success).toBe(true);
      expect(result.messageId).toBe('alert-message-id-456');
    });

    it('should include correct HTML content in submission alert', async () => {
      const recipient = 'manager@test.com';
      const managerName = 'Manager Smith';
      const facilitatorName = 'John Doe';
      const week = 25;
      const courseName = 'Advanced Backend';

      mockTransporter.sendMail.mockResolvedValue({
        messageId: 'alert-message-id-456'
      });

      await EmailService.sendSubmissionAlertEmail(
        recipient,
        managerName,
        facilitatorName,
        week,
        courseName
      );

      const callArgs = mockTransporter.sendMail.mock.calls[0][0];
      expect(callArgs.html).toContain(managerName);
      expect(callArgs.html).toContain(facilitatorName);
      expect(callArgs.html).toContain(`Week ${week}`);
      expect(callArgs.html).toContain(courseName);
      expect(callArgs.html).toContain('Activity Log Submitted');
    });
  });

  describe('sendOverdueAlertEmail', () => {
    it('should send overdue alert email with correct parameters', async () => {
      const recipient = 'manager@test.com';
      const managerName = 'Manager Smith';
      const facilitatorName = 'John Doe';
      const week = 25;
      const courseName = 'Advanced Backend';

      mockTransporter.sendMail.mockResolvedValue({
        messageId: 'overdue-message-id-789'
      });

      const result = await EmailService.sendOverdueAlertEmail(
        recipient,
        managerName,
        facilitatorName,
        week,
        courseName
      );

      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: process.env.EMAIL_FROM,
        to: recipient,
        subject: `Activity Log Overdue - Week ${week}`,
        text: '',
        html: expect.stringContaining(facilitatorName)
      });

      expect(result.success).toBe(true);
      expect(result.messageId).toBe('overdue-message-id-789');
    });

    it('should include correct HTML content in overdue alert', async () => {
      const recipient = 'manager@test.com';
      const managerName = 'Manager Smith';
      const facilitatorName = 'John Doe';
      const week = 25;
      const courseName = 'Advanced Backend';

      mockTransporter.sendMail.mockResolvedValue({
        messageId: 'overdue-message-id-789'
      });

      await EmailService.sendOverdueAlertEmail(
        recipient,
        managerName,
        facilitatorName,
        week,
        courseName
      );

      const callArgs = mockTransporter.sendMail.mock.calls[0][0];
      expect(callArgs.html).toContain(managerName);
      expect(callArgs.html).toContain(facilitatorName);
      expect(callArgs.html).toContain(`Week ${week}`);
      expect(callArgs.html).toContain(courseName);
      expect(callArgs.html).toContain('Activity Log Overdue');
    });
  });

  describe('sendEmail (generic)', () => {
    it('should send generic email successfully', async () => {
      const to = 'test@example.com';
      const subject = 'Test Subject';
      const html = '<p>Test content</p>';
      const text = 'Test content';

      mockTransporter.sendMail.mockResolvedValue({
        messageId: 'generic-message-id-123'
      });

      const result = await EmailService.sendEmail(to, subject, html, text);

      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: process.env.EMAIL_FROM,
        to,
        subject,
        text,
        html
      });

      expect(result.success).toBe(true);
      expect(result.messageId).toBe('generic-message-id-123');
    });

    it('should handle email sending errors', async () => {
      const to = 'test@example.com';
      const subject = 'Test Subject';
      const html = '<p>Test content</p>';

      const errorMessage = 'SMTP connection failed';
      mockTransporter.sendMail.mockRejectedValue(new Error(errorMessage));

      const result = await EmailService.sendEmail(to, subject, html);

      expect(result.success).toBe(false);
      expect(result.error).toBe(errorMessage);
    });
  });
}); 