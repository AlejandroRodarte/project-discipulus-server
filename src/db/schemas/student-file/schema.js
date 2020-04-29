const { Schema } = require('mongoose');

const studentFileDefinition = require('./definition');
const { studentFile } = require('../../names');

const schemaOpts = {
    collection: studentFile.collectionName
};

const studentFileSchema = new Schema(studentFileDefinition, schemaOpts);

module.exports = studentFileSchema;
