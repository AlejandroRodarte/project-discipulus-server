const { Schema } = require('mongoose');

const userRoleDefinition = require('./definition');

const schemaOpts = {
    collection: 'userroles'
};

const userRoleSchema = new Schema(userRoleDefinition, schemaOpts);

module.exports = userRoleSchema;
