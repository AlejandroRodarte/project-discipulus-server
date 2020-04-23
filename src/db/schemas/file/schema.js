const { Schema } = require('mongoose');
const { v4 } = require('uuid');

const fileDefinition = require('./definition');

const uuidv4 = v4;

const schemaOpts = {
    collection: 'files'
};

const fileSchema = new Schema(fileDefinition, schemaOpts);

fileSchema.pre('validate', function(next) {

    const file = this;

    const [, extension] = file.originalname.split('.');
    file.keyname = `${uuidv4()}.${extension}`;

    next();

});

module.exports = fileSchema;
