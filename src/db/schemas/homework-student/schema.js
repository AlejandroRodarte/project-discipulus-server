const { Schema } = require('mongoose');
const moment = require('moment');

const { db } = require('../../../shared');
const { models, errors } = require('../../../util');

const homeworkStudentDefinition = require('./definition');
const applyDeletionRules = require('../../apply-deletion-rules');

const schemaOpts = {
    collection: db.names.homeworkStudent.collectionName
};

const homeworkStudentSchema = new Schema(homeworkStudentDefinition, schemaOpts);

homeworkStudentSchema.index({ classStudent: 1, homework: 1 }, { unique: true });

homeworkStudentSchema.methods.checkAndSave = models.common.generateClassStudentChildCheckAndSave({
    foreignModel: {
        name: db.names.homework.modelName,
        ref: 'homework',
        notFoundErrorMessage: errors.modelErrorMessages.homeworkNotFound
    },
    validate: async (classStudent, homework) => {

        const isStudentEnabled = await classStudent.isStudentEnabled();

        if (!isStudentEnabled) {
            throw new Error(errors.modelErrorMessages.userDisabled);
        }

        if (!classStudent.forceHomeworkUpload || (homework.timeRange && homework.timeRange.end && moment().utc().unix() > homework.timeRange.end)) {
            throw new Error(errors.modelErrorMessages.homeworkExpired);
        }

    }
});

module.exports = homeworkStudentSchema;