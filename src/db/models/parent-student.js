const db = require('../');
const { parentStudentSchema } = require('../schemas/parent-student');

const { parentStudent } = require('../names');

const ParentStudent = db.getModel(parentStudent.modelName, parentStudentSchema);

module.exports = ParentStudent;