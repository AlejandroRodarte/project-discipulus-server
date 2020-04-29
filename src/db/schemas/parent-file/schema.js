const { Schema } = require('mongoose');

const parentFileDefinition = require('./definition');
const { parentFile } = require('../../names');

const schemaOpts = {
    collection: parentFile.collectionName
};

const parentStudentSchema = new Schema(parentFileDefinition, schemaOpts);

module.exports = parentStudentSchema;
