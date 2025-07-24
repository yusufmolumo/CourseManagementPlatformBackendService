const { ActivityTracker, CourseOffering, User } = require('../models');

const createActivity = async (data) => {
  return await ActivityTracker.create(data);
};

const getActivities = async (filters = {}, user) => {
  const where = {};
  if (filters.week) where.week = filters.week;
  if (filters.status) where[filters.statusField] = filters.status;
  if (filters.courseOfferingId) where.CourseOfferingId = filters.courseOfferingId;
  if (user.role === 'facilitator') where.facilitatorId = user.id;
  if (filters.facilitatorId && user.role === 'manager') where.facilitatorId = filters.facilitatorId;
  return await ActivityTracker.findAll({
    where,
    include: [
      { model: CourseOffering, include: [{ all: true }] },
      { model: User, as: 'Facilitator', attributes: ['id', 'name', 'email'] }
    ],
  });
};

const getActivityById = async (id, user) => {
  const activity = await ActivityTracker.findByPk(id, {
    include: [
      { model: CourseOffering, include: [{ all: true }] },
      { model: User, as: 'Facilitator', attributes: ['id', 'name', 'email'] }
    ],
  });
  if (!activity) return null;
  if (user.role === 'facilitator' && activity.facilitatorId !== user.id) return null;
  return activity;
};

const updateActivity = async (id, data, user) => {
  const activity = await ActivityTracker.findByPk(id);
  if (!activity) throw new Error('Activity not found');
  if (user.role === 'facilitator' && activity.facilitatorId !== user.id) throw new Error('Forbidden');
  return await activity.update(data);
};

const deleteActivity = async (id, user) => {
  const activity = await ActivityTracker.findByPk(id);
  if (!activity) throw new Error('Activity not found');
  if (user.role === 'facilitator' && activity.facilitatorId !== user.id) throw new Error('Forbidden');
  return await activity.destroy();
};

module.exports = {
  createActivity,
  getActivities,
  getActivityById,
  updateActivity,
  deleteActivity,
}; 