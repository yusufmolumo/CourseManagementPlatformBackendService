const { Module } = require('../models');

const createModule = async (data) => Module.create(data);
const getModules = async () => Module.findAll();
const getModuleById = async (id) => Module.findByPk(id);
const updateModule = async (id, data) => {
  const module = await Module.findByPk(id);
  if (!module) throw new Error('Module not found');
  return module.update(data);
};
const deleteModule = async (id) => {
  const module = await Module.findByPk(id);
  if (!module) throw new Error('Module not found');
  return module.destroy();
};

module.exports = { createModule, getModules, getModuleById, updateModule, deleteModule };