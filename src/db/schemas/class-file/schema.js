
const { Schema } = require('mongoose');

const classFileDefinition = require('./definition');
const names = require('../../names');

const schemaOpts = {
    collection: names.classFile.collectionName
};

const classFileSchema = new Schema(classFileDefinition, schemaOpts);

classFileSchema.index({ class: 1, 'file.originalname': 1 }, { unique: true });

module.exports = classFileSchema;