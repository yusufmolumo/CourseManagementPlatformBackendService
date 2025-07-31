require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database');
const redisClient = require('./config/redis');
const { syncModels } = require('./models');
const authRoutes = require('./routes/auth');
const courseOfferingRoutes = require('./routes/courseOffering');
const activityTrackerRoutes = require('./routes/activityTracker');
const moduleRoutes = require('./routes/module');
const classRoutes = require('./routes/class');
const studentRoutes = require('./routes/student');
const facilitatorRoutes = require('./routes/facilitator');
const allocationRoutes = require('./routes/allocation');
const managerRoutes = require('./routes/manager');
const testEmailRoutes = require('./routes/testEmail');
const setupSwagger = require('../swagger/swagger');

const app = express();

app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('Course Management Platform Backend Service is running!');
});

// Test MySQL connection
sequelize.authenticate()
  .then(() => {
    console.log('MySQL connection established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to MySQL:', err);
  });

// Test Redis connection
redisClient.on('connect', () => {
  console.log('Connected to Redis successfully.');
});

// Sync all models
syncModels();

app.use('/api/auth', authRoutes);
app.use('/api/course-offerings', courseOfferingRoutes);
app.use('/api/activity-logs', activityTrackerRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/facilitators', facilitatorRoutes);
app.use('/api/allocations', allocationRoutes);
app.use('/api/managers', managerRoutes);
app.use('/api/test', testEmailRoutes);
setupSwagger(app);

module.exports = app; 