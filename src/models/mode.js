const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Mode = sequelize.define('Mode', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  type: { type: DataTypes.ENUM('Online', 'In-person', 'Hybrid'), allowNull: false },
}, { tableName: 'modes' });

module.exports = Mode; 