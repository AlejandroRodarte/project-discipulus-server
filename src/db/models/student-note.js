const db = require('..');
const { studentNoteSchema } = require('../schemas/student-note');

const { studentNote } = require('../names');

const StudentNote = db.getModel(studentNote.modelName, studentNoteSchema);

module.exports = StudentNote;