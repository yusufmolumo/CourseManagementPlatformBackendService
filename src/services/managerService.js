const { Manager } = require('../models');

const createManager = async (data) => Manager.create(data);
const getManagers = async () => Manager.findAll();
const getManagerById = async (id) => Manager.findByPk(id);
const updateManager = async (id, data) => {
  const manager = await Manager.findByPk(id);
  if (!manager) throw new Error('Manager not found');
  return manager.update(data);
};
const deleteManager = async (id) => {
  const manager = await Manager.findByPk(id);
  if (!manager) throw new Error('Manager not found');
  return manager.destroy();
};

module.exports = { createManager, getManagers, getManagerById, updateManager, deleteManager };