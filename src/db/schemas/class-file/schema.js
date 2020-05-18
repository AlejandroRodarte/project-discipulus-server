
const { Schema } = require('mongoose');

const { db } = require('../../../shared');
const { models, errors } = require('../../../util');

const classFileDefinition = require('./definition');

const schemaOpts = {
    collection: db.names.classFile.collectionName
};

const classFileSchema = new Schema(classFileDefinition, schemaOpts);

classFileSchema.index({ class: 1, 'file.originalname': 1 }, { unique: true });

classFileSchema.pre('remove', models.common.generateFilePreRemove({
    modelName: db.names.classFile.modelName
}));

classFileSchema.methods.saveFileAndDoc = models.common.generateSaveFileAndDoc({

    modelName: db.names.classFile.modelName,

    validate: models.common.generateParentDocExistsValidator({
        parentModelName: db.names.class.modelName,
        ref: 'class',
        notFoundErrorMessage: errors.modelErrorMessages.classNotFound
    })
    
});

module.exports = classFileSchema;