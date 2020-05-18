const { Schema } = require('mongoose');

const { db } = require('../../../../shared');

const sharedUserFileDefinition = require('./definition');

const schemaOpts = {
    collection: db.names.sharedUserFile.collectionName
};

const sharedUserFileSchema = new Schema(sharedUserFileDefinition, schemaOpts);

module.exports = sharedUserFileSchema;