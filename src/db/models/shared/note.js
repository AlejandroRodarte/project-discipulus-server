const { db } = require('../../../shared');

const { shared } = require('../../schemas');
const getModel = require('../../get-model');

const SharedNote = getModel(db.names.sharedNote.modelName, shared.schemas.sharedNoteSchema);

module.exports = SharedNote;
