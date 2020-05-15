
const { Schema } = require('mongoose');

const classStudentFileDefinition = require('./definition');
const names = require('../../names');

const commonModelUtils = require('../../../util/models/common');
const { modelErrorMessages } = require('../../../util/errors');

const schemaOpts = {
    collection: names.classStudentFile.collectionName
};

const classStudentFileSchema = new Schema(classStudentFileDefinition, schemaOpts);

classStudentFileSchema.index({ classStudent: 1, 'file.originalname': 1 }, { unique: true });

classFileSchema.pre('remove', commonModelUtils.generateCommonFilePreRemoveHook({
    modelName: names.classStudentFile.modelName
}));

classFileSchema.methods.saveFileAndDoc = commonModelUtils.generateCommonSaveFileAndDoc({
    modelName: names.classStudentFile.modelName,
    parentModelName: names.classStudent.modelName,
    ref: 'classStudent',
    notFoundErrorMessage: modelErrorMessages.classStudentNotFound
});

module.exports = classStudentFileSchema;