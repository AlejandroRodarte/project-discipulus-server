
const { Schema } = require('mongoose');

const sessionStudentFileDefinition = require('./definition');
const names = require('../../names');

const commonModelUtils = require('../../../util/models/common');
const { modelErrorMessages } = require('../../../util/errors');

const schemaOpts = {
    collection: names.sessionStudentFile.collectionName
};

const sessionStudentFileSchema = new Schema(sessionStudentFileDefinition, schemaOpts);

sessionStudentFileSchema.index({ sessionStudent: 1, 'file.originalname': 1 }, { unique: true });

sessionStudentFileSchema.pre('remove', commonModelUtils.generateFilePreRemove({
    modelName: names.sessionStudentFile.modelName
}));

sessionStudentFileSchema.methods.saveFileAndDoc = commonModelUtils.generateSaveFileAndDoc({

    modelName: names.sessionStudentFile.modelName,
    
    validate: commonModelUtils.generateParentDocExistsValidator({
        parentModelName: names.sessionStudent.modelName,
        ref: 'sessionStudent',
        notFoundErrorMessage: modelErrorMessages.sessionStudentNotFouund
    })

});

module.exports = sessionStudentFileSchema;