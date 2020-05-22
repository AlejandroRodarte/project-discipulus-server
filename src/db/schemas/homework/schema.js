const { Schema } = require('mongoose');

const { db } = require('../../../shared');
const { models, errors } = require('../../../util');

const homeworkDefinition = require('./definition');
const applyDeletionRules = require('../../apply-deletion-rules');

const schemaOpts = {
    collection: db.names.homework.collectionName
};

const homeworkSchema = new Schema(homeworkDefinition, schemaOpts);

homeworkSchema.index({ class: 1, title: 1 }, { unique: true });

homeworkSchema.virtual('files', {
    ref: db.names.homeworkFile.modelName,
    localField: '_id',
    foreignField: 'homework'
});

homeworkSchema.virtual('notes', {
    ref: db.names.homeworkNote.modelName,
    localField: '_id',
    foreignField: 'homework'
});

homeworkSchema.virtual('sections', {
    ref: db.names.homeworkSection.modelName,
    localField: '_id',
    foreignField: 'homework'
});

homeworkSchema.virtual('students', {
    ref: db.names.homeworkStudent.modelName,
    localField: '_id',
    foreignField: 'homework'
});

homeworkSchema.pre('remove', async function() {

    const homework = this;

    try {
        applyDeletionRules(homework, models.homework.deletionHomeworkRules);
    } catch (e) {
        throw e;
    }

});

homeworkSchema.methods.saveAndAddStudents = models.common.generateSaveAndAddStudents({
    parent: {
        modelName: db.names.class.modelName,
        ref: 'class',
        notFoundErrorMessage: errors.modelErrorMessages.classNotFound,
        getIdsMethodName: 'getEnabledStudentIds'
    },
    child: {
        modelName: db.names.homeworkStudent.modelName,
        doc: {
            ref1: 'homework',
            ref2: 'classStudent'
        }
    }
});

module.exports = homeworkSchema;