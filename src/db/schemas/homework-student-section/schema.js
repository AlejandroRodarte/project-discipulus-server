const { Schema } = require('mongoose');

const { db } = require('../../../shared');
const { models, errors } = require('../../../util');

const homeworkStudentSectionDefinition = require('./definition');

const schemaOpts = {
    collection: db.names.homeworkStudentSection.collectionName
};

const homeworkStudentSectionSchema = new Schema(homeworkStudentSectionDefinition, schemaOpts);

homeworkStudentSectionSchema.index({ homeworkStudent: 1, homeworkSection: 1 }, { unique: true });

module.exports = homeworkStudentSectionSchema;
