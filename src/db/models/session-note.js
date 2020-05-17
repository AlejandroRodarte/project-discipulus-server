const { schemas } = require('../schemas');

const getModel = require('../get-model');
const { sessionNote } = require('../names');

const SessionNote = getModel(sessionNote.modelName, schemas.sessionNoteSchema);

module.exports = SessionNote;
