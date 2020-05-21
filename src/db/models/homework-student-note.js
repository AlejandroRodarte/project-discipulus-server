const { db } = require('../../shared');

const { schemas } = require('../schemas');
const getModel = require('../get-model');

const HomeworkStudentNote = getModel(db.names.homeworkStudentNote.modelName, schemas.homeworkStudentNoteSchema);

module.exports = HomeworkStudentNote;
