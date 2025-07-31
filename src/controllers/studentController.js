const service = require('../services/studentService');

exports.create = async (req, res) => {
  try {
    const student = await service.createStudent(req.body);
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
exports.getAll = async (req, res) => {
  try {
    const students = await service.getStudents();
    res.json(students);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
exports.getById = async (req, res) => {
  try {
    const student = await service.getStudentById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Not found' });
    res.json(student);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
exports.update = async (req, res) => {
  try {
    const student = await service.updateStudent(req.params.id, req.body);
    res.json(student);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
exports.remove = async (req, res) => {
  try {
    await service.deleteStudent(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};