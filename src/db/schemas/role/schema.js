const { Schema } = require('mongoose');

const roleDefinition = require('./definition');
const { role, userRole } = require('../../names');

const deletionRoleRules = require('../../../util/models/role/deletion-role-rules');

const { applyDeletionRules } = require('../../../db');

const schemaOpts = {
    collection: role.collectionName
};

const roleSchema = new Schema(roleDefinition, schemaOpts);

roleSchema.virtual('roleUsers', {
    ref: userRole.modelName,
    localField: '_id',
    foreignField: 'role'
});

roleSchema.pre('remove', async function() {

    const role = this;

    try {
        await applyDeletionRules(role, deletionRoleRules);
    } catch (e) {
        throw e;
    }

});

module.exports = roleSchema;
