const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cohort = sequelize.define('Cohort', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
}, { tableName: 'cohorts' });

module.exports = Cohort; 