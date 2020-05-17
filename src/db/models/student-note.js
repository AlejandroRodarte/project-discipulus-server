const { schemas } = require('../schemas');

const getModel = require('../get-model');
const { studentNote } = require('../names');

const StudentNote = getModel(studentNote.modelName, schemas.studentNoteSchema);

module.exports = StudentNote;
