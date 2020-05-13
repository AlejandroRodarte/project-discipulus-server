const { Schema } = require('mongoose');

const classStudentDefinition = require('./definition');
const { classStudent } = require('../../names');

const schemaOpts = {
    collection: classStudent.collectionName
};

const classStudentSchema = new Schema(classStudentDefinition, schemaOpts);

classStudentSchema.index({ class: 1, user: 1 }, { unique: true });

module.exports = classStudentSchema;