const db = require('..');
const { classStudentSchema } = require('../schemas/class-student');

const { classStudent } = require('../names');

const ClassStudent = db.getModel(classStudent.modelName, classStudentSchema);

module.exports = ClassStudent;