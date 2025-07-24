// sendNotification can be used for both immediate and scheduled notifications
const notificationQueue = require('../jobs/notificationQueue');

const sendNotification = async ({ type, recipient, message }) => {
  await notificationQueue.add({ type, recipient, message });
};

module.exports = { sendNotification }; 