const { CourseOffering } = require('../models');

const createAllocation = async (data) => CourseOffering.create(data);
const getAllocations = async () => CourseOffering.findAll();
const getAllocationById = async (id) => CourseOffering.findByPk(id);
const updateAllocation = async (id, data) => {
  const allocation = await CourseOffering.findByPk(id);
  if (!allocation) throw new Error('Allocation not found');
  return allocation.update(data);
};
const deleteAllocation = async (id) => {
  const allocation = await CourseOffering.findByPk(id);
  if (!allocation) throw new Error('Allocation not found');
  return allocation.destroy();
};

module.exports = { createAllocation, getAllocations, getAllocationById, updateAllocation, deleteAllocation };