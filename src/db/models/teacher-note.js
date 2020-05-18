const { db } = require('../../shared');

const { schemas } = require('../schemas');
const getModel = require('../get-model');

const TeacherNote = getModel(db.names.teacherNote.modelName, schemas.teacherNoteSchema);

module.exports = TeacherNote;
