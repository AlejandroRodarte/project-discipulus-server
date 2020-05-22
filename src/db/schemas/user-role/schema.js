const { Schema } = require('mongoose');

const { db } = require('../../../shared');
const { models, errors } = require('../../../util');

const userRoleDefinition = require('./definition');

const schemaOpts = {
    collection: db.names.userRole.collectionName
};

const userRoleSchema = new Schema(userRoleDefinition, schemaOpts);

userRoleSchema.index({ role: 1, user: 1 }, { unique: true });

userRoleSchema.methods.checkAndSave = models.common.generateSimpleCheckAndSave(models.common.generateJointExistsValidator({
    left: {
        modelName: db.names.user.modelName,
        ref: 'user',
        extraCond: {
            enabled: true
        }
    },
    right: {
        modelName: db.names.role.modelName,
        ref: 'role',
        extraCond: {}
    }
}));

module.exports = userRoleSchema;
