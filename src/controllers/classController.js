const service = require('../services/classService');

exports.create = async (req, res) => {
  try {
    const klass = await service.createClass(req.body);
    res.status(201).json(klass);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
exports.getAll = async (req, res) => {
  try {
    const classes = await service.getClasses();
    res.json(classes);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
exports.getById = async (req, res) => {
  try {
    const klass = await service.getClassById(req.params.id);
    if (!klass) return res.status(404).json({ message: 'Not found' });
    res.json(klass);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
exports.update = async (req, res) => {
  try {
    const klass = await service.updateClass(req.params.id, req.body);
    res.json(klass);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
exports.remove = async (req, res) => {
  try {
    await service.deleteClass(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};