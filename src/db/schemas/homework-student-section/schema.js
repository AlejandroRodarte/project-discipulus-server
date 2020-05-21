const { db } = require('../../../shared');
const { models, errors } = require('../../../util');

const homeworkStudentSectionDefinition = require('./definition');

const schemaOpts = {
    collection: db.names.homeworkStudentSection.collectionName
};

const homeworkSectionSchema = new Schema(homeworkStudentSectionDefinition, schemaOpts);

homeworkSectionSchema.index({ homeworkStudent: 1, homeworkSection: 1 }, { unique: true });

module.exports = homeworkStudentSectionDefinition;
