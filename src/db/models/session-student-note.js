const { db } = require('../../shared');

const { schemas } = require('../schemas');
const getModel = require('../get-model');

const SessionStudentNote = getModel(db.names.sessionStudentNote.modelName, schemas.sessionStudentNoteSchema);

module.exports = SessionStudentNote;
