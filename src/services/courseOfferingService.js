const { CourseOffering, Module, Cohort, Class, Mode, User } = require('../models');

const createCourseOffering = async (data) => {
  return await CourseOffering.create(data);
};

const getCourseOfferings = async (filters = {}) => {
  // Build where clause based on filters
  const where = {};
  if (filters.trimester) where.trimester = filters.trimester;
  if (filters.intakePeriod) where.intakePeriod = filters.intakePeriod;
  if (filters.facilitatorId) where.facilitatorId = filters.facilitatorId;
  if (filters.ModuleId) where.ModuleId = filters.ModuleId;
  if (filters.CohortId) where.CohortId = filters.CohortId;
  if (filters.ClassId) where.ClassId = filters.ClassId;
  if (filters.ModeId) where.ModeId = filters.ModeId;
  return await CourseOffering.findAll({
    where,
    include: [Module, Cohort, Class, Mode, { model: User, as: 'Facilitator', attributes: ['id', 'name', 'email'] }],
  });
};

const getCourseOfferingById = async (id) => {
  return await CourseOffering.findByPk(id, {
    include: [Module, Cohort, Class, Mode, { model: User, as: 'Facilitator', attributes: ['id', 'name', 'email'] }],
  });
};

const updateCourseOffering = async (id, data) => {
  const offering = await CourseOffering.findByPk(id);
  if (!offering) throw new Error('CourseOffering not found');
  return await offering.update(data);
};

const deleteCourseOffering = async (id) => {
  const offering = await CourseOffering.findByPk(id);
  if (!offering) throw new Error('CourseOffering not found');
  return await offering.destroy();
};

module.exports = {
  createCourseOffering,
  getCourseOfferings,
  getCourseOfferingById,
  updateCourseOffering,
  deleteCourseOffering,
}; 