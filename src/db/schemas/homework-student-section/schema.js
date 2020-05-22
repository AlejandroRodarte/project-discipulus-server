const { Schema } = require('mongoose');

const { db } = require('../../../shared');
const { models, errors } = require('../../../util');

const homeworkStudentSectionDefinition = require('./definition');

const schemaOpts = {
    collection: db.names.homeworkStudentSection.collectionName
};

const homeworkStudentSectionSchema = new Schema(homeworkStudentSectionDefinition, schemaOpts);

homeworkStudentSectionSchema.index({ homeworkStudent: 1, homeworkSection: 1 }, { unique: true });

homeworkStudentSectionSchema.methods.checkAndSave = models.common.generateSimpleCheckAndSave(models.common.generateJointExistsValidator({
    left: {
        modelName: db.names.homeworkStudent.modelName,
        ref: 'homeworkStudent',
        extraCond: {}
    },
    right: {
        modelName: db.names.homeworkSection.modelName,
        ref: 'homeworkSection',
        extraCond: {}
    }
}));

module.exports = homeworkStudentSectionSchema;
