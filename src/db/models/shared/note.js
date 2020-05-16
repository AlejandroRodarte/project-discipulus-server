const db = require('../../../db');
const { sharedNoteSchema } = require('../../schemas/shared/note');

const { sharedNote } = require('../../names');

const SharedNote = db.getModel(sharedNote.modelName, sharedNoteSchema);

module.exports = SharedNote;
