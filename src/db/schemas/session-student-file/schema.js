
const { Schema } = require('mongoose');

const { db } = require('../../../shared');
const { errors, models } = require('../../../util');

const sessionStudentFileDefinition = require('./definition');

const schemaOpts = {
    collection: db.names.sessionStudentFile.collectionName
};

const sessionStudentFileSchema = new Schema(sessionStudentFileDefinition, schemaOpts);

sessionStudentFileSchema.index({ sessionStudent: 1, 'file.originalname': 1 }, { unique: true });

sessionStudentFileSchema.pre('remove', models.common.generateFilePreRemove({
    modelName: db.names.sessionStudentFile.modelName
}));

sessionStudentFileSchema.methods.saveFileAndDoc = models.common.generateSaveFileAndDoc({

    modelName: db.names.sessionStudentFile.modelName,
    
    validate: models.common.generateParentDocExistsValidator({
        parentModelName: db.names.sessionStudent.modelName,
        ref: 'sessionStudent',
        notFoundErrorMessage: errors.modelErrorMessages.sessionStudentNotFound
    })

});

module.exports = sessionStudentFileSchema;