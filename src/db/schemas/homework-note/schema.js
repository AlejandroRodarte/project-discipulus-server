
const { Schema } = require('mongoose');

const { db } = require('../../../shared');
const { models, errors } = require('../../../util');

const homeworkNoteDefinition = require('./definition');

const schemaOpts = {
    collection: db.names.homeworkNote.collectionName
};

const sessionNoteSchema = new Schema(homeworkNoteDefinition, schemaOpts);

sessionNoteSchema.index({ homework: 1, 'note.title': 1 }, { unique: true });

sessionNoteSchema.methods.checkAndSave = models.common.generateNoteCheckAndSave(models.common.generateParentDocExistsValidator({
    parentModelName: db.names.homework.modelName,
    ref: 'homework',
    notFoundErrorMessage: errors.modelErrorMessages.homeworkNotFound
}));

module.exports = sessionNoteSchema;