const { db } = require('../../shared');

const { schemas } = require('../schemas');
const getModel = require('../get-model');

const SessionStudent = getModel(db.names.sessionStudent.modelName, schemas.sessionStudentSchema);

module.exports = SessionStudent;
