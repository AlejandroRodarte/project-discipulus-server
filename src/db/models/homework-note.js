const { db } = require('../../shared');

const { schemas } = require('../schemas');
const getModel = require('../get-model');

const HomeworkNote = getModel(db.names.homeworkNote.modelName, schemas.homeworkNoteSchema);

module.exports = HomeworkNote;
