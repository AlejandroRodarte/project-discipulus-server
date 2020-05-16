
const { Schema } = require('mongoose');

const classNoteDefinition = require('./definition');
const names = require('../../names');

const commonModelUtils = require('../../../util/models/common');
const { modelErrorMessages } = require('../../../util/errors');

const schemaOpts = {
    collection: names.classNote.collectionName
};

const classNoteSchema = new Schema(classNoteDefinition, schemaOpts);

classNoteSchema.index({ class: 1, 'note.title': 1 }, { unique: true });

classNoteSchema.methods.saveFileAndDoc = commonModelUtils.generateSaveFileAndDoc(commonModelUtils.generateParentDocExistsValidator({
    parentModelName: names.class.modelName,
    ref: 'class',
    notFoundErrorMessage: modelErrorMessages.classNotFound
}));

module.exports = classNoteSchema;