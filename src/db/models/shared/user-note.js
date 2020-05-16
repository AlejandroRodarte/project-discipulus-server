const db = require('../../../db');
const { sharedUserNoteSchema } = require('../../schemas/shared/user-note');

const { sharedUserNote } = require('../../names');

const SharedUserNote = db.getModel(sharedUserNote.modelName, sharedUserNoteSchema);

module.exports = SharedUserNote;