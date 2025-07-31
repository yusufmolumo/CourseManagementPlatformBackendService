const service = require('../services/moduleService');

exports.create = async (req, res) => {
  try {
    const module = await service.createModule(req.body);
    res.status(201).json(module);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
exports.getAll = async (req, res) => {
  try {
    const modules = await service.getModules();
    res.json(modules);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
exports.getById = async (req, res) => {
  try {
    const module = await service.getModuleById(req.params.id);
    if (!module) return res.status(404).json({ message: 'Not found' });
    res.json(module);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
exports.update = async (req, res) => {
  try {
    const module = await service.updateModule(req.params.id, req.body);
    res.json(module);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
exports.remove = async (req, res) => {
  try {
    await service.deleteModule(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};