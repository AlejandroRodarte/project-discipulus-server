const { Schema } = require('mongoose');

const UserRole = require('../../models/user-role');

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

roleSchema.pre('remove', async function(next) {

    const role = this;

    await UserRole.deleteMany({
        role: role._id
    });

    next();

});

module.exports = roleSchema;
