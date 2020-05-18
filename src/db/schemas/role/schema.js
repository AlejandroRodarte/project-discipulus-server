const { Schema } = require('mongoose');

const { db } = require('../../../shared');
const { models } = require('../../../util');

const roleDefinition = require('./definition');

const applyDeletionRules = require('../../apply-deletion-rules');

const schemaOpts = {
    collection: db.names.role.collectionName
};

const roleSchema = new Schema(roleDefinition, schemaOpts);

roleSchema.virtual('users', {
    ref: db.names.userRole.modelName,
    localField: '_id',
    foreignField: 'role'
});

roleSchema.pre('remove', async function() {

    const role = this;

    try {
        await applyDeletionRules(role, models.role.deletionRoleRules);
    } catch (e) {
        throw e;
    }

});

module.exports = roleSchema;
