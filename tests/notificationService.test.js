const { sendNotification } = require('../src/services/notificationService');
const notificationQueue = require('../src/jobs/notificationQueue');

// Mock the notification queue
jest.mock('../src/jobs/notificationQueue', () => ({
  add: jest.fn()
}));

describe('Notification Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('sendNotification', () => {
    it('should add notification to queue with correct data', async () => {
      const notificationData = {
        type: 'reminder',
        recipient: 'facilitator@test.com',
        message: 'Please submit your activity log',
        data: {
          facilitatorName: 'John Doe',
          week: 25,
          courseName: 'Advanced Backend'
        }
      };

      notificationQueue.add.mockResolvedValue({ id: 'job-123' });

      await sendNotification(notificationData);

      expect(notificationQueue.add).toHaveBeenCalledWith(notificationData);
    });

    it('should handle queue errors gracefully', async () => {
      const notificationData = {
        type: 'reminder',
        recipient: 'facilitator@test.com',
        message: 'Please submit your activity log'
      };

      const errorMessage = 'Queue is full';
      notificationQueue.add.mockRejectedValue(new Error(errorMessage));

      await expect(sendNotification(notificationData)).rejects.toThrow(errorMessage);
    });

    it('should send reminder notification with correct structure', async () => {
      const reminderData = {
        type: 'reminder',
        recipient: 'facilitator@test.com',
        message: 'Reminder: Please submit your activity log for week 25',
        data: {
          facilitatorName: 'John Doe',
          week: 25,
          courseName: 'Advanced Backend'
        }
      };

      notificationQueue.add.mockResolvedValue({ id: 'reminder-job-123' });

      await sendNotification(reminderData);

      expect(notificationQueue.add).toHaveBeenCalledWith(reminderData);
      expect(notificationQueue.add.mock.calls[0][0].type).toBe('reminder');
      expect(notificationQueue.add.mock.calls[0][0].recipient).toBe('facilitator@test.com');
      expect(notificationQueue.add.mock.calls[0][0].data.facilitatorName).toBe('John Doe');
    });

    it('should send submission alert notification with correct structure', async () => {
      const alertData = {
        type: 'submission_alert',
        recipient: 'manager@test.com',
        message: 'Facilitator John Doe submitted activity log for week 25',
        data: {
          managerName: 'Manager Smith',
          facilitatorName: 'John Doe',
          week: 25,
          courseName: 'Advanced Backend'
        }
      };

      notificationQueue.add.mockResolvedValue({ id: 'alert-job-456' });

      await sendNotification(alertData);

      expect(notificationQueue.add).toHaveBeenCalledWith(alertData);
      expect(notificationQueue.add.mock.calls[0][0].type).toBe('submission_alert');
      expect(notificationQueue.add.mock.calls[0][0].recipient).toBe('manager@test.com');
      expect(notificationQueue.add.mock.calls[0][0].data.managerName).toBe('Manager Smith');
    });

    it('should send overdue alert notification with correct structure', async () => {
      const overdueData = {
        type: 'overdue_alert',
        recipient: 'manager@test.com',
        message: 'Alert: John Doe has not submitted activity log for week 25',
        data: {
          managerName: 'Manager Smith',
          facilitatorName: 'John Doe',
          week: 25,
          courseName: 'Advanced Backend'
        }
      };

      notificationQueue.add.mockResolvedValue({ id: 'overdue-job-789' });

      await sendNotification(overdueData);

      expect(notificationQueue.add).toHaveBeenCalledWith(overdueData);
      expect(notificationQueue.add.mock.calls[0][0].type).toBe('overdue_alert');
      expect(notificationQueue.add.mock.calls[0][0].recipient).toBe('manager@test.com');
      expect(notificationQueue.add.mock.calls[0][0].data.facilitatorName).toBe('John Doe');
    });

    it('should handle multiple notifications in sequence', async () => {
      const notifications = [
        {
          type: 'reminder',
          recipient: 'facilitator1@test.com',
          message: 'Reminder 1',
          data: { facilitatorName: 'John Doe', week: 25, courseName: 'Course 1' }
        },
        {
          type: 'reminder',
          recipient: 'facilitator2@test.com',
          message: 'Reminder 2',
          data: { facilitatorName: 'Jane Smith', week: 25, courseName: 'Course 2' }
        }
      ];

      notificationQueue.add.mockResolvedValue({ id: 'job-123' });

      for (const notification of notifications) {
        await sendNotification(notification);
      }

      expect(notificationQueue.add).toHaveBeenCalledTimes(2);
      expect(notificationQueue.add.mock.calls[0][0].recipient).toBe('facilitator1@test.com');
      expect(notificationQueue.add.mock.calls[1][0].recipient).toBe('facilitator2@test.com');
    });
  });
}); 