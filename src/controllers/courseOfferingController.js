const service = require('../services/courseOfferingService');

exports.create = async (req, res) => {
  try {
    const offering = await service.createCourseOffering(req.body);
    res.status(201).json(offering);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const offerings = await service.getCourseOfferings(req.query);
    res.json(offerings);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const offering = await service.getCourseOfferingById(req.params.id);
    if (!offering) return res.status(404).json({ message: 'Not found' });
    res.json(offering);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const offering = await service.updateCourseOffering(req.params.id, req.body);
    res.json(offering);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await service.deleteCourseOffering(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}; 