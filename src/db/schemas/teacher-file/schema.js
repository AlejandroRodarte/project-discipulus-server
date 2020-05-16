const { Schema } = require('mongoose');

const teacherFileDefinition = require('./definition');
const { teacherFile } = require('../../names');

const commonModelUtils = require('../../../util/models/common');

const roleTypes = require('../../../util/roles');

const schemaOpts = {
    collection: teacherFile.collectionName
};

const teacherFileSchema = new Schema(teacherFileDefinition, schemaOpts);

teacherFileSchema.index({ user: 1, 'file.originalname': 1 }, { unique: true });

teacherFileSchema.pre('remove', commonModelUtils.generateFilePreRemove({
    modelName: teacherFile.modelName
}));

teacherFileSchema.methods.saveFileAndDoc = commonModelUtils.generateSaveFileAndDoc({
    modelName: teacherFile.modelName,
    validate: commonModelUtils.generateUserAndRoleValidator(roleTypes.ROLE_TEACHER)
});

module.exports = teacherFileSchema;
