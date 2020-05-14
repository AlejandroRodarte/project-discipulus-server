
const { Schema } = require('mongoose');

const classStudentFileDefinition = require('./definition');
const names = require('../../names');

const schemaOpts = {
    collection: names.classStudentFile.collectionName
};

const classStudentFileSchema = new Schema(classStudentFileDefinition, schemaOpts);

classStudentFileSchema.index({ classStudent: 1, 'file.originalname': 1 }, { unique: true });

module.exports = classStudentFileSchema;