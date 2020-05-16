const db = require('..');
const { parentNoteSchema } = require('../schemas/parent-note');

const { parentNote } = require('../names');

const ParentNote = db.getModel(parentNote.modelName, parentNoteSchema);

module.exports = ParentNote;