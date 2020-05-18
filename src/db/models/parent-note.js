const { db } = require('../../shared');

const { schemas } = require('../schemas');
const getModel = require('../get-model');

const ParentNote = getModel(db.names.parentNote.modelName, schemas.parentNoteSchema);

module.exports = ParentNote;
