const service = require('../services/activityTrackerService');
const { User } = require('../models');
const { sendNotification } = require('../services/notificationService');

exports.create = async (req, res) => {
  try {
    const data = { ...req.body, facilitatorId: req.user.id };
    const activity = await service.createActivity(data);
    // Notify all managers
    const managers = await User.findAll({ where: { role: 'manager' } });
    for (const manager of managers) {
      await sendNotification({
        type: 'activity_log_submitted',
        recipient: manager.email,
        message: `Facilitator ${req.user.name} submitted a log for week ${activity.week}.`,
      });
    }
    res.status(201).json(activity);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const activities = await service.getActivities(req.query, req.user);
    res.json(activities);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const activity = await service.getActivityById(req.params.id, req.user);
    if (!activity) return res.status(404).json({ message: 'Not found' });
    res.json(activity);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const activity = await service.updateActivity(req.params.id, req.body, req.user);
    res.json(activity);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await service.deleteActivity(req.params.id, req.user);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}; 