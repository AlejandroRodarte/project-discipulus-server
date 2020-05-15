
const { Schema } = require('mongoose');

const classFileDefinition = require('./definition');
const names = require('../../names');

const commonModelUtils = require('../../../util/models/common');
const { modelErrorMessages } = require('../../../util/errors');

const schemaOpts = {
    collection: names.classFile.collectionName
};

const classFileSchema = new Schema(classFileDefinition, schemaOpts);

classFileSchema.index({ class: 1, 'file.originalname': 1 }, { unique: true });

classFileSchema.pre('remove', commonModelUtils.generateCommonFilePreRemoveHook({
    modelName: names.classFile.modelName
}));

classFileSchema.methods.saveFileAndDoc = commonModelUtils.generateCommonSaveFileAndDoc({
    modelName: names.classFile.modelName,
    parentModelName: names.class.modelName,
    ref: 'class',
    notFoundErrorMessage: modelErrorMessages.classNotFound
});

module.exports = classFileSchema;