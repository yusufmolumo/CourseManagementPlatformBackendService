const { ActivityTracker } = require('../models');

exports.createActivity = async (data) => {
  return await ActivityTracker.create(data);
};

exports.getAllActivities = async (query = {}) => {
  return await ActivityTracker.findAll({
    where: query,
    order: [['createdAt', 'DESC']]
  });
};

exports.getActivityById = async (id) => {
  return await ActivityTracker.findByPk(id);
};

exports.updateActivity = async (id, data) => {
  const activity = await ActivityTracker.findByPk(id);
  if (!activity) return null;
  
  await activity.update(data);
  return activity;
};

exports.deleteActivity = async (id) => {
  const activity = await ActivityTracker.findByPk(id);
  if (!activity) return false;
  
  await activity.destroy();
  return true;
}; 