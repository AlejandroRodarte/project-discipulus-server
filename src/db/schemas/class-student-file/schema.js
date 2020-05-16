
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

classStudentFileSchema.pre('remove', commonModelUtils.generateFilePreRemove({
    modelName: names.classStudentFile.modelName
}));

classStudentFileSchema.methods.saveFileAndDoc = commonModelUtils.generateSaveFileAndDoc({

    modelName: names.classStudentFile.modelName,
    
    validate: commonModelUtils.generateParentDocExistsValidator({
        parentModelName: names.classStudent.modelName,
        ref: 'classStudent',
        notFoundErrorMessage: modelErrorMessages.classStudentNotFound
    })

});

module.exports = classStudentFileSchema;