const { Schema, model } = require('mongoose');

const sharedParentStudentDefinition = require('./definition');
const { sharedParentStudent, user } = require('../../../names');

const roleTypes = require('../../../../util/roles');

const schemaOpts = {
    collection: sharedParentStudent.collectionName
};

const parentStudentSchema = new Schema(sharedParentStudentDefinition, schemaOpts);

parentStudentSchema.index({ parent: 1, student: 1 }, { unique: true });

module.exports = parentStudentSchema;
