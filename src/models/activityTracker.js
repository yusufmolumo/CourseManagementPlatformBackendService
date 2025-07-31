const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const statusEnum = ['Done', 'Pending', 'Not Started'];

const ActivityTracker = sequelize.define('ActivityTracker', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  allocationId: { type: DataTypes.UUID, allowNull: false },
  attendance: { type: DataTypes.JSON, allowNull: false }, // Array of booleans or objects
  formativeOneGrading: { type: DataTypes.ENUM(...statusEnum), allowNull: false },
  formativeTwoGrading: { type: DataTypes.ENUM(...statusEnum), allowNull: false },
  SummativeGrading: { type: DataTypes.ENUM(...statusEnum), allowNull: false },
  courseModeration: { type: DataTypes.ENUM(...statusEnum), allowNull: false },
  intranetSync: { type: DataTypes.ENUM(...statusEnum), allowNull: false },
  gradeBookStatus: { type: DataTypes.ENUM(...statusEnum), allowNull: false },
}, { tableName: 'activity_trackers' });

module.exports = ActivityTracker; 