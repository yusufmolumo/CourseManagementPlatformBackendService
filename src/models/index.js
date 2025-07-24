const sequelize = require('../config/database');
const User = require('./user');
const Module = require('./module');
const Cohort = require('./cohort');
const Class = require('./class');
const Mode = require('./mode');
const CourseOffering = require('./courseOffering');
const ActivityTracker = require('./activityTracker');

// Associations
CourseOffering.belongsTo(Module, { foreignKey: { allowNull: false } });
CourseOffering.belongsTo(Cohort, { foreignKey: { allowNull: false } });
CourseOffering.belongsTo(Class, { foreignKey: { allowNull: false } });
CourseOffering.belongsTo(Mode, { foreignKey: { allowNull: false } });
CourseOffering.belongsTo(User, { as: 'Facilitator', foreignKey: { name: 'facilitatorId', allowNull: false } });

// Optionally, add reverse associations if needed
Module.hasMany(CourseOffering);
Cohort.hasMany(CourseOffering);
Class.hasMany(CourseOffering);
Mode.hasMany(CourseOffering);
User.hasMany(CourseOffering, { as: 'FacilitatorCourses', foreignKey: 'facilitatorId' });

const syncModels = async () => {
  await sequelize.sync({ alter: true }); // Use alter for dev, switch to false for prod
};

module.exports = {
  User,
  Module,
  Cohort,
  Class,
  Mode,
  CourseOffering,
  ActivityTracker,
  syncModels,
}; 