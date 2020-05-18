const { db } = require('../../shared');

const { schemas } = require('../schemas');
const getModel = require('../get-model');

const SessionNote = getModel(db.names.sessionNote.modelName, schemas.sessionNoteSchema);

module.exports = SessionNote;
