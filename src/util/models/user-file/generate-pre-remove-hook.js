const storageApi = require('../../../api/storage');
const bucketNames = require('../../../api/storage/config/bucket-names');

const generatePreRemoveHook = ({ modelName }) => async function(next) {

    const fileDoc = this;

    try {
        await storageApi.deleteBucketObjects(bucketNames[modelName], [fileDoc.file.keyname]);
        next();
    } catch (e) {
        next(new Error('File could not be deleted'));
    }

};

module.exports = generatePreRemoveHook;
