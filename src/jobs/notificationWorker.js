const notificationQueue = require('./notificationQueue');
const { checkAndRemind } = require('./weeklyReminder');

notificationQueue.process(async (job) => {
  const { type, recipient, message } = job.data;
  // Simulate sending notification (e.g., email, SMS, in-app)
  console.log(`[Notification] Type: ${type} | To: ${recipient} | Message: ${message}`);
  // Log delivery result (could be saved to DB or file in a real app)
  return { delivered: true, timestamp: new Date() };
});

console.log('Notification worker started and listening for jobs...');
// Start the weekly reminder job
// (It will run automatically on schedule) 