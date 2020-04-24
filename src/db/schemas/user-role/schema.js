const { Schema } = require('mongoose');

const userRoleDefinition = require('./definition');

const schemaOpts = {
    collection: 'userroles'
};

const userRoleSchema = new Schema(userRoleDefinition, schemaOpts);

userRoleSchema.index({ role: 1, user: 1 }, { unique: true });

module.exports = userRoleSchema;
