const { schemas } = require('../schemas');

const getModel = require('../get-model');
const { userNote } = require('../names');

const UserNote = getModel(userNote.modelName, schemas.userNoteSchema);

module.exports = UserNote;
