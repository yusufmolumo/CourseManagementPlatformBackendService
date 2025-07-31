const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CourseOffering = sequelize.define('CourseOffering', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  moduleID: { type: DataTypes.UUID, allowNull: false },
  classID: { type: DataTypes.UUID, allowNull: false },
  facilitatorID: { type: DataTypes.UUID, allowNull: false },
  trimester: { type: DataTypes.STRING, allowNull: false },
  modeID: { type: DataTypes.UUID, allowNull: false },
  year: { type: DataTypes.INTEGER, allowNull: false },
  createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
}, { tableName: 'course_offerings', updatedAt: false });

module.exports = CourseOffering; 