const { Schema } = require('mongoose');

const userFileDefinition = require('./definition');
const { userFile } = require('../../names');

const { generatePreRemoveHook, generateSaveFileAndDocMethod } = require('../../../util/models/user-file');

const schemaOpts = {
    collection: userFile.collectionName
};

const userFileSchema = new Schema(userFileDefinition, schemaOpts);

userFileSchema.index({ user: 1, 'file.originalname': 1 }, { unique: true });

userFileSchema.pre('remove', generatePreRemoveHook(userFile.modelName));

userFileSchema.methods.saveFileAndDoc = generateSaveFileAndDocMethod(userFile.modelName, {
    check: false,
    role: null
});

module.exports = userFileSchema;
