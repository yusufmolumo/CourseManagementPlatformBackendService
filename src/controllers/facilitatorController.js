const service = require('../services/facilitatorService');

exports.create = async (req, res) => {
  try {
    const facilitator = await service.createFacilitator(req.body);
    res.status(201).json(facilitator);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
exports.getAll = async (req, res) => {
  try {
    const facilitators = await service.getFacilitators();
    res.json(facilitators);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
exports.getById = async (req, res) => {
  try {
    const facilitator = await service.getFacilitatorById(req.params.id);
    if (!facilitator) return res.status(404).json({ message: 'Not found' });
    res.json(facilitator);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
exports.update = async (req, res) => {
  try {
    const facilitator = await service.updateFacilitator(req.params.id, req.body);
    res.json(facilitator);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
exports.remove = async (req, res) => {
  try {
    await service.deleteFacilitator(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};