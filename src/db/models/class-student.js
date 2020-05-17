const { schemas } = require('../schemas');

const getModel = require('../get-model');
const { classStudent } = require('../names');

const ClassStudent = getModel(classStudent.modelName, schemas.classStudentSchema);

module.exports = ClassStudent;
