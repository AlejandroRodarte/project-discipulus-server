
const { Schema } = require('mongoose');

const sessionFileDefinition = require('./definition');
const names = require('../../names');

const commonModelUtils = require('../../../util/models/common');
const { modelErrorMessages } = require('../../../util/errors');

const schemaOpts = {
    collection: names.sessionFile.collectionName
};

const sessionFileSchema = new Schema(sessionFileDefinition, schemaOpts);

sessionFileSchema.index({ session: 1, 'file.originalname': 1 }, { unique: true });

sessionFileSchema.pre('remove', commonModelUtils.generateFilePreRemove({
    modelName: names.sessionFile.modelName
}));

sessionFileSchema.methods.saveFileAndDoc = commonModelUtils.generateSaveFileAndDoc({

    modelName: names.sessionFile.modelName,

    validate: commonModelUtils.generateParentDocExistsValidator({
        parentModelName: names.session.modelName,
        ref: 'session',
        notFoundErrorMessage: modelErrorMessages.sessionNotFound
    })
    
});

module.exports = sessionFileSchema;