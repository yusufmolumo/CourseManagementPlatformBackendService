const service = require('../services/activityTrackerService');
const { Facilitator, Manager, Module, CourseOffering } = require('../models');
const { sendNotification } = require('../services/notificationService');

exports.create = async (req, res) => {
  try {
    const data = { ...req.body, facilitatorId: req.user.id };
    const activity = await service.createActivity(data);
    
    // Get facilitator details
    const facilitator = await Facilitator.findByPk(req.user.id);
    if (!facilitator) {
      throw new Error('Facilitator not found');
    }

    // Get manager details
    const manager = await Manager.findByPk(facilitator.managerID);
    if (!manager) {
      throw new Error('Manager not found');
    }

    // Get course offering and module details
    const courseOffering = await CourseOffering.findByPk(data.allocationId, {
      include: [{ model: Module, as: 'Module' }]
    });

    if (courseOffering && courseOffering.Module) {
      // Send submission alert to manager
      await sendNotification({
        type: 'submission_alert',
        recipient: manager.email || 'manager@example.com',
        message: `Facilitator ${facilitator.name} submitted a log for week ${data.week || 'current'}.`,
        data: {
          managerName: manager.name,
          facilitatorName: facilitator.name,
          week: data.week || 'current',
          courseName: courseOffering.Module.name
        }
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