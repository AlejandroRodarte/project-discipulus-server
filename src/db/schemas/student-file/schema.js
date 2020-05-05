const { Schema } = require('mongoose');

const studentFileDefinition = require('./definition');
const { studentFile } = require('../../names');

const { generatePreRemoveHook, generateSaveFileAndDocMethod } = require('../../../util/models/user-file');

const roleTypes = require('../../../util/roles');

const schemaOpts = {
    collection: studentFile.collectionName
};

const studentFileSchema = new Schema(studentFileDefinition, schemaOpts);

studentFileSchema.index({ user: 1, 'file.originalname': 1 }, { unique: true });

studentFileSchema.pre('remove', generatePreRemoveHook({
    modelName: studentFile.modelName
}));

studentFileSchema.methods.saveFileAndDoc = generateSaveFileAndDocMethod({
    modelName: studentFile.modelName,
    roleOpts: {
        check: true,
        role: roleTypes.ROLE_STUDENT
    }
});

module.exports = studentFileSchema;
