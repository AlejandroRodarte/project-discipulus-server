const { Schema } = require('mongoose');

const { db } = require('../../../shared');
const { models } = require('../../../util');

const userFileDefinition = require('./definition');

const schemaOpts = {
    collection: db.names.userFile.collectionName
};

const userFileSchema = new Schema(userFileDefinition, schemaOpts);

userFileSchema.index({ user: 1, 'file.originalname': 1 }, { unique: true });

userFileSchema.pre('remove', models.common.generateFilePreRemove({
    modelName: db.names.userFile.modelName
}));

userFileSchema.methods.saveFileAndDoc = models.common.generateSaveFileAndDoc({
    modelName: db.names.userFile.modelName,
    validate: models.common.userExistsValidator
});

module.exports = userFileSchema;
