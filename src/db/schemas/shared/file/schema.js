const { Schema } = require('mongoose');

const sharedFileDefinition = require('./definition');
const { sharedFile } = require('../../../names');

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
