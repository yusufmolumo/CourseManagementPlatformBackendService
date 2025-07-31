const { Facilitator } = require('../models');

const createFacilitator = async (data) => Facilitator.create(data);
const getFacilitators = async () => Facilitator.findAll();
const getFacilitatorById = async (id) => Facilitator.findByPk(id);
const updateFacilitator = async (id, data) => {
  const facilitator = await Facilitator.findByPk(id);
  if (!facilitator) throw new Error('Facilitator not found');
  return facilitator.update(data);
};
const deleteFacilitator = async (id) => {
  const facilitator = await Facilitator.findByPk(id);
  if (!facilitator) throw new Error('Facilitator not found');
  return facilitator.destroy();
};

module.exports = { createFacilitator, getFacilitators, getFacilitatorById, updateFacilitator, deleteFacilitator };