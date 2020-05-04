const { user } = require('../../../db/names');

const storageApi = require('../../../api/storage');
const bucketNames = require('../../../api/storage/config/bucket-names');

const generateSaveFileAndDocMethod = (modelName, roleConfig) => async function(buffer) {

    const { check, role } = roleConfig;

    const fileDoc = this;
    const User = fileDoc.model(user.modelName);

    const { user: userId } = fileDoc;

    const userDoc = await User.findOne({ 
        _id: userId,
        enabled: true
    });

    if (!userDoc) {
        throw new Error('Your account is currently disabled or has been deleted');
    }

    if (check) {

        const hasRole = await userDoc.hasRole(role);

        if (!hasRole) {
            throw new Error('You do not have enough permissions to store a file here');
        }

    }

    try {
        await fileDoc.save();
    } catch (e) {
        throw e;
    }

    try {
        await storageApi.createMultipartObject(bucketNames[modelName], {
            keyname: fileDoc.file.keyname,
            buffer,
            size: buffer.length,
            mimetype: fileDoc.file.mimetype
        });
    } catch (e) {
        await fileDoc.remove();
        throw e;
    }

    return fileDoc;

};

module.exports = generateSaveFileAndDocMethod;