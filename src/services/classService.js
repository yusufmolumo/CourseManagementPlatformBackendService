const { Class } = require('../models');

const createClass = async (data) => Class.create(data);
const getClasses = async () => Class.findAll();
const getClassById = async (id) => Class.findByPk(id);
const updateClass = async (id, data) => {
  const klass = await Class.findByPk(id);
  if (!klass) throw new Error('Class not found');
  return klass.update(data);
};
const deleteClass = async (id) => {
  const klass = await Class.findByPk(id);
  if (!klass) throw new Error('Class not found');
  return klass.destroy();
};

module.exports = { createClass, getClasses, getClassById, updateClass, deleteClass };