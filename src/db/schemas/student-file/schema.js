const { Schema } = require('mongoose');

const studentFileDefinition = require('./definition');
const { studentFile } = require('../../names');

const commonModelUtils = require('../../../util/models/common');

const roleTypes = require('../../../util/roles');

const schemaOpts = {
    collection: studentFile.collectionName
};

const studentFileSchema = new Schema(studentFileDefinition, schemaOpts);

studentFileSchema.index({ user: 1, 'file.originalname': 1 }, { unique: true });

studentFileSchema.pre('remove', commonModelUtils.generateFilePreRemove({
    modelName: studentFile.modelName
}));

studentFileSchema.methods.saveFileAndDoc = commonModelUtils.generateSaveFileAndDoc({
    modelName: studentFile.modelName,
    validate: commonModelUtils.generateUserFileRoleValidator(roleTypes.ROLE_STUDENT)
});

module.exports = studentFileSchema;
