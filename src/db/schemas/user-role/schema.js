const { Schema } = require('mongoose');

const { db } = require('../../../shared');

const userRoleDefinition = require('./definition');

const schemaOpts = {
    collection: db.names.userRole.collectionName
};

const userRoleSchema = new Schema(userRoleDefinition, schemaOpts);

userRoleSchema.index({ role: 1, user: 1 }, { unique: true });

module.exports = userRoleSchema;
