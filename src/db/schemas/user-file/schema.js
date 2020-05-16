const { Schema } = require('mongoose');

const userFileDefinition = require('./definition');
const { userFile } = require('../../names');

const commonModelUtils = require('../../../util/models/common');

const schemaOpts = {
    collection: userFile.collectionName
};

const userFileSchema = new Schema(userFileDefinition, schemaOpts);

userFileSchema.index({ user: 1, 'file.originalname': 1 }, { unique: true });

userFileSchema.pre('remove', commonModelUtils.generateFilePreRemove({
    modelName: userFile.modelName
}));

userFileSchema.methods.saveFileAndDoc = commonModelUtils.generateSaveFileAndDoc({
    modelName: userFile.modelName,
    validate: commonModelUtils.userFileNoteValidator
});

module.exports = userFileSchema;
