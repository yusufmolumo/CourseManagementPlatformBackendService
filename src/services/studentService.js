const { Student } = require('../models');

const createStudent = async (data) => Student.create(data);
const getStudents = async () => Student.findAll();
const getStudentById = async (id) => Student.findByPk(id);
const updateStudent = async (id, data) => {
  const student = await Student.findByPk(id);
  if (!student) throw new Error('Student not found');
  return student.update(data);
};
const deleteStudent = async (id) => {
  const student = await Student.findByPk(id);
  if (!student) throw new Error('Student not found');
  return student.destroy();
};

module.exports = { createStudent, getStudents, getStudentById, updateStudent, deleteStudent };