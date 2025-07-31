const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Module = sequelize.define('Module', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: { type: DataTypes.STRING, allowNull: false },
  half: { type: DataTypes.STRING, allowNull: false }, // e.g., 'H1'
}, { tableName: 'modules' });

module.exports = Module; 