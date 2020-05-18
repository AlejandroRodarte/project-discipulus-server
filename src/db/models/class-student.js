const { db } = require('../../shared');

const { schemas } = require('../schemas');
const getModel = require('../get-model');

const ClassStudent = getModel(db.names.classStudent.modelName, schemas.classStudentSchema);

module.exports = ClassStudent;
