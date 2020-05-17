const { schemas } = require('../schemas');

const getModel = require('../get-model');
const { sessionStudentNote } = require('../names');

const SessionStudentNote = getModel(sessionStudentNote.modelName, schemas.sessionStudentNoteSchema);

module.exports = SessionStudentNote;
