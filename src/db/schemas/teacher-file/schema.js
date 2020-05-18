const { Schema } = require('mongoose');

const { db } = require('../../../shared');
const { roles, models } = require('../../../util');

const teacherFileDefinition = require('./definition');

const schemaOpts = {
    collection: db.names.teacherFile.collectionName
};

const teacherFileSchema = new Schema(teacherFileDefinition, schemaOpts);

teacherFileSchema.index({ user: 1, 'file.originalname': 1 }, { unique: true });

teacherFileSchema.pre('remove', models.common.generateFilePreRemove({
    modelName: db.names.teacherFile.modelName
}));

teacherFileSchema.methods.saveFileAndDoc = models.common.generateSaveFileAndDoc({
    modelName: db.names.teacherFile.modelName,
    validate: models.common.generateUserAndRoleValidator(roles.ROLE_TEACHER)
});

module.exports = teacherFileSchema;
