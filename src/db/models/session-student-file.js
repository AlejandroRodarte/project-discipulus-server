const { db } = require('../../shared');

const { schemas } = require('../schemas');
const getModel = require('../get-model');

const SessionStudentFile = getModel(db.names.sessionStudentFile.modelName, schemas.sessionStudentFileSchema);

module.exports = SessionStudentFile;
