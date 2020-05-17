const db = require('..');
const { sessionStudentFileSchema } = require('../schemas/session-student-file');

const { sessionStudentFile } = require('../names');

const SessionStudentFile = db.getModel(sessionStudentFile.modelName, sessionStudentFileSchema);

module.exports = SessionStudentFile;