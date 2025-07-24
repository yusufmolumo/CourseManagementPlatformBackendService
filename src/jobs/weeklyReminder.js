const cron = require('node-cron');
const { CourseOffering, ActivityTracker, User } = require('../models');
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
  const offerings = await CourseOffering.findAll({ include: [{ model: User, as: 'Facilitator' }] });
  for (const offering of offerings) {
    const facilitator = offering.Facilitator;
    if (!facilitator) continue;
    const log = await ActivityTracker.findOne({ where: { CourseOfferingId: offering.id, facilitatorId: facilitator.id, week } });
    if (!log) {
      await sendNotification({
        type: 'reminder',
        recipient: facilitator.email,
        message: `Reminder: Please submit your activity log for week ${week} for course ${offering.ModuleId}.`,
      });
    }
  }
}

// Schedule: every Sunday at 18:00 (6pm)
cron.schedule('0 18 * * 0', () => {
  console.log('Running weekly reminder job...');
  checkAndRemind();
});

module.exports = { checkAndRemind }; 