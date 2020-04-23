const { Schema } = require('mongoose');

const fileDefinition = require('./definition');

const schemaOpts = {
    collection: 'files'
};

const fileSchema = new Schema(fileDefinition, schemaOpts);

module.exports = fileSchema;
