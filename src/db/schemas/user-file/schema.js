const { Schema, model } = require('mongoose');

const userFileDefinition = require('./definition');
const { user, userFile } = require('../../names');

const storageApi = require('../../../api/storage');
const bucketNames = require('../../../api/storage/config/bucket-names');

const schemaOpts = {
    collection: userFile.collectionName
};

const userFileSchema = new Schema(userFileDefinition, schemaOpts);

userFileSchema.index({ user: 1, 'file.originalname': 1 }, { unique: true });

userFileSchema.pre('remove', async function(next) {

    const userFileDoc = this;

    try {
        await storageApi.deleteBucketObjects(bucketNames[userFile.modelName], [userFileDoc.file.keyname]);
        next();
    } catch (e) {
        next(new Error('File could not be deleted'));
    }

});

userFileSchema.methods.saveFileAndDoc = async function(buffer) {

    const userFileDoc = this;
    const User = model(user.modelName);

    const { user: userId } = userFileDoc;

    const userDoc = await User.findOne({ 
        _id: userId,
        enabled: true
    });

    if (!userDoc) {
        throw new Error('Your account is currently disabled');
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
