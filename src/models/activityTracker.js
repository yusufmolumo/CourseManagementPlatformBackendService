const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const CourseOffering = require('./courseOffering');
const User = require('./user');

const statusEnum = ['Done', 'Pending', 'Not Started'];

const ActivityTracker = sequelize.define('ActivityTracker', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  week: { type: DataTypes.INTEGER, allowNull: false },
  attendance: { type: DataTypes.JSON, allowNull: false }, // Array of booleans
  formativeOneGrading: { type: DataTypes.ENUM(...statusEnum), allowNull: false },
  formativeTwoGrading: { type: DataTypes.ENUM(...statusEnum), allowNull: false },
  summativeGrading: { type: DataTypes.ENUM(...statusEnum), allowNull: false },
  courseModeration: { type: DataTypes.ENUM(...statusEnum), allowNull: false },
  intranetSync: { type: DataTypes.ENUM(...statusEnum), allowNull: false },
  gradeBookStatus: { type: DataTypes.ENUM(...statusEnum), allowNull: false },
}, { tableName: 'activity_trackers' });

ActivityTracker.belongsTo(CourseOffering, { foreignKey: { allowNull: false } });
ActivityTracker.belongsTo(User, { as: 'Facilitator', foreignKey: { name: 'facilitatorId', allowNull: false } });

CourseOffering.hasMany(ActivityTracker);
User.hasMany(ActivityTracker, { as: 'FacilitatorActivities', foreignKey: 'facilitatorId' });

module.exports = ActivityTracker; 