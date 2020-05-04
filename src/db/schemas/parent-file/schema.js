const { Schema } = require('mongoose');

const parentFileDefinition = require('./definition');
const { user, parentFile } = require('../../names');

const storageApi = require('../../../api/storage');
const bucketNames = require('../../../api/storage/config/bucket-names');

const generatePreRemoveHook = require('../../../util/models/user-file/generate-pre-remove-hook');

const roleTypes = require('../../../util/roles');

const schemaOpts = {
    collection: parentFile.collectionName
};

const parentFileSchema = new Schema(parentFileDefinition, schemaOpts);

parentFileSchema.index({ user: 1, 'file.originalname': 1 }, { unique: true });

parentFileSchema.pre('remove', generatePreRemoveHook(parentFile.modelName));

parentFileSchema.methods.saveFileAndDoc = async function(buffer) {

    const parentFileDoc = this;
    const User = parentFileDoc.model(user.modelName);

    const { user: userId } = parentFileDoc;

    const parentDoc = await User.findOne({ 
        _id: userId,
        enabled: true
    });

    if (!parentDoc) {
        throw new Error('Your account is currently disabled or has been deleted');
    }

    const isParent = await parentDoc.hasRole(roleTypes.ROLE_PARENT);

    if (!isParent) {
        throw new Error('You must be a parent in order to save a file here');
    }

    try {
        await parentFileDoc.save();
    } catch (e) {
        throw e;
    }

    try {
        await storageApi.createMultipartObject(bucketNames[parentFile.modelName], {
            keyname: parentFileDoc.file.keyname,
            buffer,
            size: buffer.length,
            mimetype: parentFileDoc.file.mimetype
        });
    } catch (e) {
        await parentFileDoc.remove();
        throw e;
    }

    return parentFileDoc;

};

module.exports = parentFileSchema;
