const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CourseOffering = sequelize.define('CourseOffering', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  intakePeriod: { type: DataTypes.ENUM('HT1', 'HT2', 'FT'), allowNull: false },
  trimester: { type: DataTypes.STRING, allowNull: false },
}, { tableName: 'course_offerings' });

module.exports = CourseOffering; 