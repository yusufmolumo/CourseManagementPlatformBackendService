const { checkAndRemind } = require('../src/jobs/weeklyReminder');
const { CourseOffering, ActivityTracker, Facilitator, Module, Manager, syncModels } = require('../src/models');
const { sendNotification } = require('../src/services/notificationService');

// Mock the notification service
jest.mock('../src/services/notificationService', () => ({
  sendNotification: jest.fn()
}));

describe('Weekly Reminder', () => {
  let manager, facilitator, module, courseOffering;

  beforeAll(async () => {
    await syncModels();
    
    // Create test data
    manager = await Manager.create({ name: 'Test Manager' });
    facilitator = await Facilitator.create({
      email: 'facilitator@test.com',
      name: 'Test Facilitator',
      qualification: 'PhD',
      location: 'Kigali',
      managerID: manager.id
    });
    module = await Module.create({ name: 'Test Module', half: 'H1' });
    
    courseOffering = await CourseOffering.create({
      moduleID: module.id,
      classID: 'test-class-id',
      facilitatorID: facilitator.id,
      trimester: '1',
      modeID: 'test-mode-id',
      year: 2024,
      createdAt: new Date()
    });
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await ActivityTracker.destroy({ where: {} });
  });

  afterAll(async () => {
    await CourseOffering.destroy({ where: {} });
    await Facilitator.destroy({ where: {} });
    await Manager.destroy({ where: {} });
    await Module.destroy({ where: {} });
  });

  describe('checkAndRemind', () => {
    it('should send reminder when no activity log exists', async () => {
      sendNotification.mockResolvedValue();

      await checkAndRemind();

      expect(sendNotification).toHaveBeenCalledWith({
        type: 'reminder',
        recipient: facilitator.email,
        message: expect.stringContaining('Reminder: Please submit your activity log'),
        data: {
          facilitatorName: facilitator.name,
          week: expect.any(Number),
          courseName: module.name
        }
      });
    });

    it('should send overdue alert to manager when no activity log exists', async () => {
      sendNotification.mockResolvedValue();

      await checkAndRemind();

      expect(sendNotification).toHaveBeenCalledWith({
        type: 'overdue_alert',
        recipient: manager.email || 'manager@example.com',
        message: expect.stringContaining('Alert: Test Facilitator has not submitted activity log'),
        data: {
          managerName: manager.name,
          facilitatorName: facilitator.name,
          week: expect.any(Number),
          courseName: module.name
        }
      });
    });

    it('should not send reminders when activity log exists', async () => {
      // Create an activity log for the current week
      const currentWeek = Math.ceil((new Date() - new Date(new Date().getFullYear(), 0, 1)) / (24 * 60 * 60 * 1000) / 7);
      
      await ActivityTracker.create({
        allocationId: courseOffering.id,
        attendance: [{ week1: true }],
        formativeOneGrading: 'Done',
        formativeTwoGrading: 'Done',
        SummativeGrading: 'Done',
        courseModeration: 'Done',
        intranetSync: 'Done',
        gradeBookStatus: 'Done'
      });

      sendNotification.mockResolvedValue();

      await checkAndRemind();

      // Should not send any notifications
      expect(sendNotification).not.toHaveBeenCalled();
    });

    it('should handle multiple course offerings correctly', async () => {
      // Create another course offering
      const module2 = await Module.create({ name: 'Test Module 2', half: 'H2' });
      const courseOffering2 = await CourseOffering.create({
        moduleID: module2.id,
        classID: 'test-class-id-2',
        facilitatorID: facilitator.id,
        trimester: '2',
        modeID: 'test-mode-id-2',
        year: 2024,
        createdAt: new Date()
      });

      sendNotification.mockResolvedValue();

      await checkAndRemind();

      // Should send reminders for both course offerings
      expect(sendNotification).toHaveBeenCalledTimes(4); // 2 reminders + 2 overdue alerts
    });

    it('should handle missing facilitator gracefully', async () => {
      // Create course offering without facilitator
      const courseOfferingNoFacilitator = await CourseOffering.create({
        moduleID: module.id,
        classID: 'test-class-id-3',
        facilitatorID: 'non-existent-facilitator-id',
        trimester: '3',
        modeID: 'test-mode-id-3',
        year: 2024,
        createdAt: new Date()
      });

      sendNotification.mockResolvedValue();

      await checkAndRemind();

      // Should not throw error and should continue processing
      expect(sendNotification).toHaveBeenCalled();
    });

    it('should handle missing module gracefully', async () => {
      // Create course offering without module
      const courseOfferingNoModule = await CourseOffering.create({
        moduleID: 'non-existent-module-id',
        classID: 'test-class-id-4',
        facilitatorID: facilitator.id,
        trimester: '4',
        modeID: 'test-mode-id-4',
        year: 2024,
        createdAt: new Date()
      });

      sendNotification.mockResolvedValue();

      await checkAndRemind();

      // Should not throw error and should continue processing
      expect(sendNotification).toHaveBeenCalled();
    });

    it('should handle notification service errors gracefully', async () => {
      sendNotification.mockRejectedValue(new Error('Notification service error'));

      // Should not throw error
      await expect(checkAndRemind()).resolves.not.toThrow();
    });
  });

  describe('getCurrentWeek', () => {
    it('should return a valid week number', async () => {
      // This test would require exposing the getCurrentWeek function
      // For now, we'll test that the function runs without error
      await expect(checkAndRemind()).resolves.not.toThrow();
    });
  });
}); 