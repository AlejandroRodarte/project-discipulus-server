const { Schema } = require('mongoose');
const moment = require('moment');

const { db } = require('../../../shared');
const { models, errors } = require('../../../util');

const { homeworkStudentPipelines } = require('../../aggregation');
const homeworkStudentDefinition = require('./definition');
const applyDeletionRules = require('../../apply-deletion-rules');

const schemaOpts = {
    collection: db.names.homeworkStudent.collectionName
};

const homeworkStudentSchema = new Schema(homeworkStudentDefinition, schemaOpts);

homeworkStudentSchema.index({ classStudent: 1, homework: 1 }, { unique: true });

homeworkStudentSchema.virtual('grade').get(async function() {

    const homeworkStudent = this;
    const Homework = homeworkStudent.model(db.names.homework.modelName);

    const homework = await Homework.findOne({
        _id: homeworkStudent.homework
    });

    if (!homework) {
        throw new Error(errors.modelErrorMessages.homeworkNotFound);
    }

    switch (homework.type) {
        case models.class.gradeType.NO_SECTIONS:
            return homeworkStudent.directGrade;
        case models.class.gradeType.SECTIONS:
            return homeworkStudent.directGrade; // TODO: must return ponderated grade
        default:
            break;
    }

});

homeworkStudentSchema.virtual('files', {
    ref: db.names.homeworkStudentFile.modelName,
    localField: '_id',
    foreignField: 'homeworkStudent'
});

homeworkStudentSchema.virtual('notes', {
    ref: db.names.homeworkStudentNote.modelName,
    localField: '_id',
    foreignField: 'homeworkStudent'
});

homeworkStudentSchema.virtual('sections', {
    ref: db.names.homeworkStudentSection.modelName,
    localField: '_id',
    foreignField: 'homeworkStudent'
});

homeworkStudentSchema.pre('save', async function() {

    const homeworkStudent = this;

    if (homeworkStudent.isModified('directGrade')) {

        const type = await homeworkStudent.getHomeworkType();

        if (type === models.class.gradeType.SECTIONS) {
            throw new Error(errors.modelErrorMessages.homeworkSectionMisjudgement);
        }

    }

});

homeworkStudentSchema.pre('remove', async function() {

    const homeworkStudent = this;

    try {
        applyDeletionRules(homeworkStudent, models.homeworkStudent.deletionHomeworkStudentRules);
    } catch (e) {
        throw e;
    }

});

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

        if (!classStudent.forceHomeworkUpload && (homework.timeRange && homework.timeRange.end && moment().utc().unix() > homework.timeRange.end)) {
            throw new Error(errors.modelErrorMessages.homeworkExpired);
        }

    }
});

module.exports = homeworkStudentSchema;