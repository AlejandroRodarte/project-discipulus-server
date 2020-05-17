const db = require('..');
const { sessionStudentSchema } = require('../schemas/session-student');

const { sessionStudent } = require('../names');

const SessionStudent = db.getModel(sessionStudent.modelName, sessionStudentSchema);

module.exports = SessionStudent;