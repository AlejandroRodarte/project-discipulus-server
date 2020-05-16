const db = require('..');
const { teacherNoteSchema } = require('../schemas/teacher-note');

const { teacherNote } = require('../names');

const TeacherNote = db.getModel(teacherNote.modelName, teacherNoteSchema);

module.exports = TeacherNote;