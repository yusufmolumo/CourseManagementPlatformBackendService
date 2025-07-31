const service = require('../services/allocationService');

exports.create = async (req, res) => {
  try {
    const allocation = await service.createAllocation(req.body);
    res.status(201).json(allocation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
exports.getAll = async (req, res) => {
  try {
    const allocations = await service.getAllocations();
    res.json(allocations);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
exports.getById = async (req, res) => {
  try {
    const allocation = await service.getAllocationById(req.params.id);
    if (!allocation) return res.status(404).json({ message: 'Not found' });
    res.json(allocation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
exports.update = async (req, res) => {
  try {
    const allocation = await service.updateAllocation(req.params.id, req.body);
    res.json(allocation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
exports.remove = async (req, res) => {
  try {
    await service.deleteAllocation(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};