const Bull = require('bull');
require('dotenv').config();

const notificationQueue = new Bull('notifications', {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

module.exports = notificationQueue; 