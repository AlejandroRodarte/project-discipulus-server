const { Schema } = require('mongoose');

const userRoleDefinition = require('./definition');
const { userRole } = require('../../names');

const schemaOpts = {
    collection: userRole.collectionName
};

const userRoleSchema = new Schema(userRoleDefinition, schemaOpts);

userRoleSchema.index({ role: 1, user: 1 }, { unique: true });

module.exports = userRoleSchema;
