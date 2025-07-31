const cron = require('node-cron');
const { CourseOffering, ActivityTracker, Facilitator, Module, Manager } = require('../models');
const { sendNotification } = require('../services/notificationService');

function getCurrentWeek() {
  // ISO week number (1-53)
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const days = Math.floor((now - start) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + start.getDay() + 1) / 7);
}

async function checkAndRemind() {
  const week = getCurrentWeek();
  
  try {
    // Get all course offerings with facilitator and module details
    const offerings = await CourseOffering.findAll({
      include: [
        { model: Facilitator, as: 'Facilitator' },
        { model: Module, as: 'Module' }
      ]
    });

    for (const offering of offerings) {
      const facilitator = offering.Facilitator;
      const module = offering.Module;
      
      if (!facilitator || !module) continue;

      // Check if log exists for this week
      const log = await ActivityTracker.findOne({
        where: { 
          allocationId: offering.id,
          week: week 
        }
      });

      if (!log) {
        // Send reminder to facilitator
        await sendNotification({
          type: 'reminder',
          recipient: facilitator.email,
          message: `Reminder: Please submit your activity log for week ${week} for course ${module.name}.`,
          data: {
            facilitatorName: facilitator.name,
            week: week,
            courseName: module.name
          }
        });

        // Also send overdue alert to manager
        const manager = await Manager.findByPk(facilitator.managerID);
        if (manager) {
          await sendNotification({
            type: 'overdue_alert',
            recipient: manager.email || 'manager@example.com', // Fallback email
            message: `Alert: ${facilitator.name} has not submitted activity log for week ${week} for course ${module.name}.`,
            data: {
              managerName: manager.name,
              facilitatorName: facilitator.name,
              week: week,
              courseName: module.name
            }
          });
        }
      }
    }
    
    console.log(`Weekly reminder check completed for week ${week}`);
  } catch (error) {
    console.error('Error in weekly reminder check:', error);
  }
}

// Schedule: every Sunday at 18:00 (6pm)
cron.schedule('0 18 * * 0', () => {
  console.log('Running weekly reminder job...');
  checkAndRemind();
});

module.exports = { checkAndRemind }; 