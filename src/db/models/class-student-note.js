const db = require('..');
const { classStudentNoteSchema } = require('../schemas/class-student-note');

const { classStudentNote } = require('../names');

const ClassStudentNote = db.getModel(classStudentNote.modelName, classStudentNoteSchema);

module.exports = ClassStudentNote;