const { Schema } = require('mongoose');

const parentFileDefinition = require('./definition');
const { parentFile } = require('../../names');

const { generatePreRemoveHook, generateSaveFileAndDocMethod } = require('../../../util/models/user-file');

const roleTypes = require('../../../util/roles');

const schemaOpts = {
    collection: parentFile.collectionName
};

const parentFileSchema = new Schema(parentFileDefinition, schemaOpts);

parentFileSchema.index({ user: 1, 'file.originalname': 1 }, { unique: true });

parentFileSchema.pre('remove', generatePreRemoveHook({
    modelName: parentFile.modelName
}));

parentFileSchema.methods.saveFileAndDoc = generateSaveFileAndDocMethod({
    modelName: parentFile.modelName,
    roleOpts: {
        check: true,
        role: roleTypes.ROLE_PARENT
    }
});

module.exports = parentFileSchema;
