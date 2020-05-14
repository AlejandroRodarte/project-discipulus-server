const { Schema } = require('mongoose');

const roleDefinition = require('./definition');
const { role, userRole } = require('../../names');

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

    await role.model(userRole.modelName).deleteMany({
        role: role._id
    });

});

module.exports = roleSchema;
