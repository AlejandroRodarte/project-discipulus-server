
const { Schema } = require('mongoose');

const { db } = require('../../../shared');
const { errors, models } = require('../../../util');

const classStudentNoteDefinition = require('./definition');

const schemaOpts = {
    collection: db.names.classStudentNote.collectionName
};

const classStudentNoteSchema = new Schema(classStudentNoteDefinition, schemaOpts);

classStudentNoteSchema.index({ classStudent: 1, 'note.title': 1 }, { unique: true });

classStudentNoteSchema.methods.checkAndSave = models.common.generateSimpleCheckAndSave(models.common.generateParentDocExistsValidator({
    parentModelName: db.names.classStudent.modelName,
    ref: 'classStudent',
    notFoundErrorMessage: errors.modelErrorMessages.classStudentNotFound
}));

module.exports = classStudentNoteSchema;