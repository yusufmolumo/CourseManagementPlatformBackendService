const sequelize = require('../config/database');
const Manager = require('./manager');
const Module = require('./module');
const Class = require('./class');
const Student = require('./student');
const Facilitator = require('./facilitator');
const Mode = require('./mode');
const CourseOffering = require('./courseOffering');
const ActivityTracker = require('./activityTracker');

// Associations
Student.belongsTo(Class, { foreignKey: 'classID' });
// Cohort model is not exposed for CRUD, so just reference by ID

// Facilitator belongs to Manager
Facilitator.belongsTo(Manager, { foreignKey: 'managerID' });

CourseOffering.belongsTo(Module, { foreignKey: 'moduleID' });
CourseOffering.belongsTo(Class, { foreignKey: 'classID' });
CourseOffering.belongsTo(Facilitator, { foreignKey: 'facilitatorID' });
CourseOffering.belongsTo(Mode, { foreignKey: 'modeID' });

ActivityTracker.belongsTo(CourseOffering, { foreignKey: 'allocationId' });
CourseOffering.hasMany(ActivityTracker, { foreignKey: 'allocationId' });

const syncModels = async () => {
  await sequelize.sync({ alter: true });
};

module.exports = {
  Manager,
  Module,
  Class,
  Student,
  Facilitator,
  Mode,
  CourseOffering,
  ActivityTracker,
  syncModels,
}; 