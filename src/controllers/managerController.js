const service = require('../services/managerService');

exports.create = async (req, res) => {
  try {
    const manager = await service.createManager(req.body);
    res.status(201).json(manager);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
exports.getAll = async (req, res) => {
  try {
    const managers = await service.getManagers();
    res.json(managers);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
exports.getById = async (req, res) => {
  try {
    const manager = await service.getManagerById(req.params.id);
    if (!manager) return res.status(404).json({ message: 'Not found' });
    res.json(manager);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
exports.update = async (req, res) => {
  try {
    const manager = await service.updateManager(req.params.id, req.body);
    res.json(manager);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
exports.remove = async (req, res) => {
  try {
    await service.deleteManager(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};