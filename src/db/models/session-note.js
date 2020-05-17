const db = require('..');
const { sessionNoteSchema } = require('../schemas/session-note');

const { sessionNote } = require('../names');

const SessionNote = db.getModel(sessionNote.modelName, sessionNoteSchema);

module.exports = SessionNote;