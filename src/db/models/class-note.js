const db = require('..');
const { classNoteSchema } = require('../schemas/class-note');

const { classNote } = require('../names');

const ClassNote = db.getModel(classNote.modelName, classNoteSchema);

module.exports = ClassNote;