const { Schema } = require('mongoose');

const { db } = require('../../../shared');
const { models, errors } = require('../../../util');

const homeworkSectionDefinition = require('./definition');

const schemaOpts = {
    collection: db.names.homeworkSection.collectionName
};

const homeworkSectionSchema = new Schema(homeworkSectionDefinition, schemaOpts);

homeworkSectionSchema.index({ homework: 1, title: 1 }, { unique: true });

homeworkSectionSchema.methods.checkAndSave = async function() {

    const homeworkSection = this;
    const Homework = homeworkSection.model(db.names.homework.modelName);

    const homework = await Homework.findOne({
        _id: homeworkSection.homework
    });

    if (!homework) {
        throw new Error(errors.modelErrorMessages.homeworkNotFound);
    }

    if (homework.type !== models.class.gradeType.SECTIONS) {
        throw new Error(errors.modelErrorMessages.invalidHomeworkType);
    }

    try {
        await homeworkSection.save();
    } catch (e) {
        throw e;
    }

    return homeworkSection;

};

module.exports = homeworkSectionSchema;