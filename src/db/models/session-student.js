const { schemas } = require('../schemas');

const getModel = require('../get-model');
const { sessionStudent } = require('../names');

const SessionStudent = getModel(sessionStudent.modelName, schemas.sessionStudentSchema);

module.exports = SessionStudent;
