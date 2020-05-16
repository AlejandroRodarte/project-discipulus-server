const { Schema } = require('mongoose');

const parentFileDefinition = require('./definition');
const { parentFile, user } = require('../../names');

const commonModelUtils = require('../../../util/models/common');

const roleTypes = require('../../../util/roles');

const schemaOpts = {
    collection: parentFile.collectionName
};

const parentFileSchema = new Schema(parentFileDefinition, schemaOpts);

parentFileSchema.index({ user: 1, 'file.originalname': 1 }, { unique: true });

parentFileSchema.pre('remove', commonModelUtils.generateFilePreRemove({
    modelName: parentFile.modelName,
}));

parentFileSchema.methods.saveFileAndDoc = commonModelUtils.generateSaveFileAndDoc({
    modelName: parentFile.modelName,
    validate: commonModelUtils.generateUserAndRoleValidator(roleTypes.ROLE_PARENT)
});

module.exports = parentFileSchema;
