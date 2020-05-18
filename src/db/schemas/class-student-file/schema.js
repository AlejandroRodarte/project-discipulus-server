
const { Schema } = require('mongoose');

const { db } = require('../../../shared');
const { errors, models } = require('../../../util');

const classStudentFileDefinition = require('./definition');

const schemaOpts = {
    collection: db.names.classStudentFile.collectionName
};

const classStudentFileSchema = new Schema(classStudentFileDefinition, schemaOpts);

classStudentFileSchema.index({ classStudent: 1, 'file.originalname': 1 }, { unique: true });

classStudentFileSchema.pre('remove', models.common.generateFilePreRemove({
    modelName: db.names.classStudentFile.modelName
}));

classStudentFileSchema.methods.saveFileAndDoc = models.common.generateSaveFileAndDoc({

    modelName: db.names.classStudentFile.modelName,
    
    validate: models.common.generateParentDocExistsValidator({
        parentModelName: db.names.classStudent.modelName,
        ref: 'classStudent',
        notFoundErrorMessage: errors.modelErrorMessages.classStudentNotFound
    })

});

module.exports = classStudentFileSchema;