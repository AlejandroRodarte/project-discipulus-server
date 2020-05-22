const { Schema } = require('mongoose');

const { db } = require('../../../shared');
const { models, errors } = require('../../../util');

const { homeworkStudentSectionPipelines } = require('../../aggregation');
const homeworkStudentSectionDefinition = require('./definition');

const schemaOpts = {
    collection: db.names.homeworkStudentSection.collectionName
};

const homeworkStudentSectionSchema = new Schema(homeworkStudentSectionDefinition, schemaOpts);

homeworkStudentSectionSchema.index({ homeworkStudent: 1, homeworkSection: 1 }, { unique: true });

homeworkStudentSectionSchema.pre('save', async function() {

    const homeworkStudentSection = this;

    if (homeworkStudentSection.isModified('points')) {

        try {

            const sectionPoints = await homeworkStudentSection.getSectionPoints();
            
            if (sectionPoints < homeworkStudentSection.points) {
                throw new Error(errors.modelErrorMessages.invalidSectionPoints);
            }

        } catch (e) {
            throw e;
        }

    }

});

homeworkStudentSectionSchema.methods.getSectionPoints = async function() {

    const homeworkStudentSection = this;
    const HomeworkStudentSection = homeworkStudentSection.constructor;

    const docs = await HomeworkStudentSection.aggregate(homeworkStudentSectionPipelines.getSectionPoints(homeworkStudentSection._id));

    if (!docs.length) {
        throw new Error(errors.modelErrorMessages.homeworkStudentSectionNotFound);
    }

    const [data] = docs;

    return data.points;

};

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
