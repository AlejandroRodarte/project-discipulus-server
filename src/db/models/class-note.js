const { schemas } = require('../schemas');

const getModel = require('../get-model');
const { classNote } = require('../names');

const ClassNote = getModel(classNote.modelName, schemas.classNoteSchema);

module.exports = ClassNote;
