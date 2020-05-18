
const { Schema } = require('mongoose');

const { db } = require('../../../shared');
const { errors, models } = require('../../../util');

const sessionFileDefinition = require('./definition');

const schemaOpts = {
    collection: db.names.sessionFile.collectionName
};

const sessionFileSchema = new Schema(sessionFileDefinition, schemaOpts);

sessionFileSchema.index({ session: 1, 'file.originalname': 1 }, { unique: true });

sessionFileSchema.pre('remove', models.common.generateFilePreRemove({
    modelName: db.names.sessionFile.modelName
}));

sessionFileSchema.methods.saveFileAndDoc = models.common.generateSaveFileAndDoc({

    modelName: db.names.sessionFile.modelName,

    validate: models.common.generateParentDocExistsValidator({
        parentModelName: db.names.session.modelName,
        ref: 'session',
        notFoundErrorMessage: errors.modelErrorMessages.sessionNotFound
    })
    
});

module.exports = sessionFileSchema;