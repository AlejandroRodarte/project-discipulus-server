
const { Schema } = require('mongoose');

const { db } = require('../../../shared');
const { models, errors } = require('../../../util');

const classNoteDefinition = require('./definition');

const schemaOpts = {
    collection: db.names.classNote.collectionName
};

const classNoteSchema = new Schema(classNoteDefinition, schemaOpts);

classNoteSchema.index({ class: 1, 'note.title': 1 }, { unique: true });

classNoteSchema.methods.checkAndSave = models.common.generateSimpleCheckAndSave(models.common.generateParentDocExistsValidator({
    parentModelName: db.names.class.modelName,
    ref: 'class',
    notFoundErrorMessage: errors.modelErrorMessages.classNotFound
}));

module.exports = classNoteSchema;