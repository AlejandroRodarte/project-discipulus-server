const { db } = require('../../shared');

const { schemas } = require('../schemas');
const getModel = require('../get-model');

const StudentNote = getModel(db.names.studentNote.modelName, schemas.studentNoteSchema);

module.exports = StudentNote;
