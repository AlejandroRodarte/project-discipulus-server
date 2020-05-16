const db = require('..');
const { userNoteSchema } = require('../schemas/user-note');

const { userNote } = require('../names');

const UserNote = db.getModel(userNote.modelName, userNoteSchema);

module.exports = UserNote;