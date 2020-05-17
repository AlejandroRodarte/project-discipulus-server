const { schemas } = require('../schemas');

const getModel = require('../get-model');
const { classStudentNote } = require('../names');

const ClassStudentNote = getModel(classStudentNote.modelName, schemas.classStudentNoteSchema);

module.exports = ClassStudentNote;
