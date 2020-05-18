const { Schema } = require('mongoose');

const { db } = require('../../../shared');
const { roles, models } = require('../../../util');

const parentFileDefinition = require('./definition');

const schemaOpts = {
    collection: db.names.parentFile.collectionName
};

const parentFileSchema = new Schema(parentFileDefinition, schemaOpts);

parentFileSchema.index({ user: 1, 'file.originalname': 1 }, { unique: true });

parentFileSchema.pre('remove', models.common.generateFilePreRemove({
    modelName: db.names.parentFile.modelName,
}));

parentFileSchema.methods.saveFileAndDoc = models.common.generateSaveFileAndDoc({
    modelName: db.names.parentFile.modelName,
    validate: models.common.generateUserAndRoleValidator(roles.ROLE_PARENT)
});

module.exports = parentFileSchema;
