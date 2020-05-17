const { schemas } = require('../schemas');

const getModel = require('../get-model');
const { parentNote } = require('../names');

const ParentNote = getModel(parentNote.modelName, schemas.parentNoteSchema);

module.exports = ParentNote;
