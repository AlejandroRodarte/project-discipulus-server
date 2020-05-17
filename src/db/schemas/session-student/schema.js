const { Schema } = require('mongoose');

const sessionStudentDefinition = require('./definition');
const names = require('../../names');

const schemaOpts = {
    collection: names.sessionStudent.collectionName
};

const sessionStudentSchema = new Schema(sessionStudentDefinition, schemaOpts);

sessionStudentSchema.index({ classStudent: 1, session: 1 }, { unique: true });

module.exports = sessionStudentSchema;