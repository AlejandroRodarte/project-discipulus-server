const { db } = require('../../shared');

const { schemas } = require('../schemas');
const getModel = require('../get-model');

const UserNote = getModel(db.names.userNote.modelName, schemas.userNoteSchema);

module.exports = UserNote;
