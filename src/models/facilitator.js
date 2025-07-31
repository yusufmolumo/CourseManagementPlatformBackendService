const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Manager = require('./manager');

const Facilitator = sequelize.define('Facilitator', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  name: { type: DataTypes.STRING, allowNull: false },
  qualification: { type: DataTypes.STRING, allowNull: false },
  location: { type: DataTypes.STRING, allowNull: false },
  managerID: { type: DataTypes.UUID, allowNull: false },
}, { tableName: 'facilitators' });

Facilitator.belongsTo(Manager, { foreignKey: 'managerID' });

module.exports = Facilitator;