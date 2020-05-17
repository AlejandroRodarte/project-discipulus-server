const { schemas } = require('../schemas');

const getModel = require('../get-model');
const { parentStudent } = require('../names');

const ParentStudent = getModel(parentStudent.modelName, schemas.parentStudentSchema);

module.exports = ParentStudent;
