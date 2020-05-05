const { Schema } = require('mongoose');

const teacherFileDefinition = require('./definition');
const { teacherFile } = require('../../names');

const { generatePreRemoveHook, generateSaveFileAndDocMethod } = require('../../../util/models/user-file');

const roleTypes = require('../../../util/roles');

const schemaOpts = {
    collection: teacherFile.collectionName
};

const teacherFileSchema = new Schema(teacherFileDefinition, schemaOpts);

teacherFile.index({ user: 1, 'file.originalname': 1 }, { unique: true });

teacherFile.pre('remove', generatePreRemoveHook({
    modelName: teacherFile.modelName
}));

teacherFile.methods.saveFileAndDoc = generateSaveFileAndDocMethod({
    modelName: teacherFile.modelName,
    roleOpts: {
        check: true,
        role: roleTypes.ROLE_TEACHER
    }
});

module.exports = teacherFileSchema;
