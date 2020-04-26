const { Schema } = require('mongoose');
const { v4 } = require('uuid');

const fileDefinition = require('./definition');
const { file } = require('../../names');

const uuidv4 = v4;

const schemaOpts = {
    collection: file.collectionName
};

const fileSchema = new Schema(fileDefinition, schemaOpts);

fileSchema.pre('validate', function(next) {

    const file = this;

    if (file.originalname && !file.keyname) {
        const [, ...extensions] = file.originalname.split('.');
        file.keyname = `${uuidv4()}.${extensions.join('.')}`;
    }

    next();

});

module.exports = fileSchema;
