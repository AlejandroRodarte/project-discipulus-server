
const { Schema } = require('mongoose');

const { db } = require('../../../shared');
const { errors, models } = require('../../../util');

const homeworkStudentFileDefinition = require('./definition');

const schemaOpts = {
    collection: db.names.homeworkStudentFile.collectionName
};

const homeworkStudentFileSchema = new Schema(homeworkStudentFileDefinition, schemaOpts);

homeworkStudentFileSchema.index({ sessionStudent: 1, 'file.originalname': 1 }, { unique: true });

homeworkStudentFileSchema.pre('remove', models.common.generateFilePreRemove({
    modelName: db.names.homeworkStudentFile.modelName
}));

homeworkStudentFileSchema.methods.saveFileAndDoc = models.common.generateSaveFileAndDoc({

    modelName: db.names.homeworkStudentFile.modelName,
    
    validate: models.common.generateIsTaskCompleteValidator({
        modelName: db.names.homeworkStudent.modelName,
        ref: 'homeworkStudent',
        notFoundErrorMessage: errors.modelErrorMessages.homeworkStudentNotFound,
        alreadyCompleteErrorMessage: errors.modelErrorMessages.homeworkAlreadyComplete
    })

});

module.exports = homeworkStudentFileSchema;