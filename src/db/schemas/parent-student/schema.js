const { Schema } = require('mongoose');

const parentStudentDefinition = require('./definition');
const { parentStudent, user } = require('../../names');

const roles = require('../../../util/roles');

const schemaOpts = {
    collection: parentStudent.collectionName
};

const parentStudentSchema = new Schema(parentStudentDefinition, schemaOpts);

parentStudentSchema.index({ parent: 1, student: 1 }, { unique: true });

module.exports = parentStudentSchema;
