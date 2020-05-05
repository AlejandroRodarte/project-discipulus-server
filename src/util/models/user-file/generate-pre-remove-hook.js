const storageApi = require('../../../api/storage');
const bucketNames = require('../../../api/storage/config/bucket-names');

const generatePreRemoveHook = ({ modelName }) => async function() {

    const fileDoc = this;

    try {
        await storageApi.deleteBucketObjects(bucketNames[modelName], [fileDoc.file.keyname]);
    } catch (e) {
        throw e;
    }

};

module.exports = generatePreRemoveHook;
