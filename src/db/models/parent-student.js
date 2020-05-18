const { db } = require('../../shared');

const { schemas } = require('../schemas');
const getModel = require('../get-model');

const ParentStudent = getModel(db.names.parentStudent.modelName, schemas.parentStudentSchema);

module.exports = ParentStudent;
