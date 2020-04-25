const { Schema } = require('mongoose');

const parentStudentDefinition = require('./definition');

const schemaOpts = {
    collection: 'parentsstudents'
};

const parentStudentSchema = new Schema(parentStudentDefinition, schemaOpts);

parentStudentSchema.index({ parent: 1, student: 1 }, { unique: true });

module.exports = parentStudentSchema;
