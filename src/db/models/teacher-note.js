const { schemas } = require('../schemas');

const getModel = require('../get-model');
const { teacherNote } = require('../names');

const TeacherNote = getModel(teacherNote.modelName, schemas.teacherNoteSchema);

module.exports = TeacherNote;
