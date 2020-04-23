const { Schema } = require('mongoose');

const roleDefinition = require('./definition');

const schemaOpts = {
    collection: 'roles'
};

const roleSchema = new Schema(roleDefinition, schemaOpts);

roleSchema.virtual('roleusers', {
    ref: 'UserRole',
    localField: '_id',
    foreignField: 'role'
});

module.exports = roleSchema;
