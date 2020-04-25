const db = require('../');
const { parentStudentSchema } = require('../schemas/parent-student');

const ParentStudent = db.getModel('ParentStudent', parentStudentSchema);

module.exports = ParentStudent;