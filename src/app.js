require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database');
const redisClient = require('./config/redis');
const { syncModels } = require('./models');
const authRoutes = require('./routes/auth');
const courseOfferingRoutes = require('./routes/courseOffering');
const activityTrackerRoutes = require('./routes/activityTracker');
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
setupSwagger(app);

module.exports = app; 