
const { Schema } = require('mongoose');
const moment = require('moment');

const { db } = require('../../../shared');
const { errors, models } = require('../../../util');

const homeworkStudentFileDefinition = require('./definition');

const schemaOpts = {
    collection: db.names.homeworkStudentFile.collectionName
};

const homeworkStudentFileSchema = new Schema(homeworkStudentFileDefinition, schemaOpts);

homeworkStudentFileSchema.index({ homeworkStudent: 1, 'file.originalname': 1 }, { unique: true });

homeworkStudentFileSchema.pre('remove', models.common.generateFilePreRemove({
    modelName: db.names.homeworkStudentFile.modelName
}));

homeworkStudentFileSchema.methods.getTaskValidationData = models.common.generateGetTaskValidationData({
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
});

homeworkStudentFileSchema.methods.saveFileAndDoc = models.common.generateSaveFileAndDoc({

    modelName: db.names.homeworkStudentFile.modelName,
    
    validate: models.common.generateTaskValidator({
        alreadyCompleteErrorMessage: errors.modelErrorMessages.homeworkAlreadyComplete,
        expiredErrorMessage: errors.modelErrorMessages.homeworkExpired
    })

});

module.exports = homeworkStudentFileSchema;