const { Schema } = require('mongoose');

const teacherFileDefinition = require('./definition');
const { teacherFile } = require('../../names');

const { generatePreRemoveHook, generateSaveFileAndDocMethod } = require('../../../util/models/user-file');

const roleTypes = require('../../../util/roles');

const schemaOpts = {
    collection: teacherFile.collectionName
};

const teacherFileSchema = new Schema(teacherFileDefinition, schemaOpts);

teacherFileSchema.index({ user: 1, 'file.originalname': 1 }, { unique: true });

teacherFileSchema.pre('remove', generatePreRemoveHook({
    modelName: teacherFile.modelName
}));

teacherFileSchema.methods.saveFileAndDoc = generateSaveFileAndDocMethod({
    modelName: teacherFile.modelName,
    roleOpts: {
        check: true,
        role: roleTypes.ROLE_TEACHER
    }
});

module.exports = teacherFileSchema;
