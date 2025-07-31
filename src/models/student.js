const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  name: { type: DataTypes.STRING, allowNull: false },
  classID: { type: DataTypes.UUID, allowNull: false },
  cohortID: { type: DataTypes.UUID, allowNull: false },
}, { tableName: 'students' });

module.exports = Student;