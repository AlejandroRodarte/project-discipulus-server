const { Schema } = require('mongoose');

const { db } = require('../../../../shared');

const sharedFileDefinition = require('./definition');

const schemaOpts = {
    collection: db.names.sharedFile.collectionName
};

const sharedFileSchema = new Schema(sharedFileDefinition, schemaOpts);

sharedFileSchema.virtual('keyname').get(function() {

    const file = this;
    const [, ...extensions] = file.originalname.split('.');

    return `${file._id.toHexString()}.${extensions.join('.')}`;

});

module.exports = sharedFileSchema;
