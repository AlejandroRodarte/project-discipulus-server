const { Schema } = require('mongoose');

const { db } = require('../../../shared');
const { models, errors } = require('../../../util');

const homeworkSectionDefinition = require('./definition');

const schemaOpts = {
    collection: db.names.homeworkSection.collectionName
};

const homeworkSectionSchema = new Schema(homeworkSectionDefinition, schemaOpts);

homeworkSectionSchema.index({ homework: 1, title: 1 }, { unique: true });

homeworkSectionSchema.virtual('students', {
    ref: db.names.homeworkStudentSection,
    localField: '_id',
    foreignField: 'homeworkSection'
});

homeworkSectionSchema.pre('remove', async function() {

    const homeworkSection = this;

    try {
        applyDeletionRules(homeworkSection, models.homeworkSection.deletionHomeworkSectionRules);
    } catch (e) {
        throw e;
    }

});

homeworkSectionSchema.methods.saveAndAddStudents = models.common.generateSaveAndAddStudents({
    parent: {
        modelName: db.names.homework.modelName,
        ref: 'homework',
        notFoundErrorMessage: errors.modelErrorMessages.homeworkNotFound,
        getIdsMethodName: 'getHomeworkStudentIds'
    },
    child: {
        modelName: db.names.homeworkStudentSection.modelName,
        doc: {
            ref1: 'homeworkSection',
            ref2: 'homeworkStudent'
        }
    },
    validate: async (homework) => {
        if (homework.type !== db.models.class.gradeType.SECTIONS) {
            throw new Error(errors.modelErrorMessages.invalidHomeworkType);
        }
    }
});

module.exports = homeworkSectionSchema;