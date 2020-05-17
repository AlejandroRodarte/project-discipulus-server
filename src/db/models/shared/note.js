const { shared } = require('../../schemas');
const { sharedNote } = require('../../names');
const getModel = require('../../get-model');

const SharedNote = getModel(sharedNote.modelName, shared.schemas.sharedNoteSchema);

module.exports = SharedNote;
