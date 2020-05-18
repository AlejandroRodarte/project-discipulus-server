const { Schema } = require('mongoose');

const { db } = require('../../../../shared');

const sharedParentStudentDefinition = require('./definition');

const schemaOpts = {
    collection: db.names.sharedParentStudent.collectionName
};

const parentStudentSchema = new Schema(sharedParentStudentDefinition, schemaOpts);

parentStudentSchema.index({ parent: 1, student: 1 }, { unique: true });

module.exports = parentStudentSchema;
