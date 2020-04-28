const { Schema } = require('mongoose');
const { v4 } = require('uuid');

const sharedFileDefinition = require('./definition');
const { sharedFile } = require('../../../names');

const uuidv4 = v4;

const schemaOpts = {
    collection: sharedFile.collectionName
};

const sharedFileSchema = new Schema(sharedFileDefinition, schemaOpts);

sharedFileSchema.pre('validate', function(next) {

    const file = this;

    if (file.originalname && !file.keyname) {
        const [, ...extensions] = file.originalname.split('.');
        file.keyname = `${uuidv4()}.${extensions.join('.')}`;
    }

    next();

});

module.exports = sharedFileSchema;
