const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Class = sequelize.define('Class', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  startDate: { type: DataTypes.DATE, allowNull: false },
  graduationDate: { type: DataTypes.DATE, allowNull: false },
}, { tableName: 'classes' });

module.exports = Class; 