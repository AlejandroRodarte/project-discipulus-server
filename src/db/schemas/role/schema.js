const { Schema } = require('mongoose');

const roleDefinition = require('./definition');

const schemaOpts = {
    collection: 'roles'
};

const roleSchema = new Schema(roleDefinition, schemaOpts);

module.exports = roleSchema;
