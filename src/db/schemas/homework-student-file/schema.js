
const { Schema } = require('mongoose');

const { db } = require('../../../shared');
const { errors, models } = require('../../../util');

const homeworkStudentFileDefinition = require('./definition');
const { sharedPipelines } = require('../../aggregation');

const schemaOpts = {
    collection: db.names.homeworkStudentFile.collectionName
};

const homeworkStudentFileSchema = new Schema(homeworkStudentFileDefinition, schemaOpts);

homeworkStudentFileSchema.index({ sessionStudent: 1, 'file.originalname': 1 }, { unique: true });

homeworkStudentFileSchema.pre('remove', models.common.generateFilePreRemove({
    modelName: db.names.homeworkStudentFile.modelName
}));

homeworkStudentFileSchema.methods.getTaskValidationData = async function() {

    const homeworkStudentFile = this;
    const HomeworkStudentFile = homeworkStudentFile.constructor;

    const docs = await HomeworkStudentFile.aggregate(sharedPipelines.getTaskValidationData({
        child: {
            collectionName: db.names.homeworkStudent.collectionName,
            ref: 'homeworkStudent'
        },
        grandChildOne: {
            collectionName: db.names.classStudent.collectionName,
            ref: 'classStudent',
            forcedFlagRef: 'forceHomeworkUpload'
        },
        grandChildTwo: {
            collectionName: db.names.homework.collectionName,
            ref: 'homework'
        }
    }));

    if (!docs.length) {
        throw new Error(errors.modelErrorMessages.taskValidationDataNotFound);
    }

    const [validationData] = docs;

    return validationData;

};

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