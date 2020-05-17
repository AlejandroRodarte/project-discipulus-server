const { shared } = require('../../schemas');
const { sharedUserNote } = require('../../names');
const getModel = require('../../get-model');

const SharedUserNote = getModel(sharedUserNote.modelName, shared.schemas.sharedUserNoteSchema);

module.exports = SharedUserNote;