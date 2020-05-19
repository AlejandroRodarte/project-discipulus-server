const { Schema } = require('mongoose');

const { db } = require('../../../shared');
const { errors } = require('../../../util');

const userRoleDefinition = require('./definition');

const schemaOpts = {
    collection: db.names.userRole.collectionName
};

const userRoleSchema = new Schema(userRoleDefinition, schemaOpts);

userRoleSchema.index({ role: 1, user: 1 }, { unique: true });

userRoleSchema.methods.checkAndSave = async function() {

    const userRole = this;

    const User = userRole.model(db.names.user.modelName);
    const Role = userRole.model(db.names.role.modelName);

    const userExists = await User.exists({
        _id: userRole.user,
        enabled: true
    });

    if (!userExists) {
        throw new Error(errors.modelErrorMessages.userNotFoundOrDisabled);
    }

    const roleExists = await Role.exists({
        _id: userRole.role
    });

    if (!roleExists) {
        throw new Error(errors.modelErrorMessages.roleNotFound);
    }

    try {
        await userRole.save();
    } catch (e) {
        throw e;
    }

    return userRole;

};

module.exports = userRoleSchema;
