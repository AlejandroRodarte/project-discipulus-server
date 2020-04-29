const { Schema } = require('mongoose');

const { sharedUserFile } = require('../../../names');

const schemaOpts = {
    collection: sharedUserFile.collectionName
};

const sharedUserFileSchema = new Schema(sharedParentStudentDefinition, schemaOpts);

module.exports = sharedUserFileSchema;