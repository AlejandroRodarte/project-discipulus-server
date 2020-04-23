const { Schema } = require('mongoose');

const userDefinition = require('./definition');

const schemaOpts = {
    collection: 'users'
};

const userSchema = new Schema(userDefinition, schemaOpts);

module.exports = userSchema;
