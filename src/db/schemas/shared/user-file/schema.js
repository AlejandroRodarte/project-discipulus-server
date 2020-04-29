const { Schema } = require('mongoose');

const { sharedUserFile } = require('../../../names');

const sharedUserFileDefinition = require('./definition');

const schemaOpts = {
    collection: sharedUserFile.collectionName
};

const sharedUserFileSchema = new Schema(sharedUserFileDefinition, schemaOpts);

module.exports = sharedUserFileSchema;