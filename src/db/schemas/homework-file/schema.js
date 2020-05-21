
const { Schema } = require('mongoose');

const { db } = require('../../../shared');
const { errors, models } = require('../../../util');

const homeworkFileDefinition = require('./definition');

const schemaOpts = {
    collection: db.names.homeworkFile.collectionName
};

const homeworkFileSchema = new Schema(homeworkFileDefinition, schemaOpts);

homeworkFileSchema.index({ session: 1, 'file.originalname': 1 }, { unique: true });

homeworkFileSchema.pre('remove', models.common.generateFilePreRemove({
    modelName: db.names.homeworkFile.modelName
}));

homeworkFileSchema.methods.saveFileAndDoc = models.common.generateSaveFileAndDoc({

    modelName: db.names.homeworkFile.modelName,

    validate: models.common.generateParentDocExistsValidator({
        parentModelName: db.names.homework.modelName,
        ref: 'homework',
        notFoundErrorMessage: errors.modelErrorMessages.homeworkNotFound
    })
    
});

module.exports = homeworkFileSchema;