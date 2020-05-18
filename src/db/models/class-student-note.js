const { db } = require('../../shared');

const { schemas } = require('../schemas');
const getModel = require('../get-model');

const ClassStudentNote = getModel(db.names.classStudentNote.modelName, schemas.classStudentNoteSchema);

module.exports = ClassStudentNote;
