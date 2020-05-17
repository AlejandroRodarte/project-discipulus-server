const db = require('..');
const { sessionStudentNoteSchema } = require('../schemas/session-student-note');

const { sessionStudentNote } = require('../names');

const SessionStudentNote = db.getModel(sessionStudentNote.modelName, sessionStudentNoteSchema);

module.exports = SessionStudentNote;