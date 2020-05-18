const { db } = require('../../shared');

const { schemas } = require('../schemas');
const getModel = require('../get-model');

const ClassNote = getModel(db.names.classNote.modelName, schemas.classNoteSchema);

module.exports = ClassNote;
