const { Schema } = require('mongoose');
const { v4 } = require('uuid');

const sharedFileDefinition = require('./definition');
const { sharedFile } = require('../../../names');

const uuidv4 = v4;

const schemaOpts = {
    collection: sharedFile.collectionName
};

const sharedFileSchema = new Schema(sharedFileDefinition, schemaOpts);

sharedFileSchema.virtual('keyname').get(function() {

    const file = this;
    const [, ...extensions] = file.originalname.split('.');

    return `${file._id.toHexString()}.${extensions.join('.')}`;

});

module.exports = sharedFileSchema;
