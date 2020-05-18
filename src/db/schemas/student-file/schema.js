const { Schema } = require('mongoose');

const { db } = require('../../../shared');
const { roles, models } = require('../../../util');

const studentFileDefinition = require('./definition');

const schemaOpts = {
    collection: db.names.studentFile.collectionName
};

const studentFileSchema = new Schema(studentFileDefinition, schemaOpts);

studentFileSchema.index({ user: 1, 'file.originalname': 1 }, { unique: true });

studentFileSchema.pre('remove', models.common.generateFilePreRemove({
    modelName: db.names.studentFile.modelName
}));

studentFileSchema.methods.saveFileAndDoc = models.common.generateSaveFileAndDoc({
    modelName: db.names.studentFile.modelName,
    validate: models.common.generateUserAndRoleValidator(roles.ROLE_STUDENT)
});

module.exports = studentFileSchema;
