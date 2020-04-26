const { Schema } = require('mongoose');

const UserRole = require('../../models/user-role');

const roleDefinition = require('./definition');
const { role, userRole } = require('../../names');

const schemaOpts = {
    collection: role.collectionName
};

const roleSchema = new Schema(roleDefinition, schemaOpts);

roleSchema.virtual('roleusers', {
    ref: userRole.modelName,
    localField: '_id',
    foreignField: 'role'
});

roleSchema.pre('remove', async function(next) {

    const role = this;

    await UserRole.deleteMany({
        role: role._id
    });

    next();

});

module.exports = roleSchema;
