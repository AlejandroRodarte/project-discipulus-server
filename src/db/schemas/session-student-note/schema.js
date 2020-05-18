
const { Schema } = require('mongoose');

const { db } = require('../../../shared');
const { errors, models } = require('../../../util');

const sessionStudentNoteDefinition = require('./definition');

const schemaOpts = {
    collection: db.names.sessionStudentNote.collectionName
};

const sessionStudentNoteSchema = new Schema(sessionStudentNoteDefinition, schemaOpts);

sessionStudentNoteSchema.index({ sessionStudent: 1, 'note.title': 1 }, { unique: true });

sessionStudentNoteSchema.methods.checkAndSave = models.common.generateNoteCheckAndSave(models.common.generateParentDocExistsValidator({
    parentModelName: db.names.sessionStudent.modelName,
    ref: 'sessionStudent',
    notFoundErrorMessage: errors.modelErrorMessages.sessionStudentNotFouund
}));

module.exports = sessionStudentNoteSchema;