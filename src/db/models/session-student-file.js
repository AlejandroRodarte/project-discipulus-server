const { schemas } = require('../schemas');

const getModel = require('../get-model');
const { sessionStudentFile } = require('../names');

const SessionStudentFile = getModel(sessionStudentFile.modelName, schemas.sessionStudentFileSchema);

module.exports = SessionStudentFile;
