const { Schema } = require('mongoose');

const { db } = require('../../../shared');
const { models, errors } = require('../../../util');

const homeworkStudentSectionDefinition = require('./definition');

const schemaOpts = {
    collection: db.names.homeworkStudentSection.collectionName
};

const homeworkStudentSectionSchema = new Schema(homeworkStudentSectionDefinition, schemaOpts);

homeworkStudentSectionSchema.index({ homeworkStudent: 1, homeworkSection: 1 }, { unique: true });

homeworkStudentSectionSchema.pre('save', async function() {

    const homeworkStudentSection = this;
    const HomeworkSection = homeworkStudentSection.model(db.names.homeworkSection.modelName);

    if (homeworkStudentSection.isModified('points')) {

        try {

            const homeworkSection = await HomeworkSection.findOne({
                _id: homeworkStudentSection.homeworkSection
            });

            if (!homeworkSection) {
                throw new Error(errors.modelErrorMessages.homeworkStudentNotFound);
            }
            
            if (homeworkSection.points < homeworkStudentSection.points) {
                throw new Error(errors.modelErrorMessages.invalidSectionPoints);
            }

        } catch (e) {
            throw e;
        }

    }

});

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
