const { Schema } = require('mongoose');

const userFileDefinition = require('./definition');
const { user, userFile } = require('../../names');

const storageApi = require('../../../api/storage');
const bucketNames = require('../../../api/storage/config/bucket-names');

const generatePreRemoveHook = require('../../../util/models/user-file/generate-pre-remove-hook');

const schemaOpts = {
    collection: userFile.collectionName
};

const userFileSchema = new Schema(userFileDefinition, schemaOpts);

userFileSchema.index({ user: 1, 'file.originalname': 1 }, { unique: true });

userFileSchema.pre('remove', generatePreRemoveHook(userFile.modelName));

userFileSchema.methods.saveFileAndDoc = async function(buffer) {

    const userFileDoc = this;
    const User = userFileDoc.model(user.modelName);

    const { user: userId } = userFileDoc;

    const userDoc = await User.findOne({ 
        _id: userId,
        enabled: true
    });

    if (!userDoc) {
        throw new Error('Your account is currently disabled or has been deleted');
    }

    try {
        await userFileDoc.save();
    } catch (e) {
        throw e;
    }

    try {
        await storageApi.createMultipartObject(bucketNames[userFile.modelName], {
            keyname: userFileDoc.file.keyname,
            buffer,
            size: buffer.length,
            mimetype: userFileDoc.file.mimetype
        });
    } catch (e) {
        await userFileDoc.remove();
        throw e;
    }

    return userFileDoc;

};

module.exports = userFileSchema;
