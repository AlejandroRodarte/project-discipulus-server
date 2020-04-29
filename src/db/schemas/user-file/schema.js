const { Schema } = require('mongoose');

const userFileDefinition = require('./definition');
const { userFile } = require('../../names');

const schemaOpts = {
    collection: userFile.collectionName
};

const userFileSchema = new Schema(userFileDefinition, schemaOpts);

module.exports = userFileSchema;
