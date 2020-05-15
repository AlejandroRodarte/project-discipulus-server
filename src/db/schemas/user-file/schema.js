const { Schema } = require('mongoose');

const userFileDefinition = require('./definition');
const { userFile, user } = require('../../names');

const commonModelUtils = require('../../../util/models/common');

const { modelErrorMessages } = require('../../../util/errors');

const schemaOpts = {
    collection: userFile.collectionName
};

const userFileSchema = new Schema(userFileDefinition, schemaOpts);

userFileSchema.index({ user: 1, 'file.originalname': 1 }, { unique: true });

userFileSchema.pre('remove', commonModelUtils.generateFilePreRemove({
    modelName: userFile.modelName
}));

userFileSchema.methods.saveFileAndDoc = commonModelUtils.generateSaveFileAndDoc({

    modelName: userFile.modelName,
    
    validate: async (fileDoc) => {

        const User = fileDoc.model(user.modelName);

        const { user: userId } = fileDoc;

        const userExists = await User.exists({ 
            _id: userId,
            enabled: true
        });

        if (!userExists) {
            throw new Error(modelErrorMessages.userNotFoundOrDisabled);
        }

    }

});

module.exports = userFileSchema;
