const { db } = require('../../../shared');

const { shared } = require('../../schemas');
const getModel = require('../../get-model');

const SharedUserNote = getModel(db.names.sharedUserNote.modelName, shared.schemas.sharedUserNoteSchema);

module.exports = SharedUserNote;